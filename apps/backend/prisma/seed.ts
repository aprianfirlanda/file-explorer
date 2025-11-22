import "dotenv/config";
import {PrismaClient} from "../src/generated/prisma/client";
import {PrismaPg} from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({connectionString});
const prisma = new PrismaClient({adapter});

async function main() {
  console.log("🌱 Seeding folder data...");

  // Helper to create a folder quickly
  const create = async (name: string, parentId: string | null = null) => {
    return prisma.folder.create({
      data: {name, parentId},
    });
  };

  // ROOT
  const rootDocuments = await create("Documents");
  const rootDownloads = await create("Downloads");
  const rootMusic = await create("Music");

  // DOCUMENTS subtree
  const docsProjects = await create("Projects", rootDocuments.id);
  await create("Personal", rootDocuments.id);
  await create("Reports", rootDocuments.id);

  // Project children
  await create("Go Backend", docsProjects.id);
  await create("Vue Frontend", docsProjects.id);
  await create("Mobile App", docsProjects.id);

  // DOWNLOADS subtree
  const downloadsImages = await create("Images", rootDownloads.id);
  const downloadsVideos = await create("Videos", rootDownloads.id);

  // Add sample children
  await create("Wallpapers", downloadsImages.id);
  await create("Memes", downloadsImages.id);
  await create("Clips", downloadsVideos.id);

  // MUSIC subtree
  await create("Pop", rootMusic.id);
  await create("Rock", rootMusic.id);
  await create("Jazz", rootMusic.id);

  console.log("✅ Seed finished.");
}

try {
  await main();
} catch (e) {
  console.error("Seed error:", e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}

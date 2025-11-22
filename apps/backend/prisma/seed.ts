import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding folder & file data...");

  // Helper to create a folder quickly
  const createFolder = async (name: string, parentId: string | null = null) => {
    return prisma.folder.create({
      data: { name, parentId },
    });
  };

  // Helper to create a file
  const createFile = async (
    name: string,
    folderId: string,
    sizeBytes: number = 1024,
    mimeType: string = "text/plain"
  ) => {
    return prisma.file.create({
      data: { name, folderId, sizeBytes, mimeType },
    });
  };

  // ROOT
  const rootDocuments = await createFolder("Documents");
  const rootDownloads = await createFolder("Downloads");
  const rootMusic = await createFolder("Music");

  // DOCUMENTS subtree
  const docsProjects = await createFolder("Projects", rootDocuments.id);
  const docsPersonal = await createFolder("Personal", rootDocuments.id);
  const docsReports = await createFolder("Reports", rootDocuments.id);

  // Project children
  const goBackend = await createFolder("Go Backend", docsProjects.id);
  const vueFrontend = await createFolder("Vue Frontend", docsProjects.id);
  const mobileApp = await createFolder("Mobile App", docsProjects.id);

  // Add files to DOCUMENTS
  await createFile("resume.pdf", rootDocuments.id, 120000, "application/pdf");
  await createFile("todo.txt", docsPersonal.id, 450, "text/plain");
  await createFile("report-q4.xlsx", docsReports.id, 240000, "application/vnd.ms-excel");

  // DOWNLOADS subtree
  const downloadsImages = await createFolder("Images", rootDownloads.id);
  const downloadsVideos = await createFolder("Videos", rootDownloads.id);

  // Add children folders
  const wallpapers = await createFolder("Wallpapers", downloadsImages.id);
  const memes = await createFolder("Memes", downloadsImages.id);
  const clips = await createFolder("Clips", downloadsVideos.id);

  // Add files to DOWNLOADS
  await createFile("wallpaper1.jpg", wallpapers.id, 500000, "image/jpeg");
  await createFile("funny-meme.png", memes.id, 200000, "image/png");
  await createFile("video-clip.mp4", clips.id, 5000000, "video/mp4");

  // MUSIC subtree
  const musicPop = await createFolder("Pop", rootMusic.id);
  const musicRock = await createFolder("Rock", rootMusic.id);
  const musicJazz = await createFolder("Jazz", rootMusic.id);

  // Add files to MUSIC
  await createFile("pop-hit.mp3", musicPop.id, 3000000, "audio/mpeg");
  await createFile("rock-anthem.mp3", musicRock.id, 3500000, "audio/mpeg");
  await createFile("smooth-jazz.mp3", musicJazz.id, 2800000, "audio/mpeg");

  // Add files to project children
  await createFile("backend-design.md", goBackend.id, 1200, "text/markdown");
  await createFile("frontend-notes.md", vueFrontend.id, 980, "text/markdown");
  await createFile("app-plan.pdf", mobileApp.id, 890000, "application/pdf");

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

import {
  File as FileIcon,
  Image as ImageIcon,
  FileJson,
  FileText,
  FileCode,
  FileSpreadsheet,
  FileVideo,
  FileAudio,
  FileArchive,
} from "lucide-vue-next";

export function getFileIconByMime(mime: string | null) {
  if (!mime) return FileIcon;

  // Images
  if (mime.startsWith("image/")) return ImageIcon;

  // Video
  if (mime.startsWith("video/")) return FileVideo;

  // Audio
  if (mime.startsWith("audio/")) return FileAudio;

  // JSON
  if (mime.includes("json")) return FileJson;

  // PDF
  if (mime === "application/pdf") return FileText;

  // Text files
  if (mime.startsWith("text/")) return FileText;

  // Excel / CSV
  if (
    mime.includes("spreadsheet") ||
    mime.includes("excel") ||
    mime.includes("csv")
  ) {
    return FileSpreadsheet;
  }

  // Zip / compressed
  if (
    mime.includes("zip") ||
    mime.includes("tar") ||
    mime.includes("gzip") ||
    mime.includes("rar")
  ) {
    return FileArchive;
  }

  // Code-like files
  if (
    mime.includes("javascript") ||
    mime.includes("typescript") ||
    mime.includes("html") ||
    mime.includes("css") ||
    mime.includes("xml")
  ) {
    return FileCode;
  }

  // Fallback
  return FileIcon;
}

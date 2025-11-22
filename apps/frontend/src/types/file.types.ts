export interface FileEntity {
  sizeBytes: number | null;
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  folderId: string;
  mimeType: string | null;
}

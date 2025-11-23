import type { FolderNode } from "../types/folder";

export function findPathToFolder(
  nodes: FolderNode[],
  targetId: string
): FolderNode[] | null {
  for (const node of nodes) {
    if (node.id === targetId) return [node];

    if (node.children && node.children.length > 0) {
      const childPath = findPathToFolder(node.children, targetId);
      if (childPath) {
        return [node, ...childPath];
      }
    }
  }
  return null;
}

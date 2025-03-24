"use client";

import { Resource } from "@/shared/resource";
import { File, Folder } from "lucide-react";

interface FileListProps {
  resources: Resource[];
  isLoading: boolean;
  onResourceClick: (resource: Resource) => void;
}

export function FileList({
  resources,
  isLoading,
  onResourceClick,
}: FileListProps) {
  console.log(resources);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No files found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {resources.map((resource) => {
        const name =
          resource.inode_path.path.split("/").pop() || resource.inode_path.path;
        const isFolder = resource.inode_type === "directory";

        return (
          <div
            key={resource.resource_id}
            className={`flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer`}
            onClick={() => onResourceClick(resource)}
          >
            <div className="flex items-center space-x-3 min-w-0">
              {isFolder ? (
                <Folder className="h-5 w-5 text-gray-500" />
              ) : (
                <File className="h-5 w-5 text-gray-500" />
              )}
              <p className="text-sm text-gray-900 truncate">{name}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

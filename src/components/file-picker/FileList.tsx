"use client";

import { Resource } from "@/shared/resource";
import { File, Folder } from "lucide-react";
import { useApp } from "@/stores/useApp";

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
  const { selectedResources, toggleResourceSelection } = useApp();

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
        const isSelected = selectedResources.has(resource.resource_id);

        return (
          <div
            key={resource.resource_id}
            className={`flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 ${
              isSelected ? "bg-blue-50 border-blue-200" : ""
            }`}
          >
            <div className="flex items-center space-x-3 min-w-0">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  toggleResourceSelection(resource.resource_id);
                }}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <div
                className="flex items-center space-x-2 cursor-pointer"
                onClick={() => onResourceClick(resource)}
              >
                {isFolder ? (
                  <Folder className="h-5 w-5 text-gray-500" />
                ) : (
                  <File className="h-5 w-5 text-gray-500" />
                )}
                <p className="text-sm text-gray-900 truncate">{name}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

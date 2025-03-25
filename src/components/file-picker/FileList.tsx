"use client";

import { Resource } from "@/shared/resource";
import { File, Folder, Check } from "lucide-react";
import { useApp } from "@/stores/useApp";
import { useKnowledgeBaseResources } from "@/services/hooks/useKnowledgeBaseResources";

interface FileListProps {
  resources: Resource[];
  isLoading: boolean;
  onResourceClick: (resource: Resource) => void;
  currentPath: string;
}

export function FileList({
  resources,
  isLoading,
  onResourceClick,
  currentPath,
}: FileListProps) {
  const { selectedResources, toggleResourceSelection, currentKnowledgeBaseId } =
    useApp();
  const { data: kbResources } = useKnowledgeBaseResources(
    currentKnowledgeBaseId ?? undefined,
    currentPath
  );

  // Create a map of indexed resources for quick lookup
  const indexedResourcesMap = new Map(
    kbResources?.data?.map((r) => [r.resource_id, r.status]) || []
  );

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
        const indexingStatus = indexedResourcesMap.get(resource.resource_id);

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
                onClick={() => onResourceClick(resource)}
                className="flex items-center space-x-2 cursor-pointer"
              >
                {isFolder ? (
                  <Folder className="h-5 w-5 text-gray-500" />
                ) : (
                  <File className="h-5 w-5 text-gray-500" />
                )}
                <p className="text-sm text-gray-900 truncate">{name}</p>
              </div>
            </div>
            {indexingStatus && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{indexingStatus}</span>
                {indexingStatus === "indexed" && (
                  <Check className="h-4 w-4 text-green-500" />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

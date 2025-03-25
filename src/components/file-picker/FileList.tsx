"use client";

import { Resource } from "@/shared/resource";
import { File, Folder, Check, Trash2 } from "lucide-react";
import { useApp } from "@/stores/useApp";
import { useKnowledgeBaseResources } from "@/services/hooks/useKnowledgeBaseResources";
import { useUnindexResource } from "@/services/hooks/useUnindexResource";
import { useState } from "react";

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
  const { data: kbResources, mutate: mutateKnowledgeBaseResources } =
    useKnowledgeBaseResources(currentKnowledgeBaseId ?? undefined, currentPath);
  const { unindexResource } = useUnindexResource();
  const [unindexing, setUnindexing] = useState<string | null>(null);

  // Create a map of indexed resources for quick lookup
  const indexedResourcesMap = new Map(
    kbResources?.data?.map((r) => [r.resource_id, r.status]) || []
  );

  const getResourceStatus = (resourceId: string) => {
    return indexedResourcesMap.get(resourceId);
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "indexed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "pending_delete":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const formatStatus = (status: string | undefined) => {
    if (!status) return "";
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const isResourceIndexed = (resourceId: string) => {
    const status = getResourceStatus(resourceId);
    return status && status !== "pending_delete";
  };

  const handleUnindex = async (resource: Resource, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentKnowledgeBaseId) return;

    try {
      setUnindexing(resource.resource_id);
      const resourcePath = resource.inode_path.path;
      await unindexResource(currentKnowledgeBaseId, resourcePath);
    } catch (error) {
      console.error("Failed to unindex resource:", error);
    } finally {
      setUnindexing(null);
      mutateKnowledgeBaseResources();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!resources.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No files found
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {resources.map((resource) => {
        const isSelected = selectedResources.has(resource.resource_id);
        const isIndexed = isResourceIndexed(resource.resource_id);
        const isUnindexing = unindexing === resource.resource_id;

        return (
          <div
            key={resource.resource_id}
            className={`flex items-center justify-between p-2 rounded cursor-pointer ${
              isSelected ? "bg-gray-100" : "hover:bg-gray-50"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onResourceClick(resource);
            }}
          >
            <div className="flex items-center space-x-2">
              <div
                className="p-2 rounded cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleResourceSelection(resource.resource_id);
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}}
                  className="h-4 w-4 text-blue-600"
                />
              </div>
              {resource.inode_type === "directory" ? (
                <Folder className="h-4 w-4 text-gray-500" />
              ) : (
                <File className="h-4 w-4 text-gray-500" />
              )}
              <span className="text-sm text-gray-700">
                {resource.inode_path.path.split("/").pop()}
              </span>
              {getResourceStatus(resource.resource_id) && (
                <div
                  className={`flex items-center space-x-1 ${getStatusColor(
                    getResourceStatus(resource.resource_id)
                  )}`}
                >
                  {isResourceIndexed(resource.resource_id) && (
                    <Check className="h-4 w-4" />
                  )}
                  <span className="text-xs">
                    {formatStatus(getResourceStatus(resource.resource_id))}
                  </span>
                </div>
              )}
            </div>
            {isIndexed && (
              <button
                onClick={(e) => handleUnindex(resource, e)}
                className="p-1 hover:bg-gray-100 rounded"
                disabled={isUnindexing}
              >
                {isUnindexing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
                ) : (
                  <Trash2 className="h-4 w-4 text-red-500" />
                )}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

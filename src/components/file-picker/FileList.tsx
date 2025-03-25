"use client";

import { Resource } from "@/shared/resource";
import { File, Folder, Check, Trash2, ArrowUpDown, Search } from "lucide-react";
import { useApp } from "@/stores/useApp";
import { useKnowledgeBaseResources } from "@/services/hooks/useKnowledgeBaseResources";
import { useUnindexResource } from "@/services/hooks/useUnindexResource";
import { useState } from "react";

type SortField = "name" | "date";
type SortOrder = "asc" | "desc";

interface SortConfig {
  field: SortField;
  order: SortOrder;
}

interface FileListProps {
  resources: Resource[];
  isLoading: boolean;
  onResourceClick: (resource: Resource) => void;
  currentPath: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function FileList({
  resources,
  isLoading,
  onResourceClick,
  currentPath,
  searchQuery,
  onSearchChange,
}: FileListProps) {
  const { selectedResources, toggleResourceSelection, currentKnowledgeBaseId } =
    useApp();
  const { data: kbResources, mutate: mutateKnowledgeBaseResources } =
    useKnowledgeBaseResources(currentKnowledgeBaseId ?? undefined, currentPath);
  const { unindexResource } = useUnindexResource();
  const [unindexing, setUnindexing] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "name",
    order: "asc",
  });

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

  const handleSort = (field: SortField) => {
    setSortConfig((prevConfig) => ({
      field,
      order:
        prevConfig.field === field && prevConfig.order === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const sortResources = (resources: Resource[]) => {
    const sortedResources = [...resources];

    // First sort by type (directories first)
    sortedResources.sort((a, b) => {
      if (a.inode_type === "directory" && b.inode_type === "file") return -1;
      if (a.inode_type === "file" && b.inode_type === "directory") return 1;
      return 0;
    });

    // Then apply the selected sort
    sortedResources.sort((a, b) => {
      if (sortConfig.field === "name") {
        const aName = a.inode_path.path.split("/").pop() || "";
        const bName = b.inode_path.path.split("/").pop() || "";
        return sortConfig.order === "asc"
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName);
      } else {
        const aDate = new Date(a.modified_at).getTime();
        const bDate = new Date(b.modified_at).getTime();
        return sortConfig.order === "asc" ? aDate - bDate : bDate - aDate;
      }
    });

    return sortedResources;
  };

  const filterResources = (resources: Resource[]) => {
    if (!searchQuery) return resources;

    const query = searchQuery.toLowerCase();
    return resources.filter((resource) => {
      const name = resource.inode_path.path.split("/").pop() || "";
      return name.toLowerCase().includes(query);
    });
  };

  const filteredAndSortedResources = sortResources(filterResources(resources));

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

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();

    // If less than 24 hours ago, show relative time
    if (diff < 24 * 60 * 60 * 1000) {
      const hours = Math.floor(diff / (60 * 60 * 1000));
      if (hours < 1) {
        const minutes = Math.floor(diff / (60 * 1000));
        return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
      }
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }

    // If less than 7 days ago, show day of week
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      return d.toLocaleDateString("en-US", { weekday: "long" });
    }

    // Otherwise show full date
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-2 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleSort("name")}
            className={`flex items-center space-x-1 text-sm ${
              sortConfig.field === "name" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <span>Name</span>
            <ArrowUpDown className="h-3 w-3" />
          </button>
          <button
            onClick={() => handleSort("date")}
            className={`flex items-center space-x-1 text-sm ${
              sortConfig.field === "date" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            <span>Date</span>
            <ArrowUpDown className="h-3 w-3" />
          </button>
        </div>

        <div className="relative flex items-center w-full sm:w-auto">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full sm:w-64 pl-9 pr-4 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-1">
        {filteredAndSortedResources.map((resource) => {
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
              <div className="flex items-center space-x-2 min-w-0">
                <div
                  className="p-2 rounded cursor-pointer shrink-0"
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
                  <Folder className="h-4 w-4 text-gray-500 shrink-0" />
                ) : (
                  <File className="h-4 w-4 text-gray-500 shrink-0" />
                )}
                <div className="flex flex-col min-w-0">
                  <span className="text-sm text-gray-700 truncate">
                    {resource.inode_path.path.split("/").pop()}
                  </span>
                  <span className="text-xs text-gray-500">
                    Modified {formatDate(resource.modified_at)}
                  </span>
                </div>
                {getResourceStatus(resource.resource_id) && (
                  <div
                    className={`flex items-center space-x-1 ${getStatusColor(
                      getResourceStatus(resource.resource_id)
                    )} shrink-0 ml-2`}
                  >
                    {isResourceIndexed(resource.resource_id) && (
                      <Check className="h-4 w-4" />
                    )}
                    <span className="text-xs hidden sm:inline">
                      {formatStatus(getResourceStatus(resource.resource_id))}
                    </span>
                  </div>
                )}
              </div>
              {isIndexed && (
                <button
                  onClick={(e) => handleUnindex(resource, e)}
                  className="p-1 hover:bg-gray-100 rounded shrink-0 ml-2"
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
    </div>
  );
}

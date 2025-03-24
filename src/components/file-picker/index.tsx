"use client";

import { Resource } from "@/shared/resource";
import { Connection } from "@/shared/connection";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { FileList } from "./FileList";
import { useApp } from "@/stores/useApp";
import { useState, useEffect } from "react";
import { useListResources } from "@/services/hooks/useListResources";

interface FilePickerProps {
  connections: Connection[];
}

export function FilePicker({ connections }: FilePickerProps) {
  const {
    selectedIntegration,
    folderStack,
    searchQuery,
    navigateToFolder,
    setSearchQuery,
  } = useApp();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    data: resources,
    isLoading,
    error,
  } = useListResources(
    selectedIntegration || undefined,
    folderStack.length > 0 ? folderStack[folderStack.length - 1].id : "/"
  );

  const handleResourceClick = (resource: Resource) => {
    if (resource.inode_type === "directory") {
      const folderName =
        resource.inode_path.path.split("/").pop() || resource.inode_path.path;
      navigateToFolder(resource.resource_id, folderName);
    } else if (resource.dataloader_metadata?.web_url) {
      window.open(resource.dataloader_metadata.web_url, "_blank");
    }
  };

  const filteredResources =
    resources?.filter((resource) => {
      const name =
        resource.inode_path.path.split("/").pop() || resource.inode_path.path;
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    }) || [];

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      const menuButton = document.getElementById("menu-button");

      if (
        sidebar &&
        menuButton &&
        !sidebar.contains(event.target as Node) &&
        !menuButton.contains(event.target as Node) &&
        isSidebarOpen
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">
            {error instanceof Error
              ? error.message
              : "Failed to load resources"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Dark overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <Sidebar connections={connections} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          folderStack={folderStack}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 overflow-auto p-4">
          <FileList
            resources={filteredResources}
            isLoading={isLoading}
            onResourceClick={handleResourceClick}
          />
        </main>
      </div>
    </div>
  );
}

"use client";

import { Menu, Home, Search, Database } from "lucide-react";
import { useApp } from "@/stores/useApp";
import { useCreateKnowledgeBase } from "@/services/hooks/useCreateKnowledgeBase";
import { useSyncKnowledgeBase } from "@/services/hooks/useSyncKnowledgeBase";
import { useOrganizationId } from "@/services/hooks/useOrganizationId";
import { Button } from "@/components/button";
import { useState } from "react";

interface FolderInfo {
  id: string;
  name: string;
}

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  folderStack: FolderInfo[];
  onMenuClick: () => void;
}

export function Header({
  searchQuery,
  onSearchChange,
  folderStack,
  onMenuClick,
}: HeaderProps) {
  const {
    navigateBack,
    navigateToRoot,
    selectedIntegration,
    selectedResources,
    setCurrentKnowledgeBaseId,
    clearSelectedResources,
  } = useApp();
  const { data: orgId } = useOrganizationId();
  const { trigger: createKnowledgeBase } = useCreateKnowledgeBase();
  const { trigger: syncKnowledgeBase } = useSyncKnowledgeBase();
  const [isIndexing, setIsIndexing] = useState(false);

  const handleFolderClick = (index: number) => {
    // If clicking on current folder, do nothing
    if (index === folderStack.length - 1) return;

    // If clicking on a previous folder, navigate back to it
    const stepsToGoBack = folderStack.length - 1 - index;
    for (let i = 0; i < stepsToGoBack; i++) {
      navigateBack();
    }
  };

  const handleIndex = async () => {
    if (!selectedIntegration || !orgId?.org_id || selectedResources.size === 0)
      return;

    try {
      setIsIndexing(true);
      const kb = await createKnowledgeBase({
        connection_id: selectedIntegration,
        connection_source_ids: Array.from(selectedResources),
        name: "Luiz's Knowledge Base",
        description: "Created from file picker",
      });

      if (kb) {
        await syncKnowledgeBase({
          knowledge_base_id: kb.knowledge_base_id,
          org_id: orgId.org_id,
        });
        setCurrentKnowledgeBaseId(kb.knowledge_base_id);
      }
    } catch (error) {
      console.error("Failed to create knowledge base:", error);
    } finally {
      setIsIndexing(false);
      clearSelectedResources();
    }
  };

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex flex-col sm:flex-row h-auto sm:h-16 items-start sm:items-center px-4 py-2 sm:py-0">
        <div className="flex items-center w-full sm:w-auto mb-2 sm:mb-0">
          <button
            id="menu-button"
            onClick={onMenuClick}
            className="mr-4 text-gray-500 hover:text-gray-700 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-2 min-w-0 flex-wrap">
            <button
              onClick={navigateToRoot}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center cursor-pointer"
              title="Go to root folder"
            >
              <Home className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Home</span>
            </button>
            {folderStack.map((folder, index) => (
              <div key={folder.id} className="flex items-center">
                <span className="text-gray-500 mx-2">/</span>
                <button
                  onClick={() => handleFolderClick(index)}
                  className={`text-sm cursor-pointer ${
                    index === folderStack.length - 1
                      ? "text-gray-900"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {folder.name}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full sm:w-auto sm:ml-auto flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full sm:w-64 rounded-md border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <Button
            onClick={handleIndex}
            disabled={selectedResources.size === 0 || isIndexing}
            className="flex items-center gap-2 bg-blue-500 text-white cursor-pointer"
          >
            <Database className="h-4 w-4" />
            <span>Index Selected</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

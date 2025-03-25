"use client";

import { Menu, Home, Database } from "lucide-react";
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
  folderStack: FolderInfo[];
  onMenuClick: () => void;
}

export function Header({ folderStack, onMenuClick }: HeaderProps) {
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
        name: "New Knowledge Base",
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b space-y-2 sm:space-y-0">
      <div className="flex items-center space-x-4 w-full sm:w-auto overflow-x-auto">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg shrink-0"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2 overflow-x-auto min-w-0 scrollbar-hide">
          <button
            onClick={navigateToRoot}
            className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer shrink-0"
          >
            <Home className="h-5 w-5" />
          </button>

          {folderStack.map((folder, index) => (
            <div key={folder.id} className="flex items-center shrink-0">
              <span className="text-gray-500 mx-2">/</span>
              <button
                onClick={() => handleFolderClick(index)}
                className={`hover:underline cursor-pointer truncate max-w-[150px] ${
                  index === folderStack.length - 1
                    ? "text-gray-700 font-medium"
                    : "text-gray-500"
                }`}
                title={folder.name}
              >
                {folder.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
        <Button
          onClick={handleIndex}
          disabled={selectedResources.size === 0 || isIndexing}
          className="flex items-center space-x-2 w-full sm:w-auto justify-center bg-blue-500 text-white cursor-pointer"
        >
          {isIndexing ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          ) : (
            <Database className="h-4 w-4" />
          )}
          <span>Index Selected</span>
        </Button>
      </div>
    </div>
  );
}

import { create } from "zustand";

interface FolderInfo {
  id: string;
  name: string;
}

interface AppState {
  selectedIntegration: string | null;
  folderStack: FolderInfo[];
  searchQuery: string;
  organizationId: string | null;
  selectedResources: Set<string>;
  setSelectedIntegration: (id: string | null) => void;
  navigateToFolder: (folderId: string, folderName: string) => void;
  navigateBack: () => void;
  navigateToRoot: () => void;
  setSearchQuery: (query: string) => void;
  setOrganizationId: (id: string | null) => void;
  toggleResourceSelection: (resourceId: string) => void;
  clearSelectedResources: () => void;
  reset: () => void;
}

export const useApp = create<AppState>((set) => ({
  selectedIntegration: null,
  folderStack: [],
  searchQuery: "",
  organizationId: null,
  selectedResources: new Set<string>(),
  setSelectedIntegration: (id) => set({ selectedIntegration: id }),
  navigateToFolder: (folderId, folderName) =>
    set((state) => ({
      folderStack: [...state.folderStack, { id: folderId, name: folderName }],
    })),
  navigateBack: () =>
    set((state) => ({
      folderStack: state.folderStack.slice(0, -1),
    })),
  navigateToRoot: () => set({ folderStack: [] }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setOrganizationId: (id) => set({ organizationId: id }),
  toggleResourceSelection: (resourceId) =>
    set((state) => {
      const newSelectedResources = new Set(state.selectedResources);
      if (newSelectedResources.has(resourceId)) {
        newSelectedResources.delete(resourceId);
      } else {
        newSelectedResources.add(resourceId);
      }
      return { selectedResources: newSelectedResources };
    }),
  clearSelectedResources: () => set({ selectedResources: new Set<string>() }),
  reset: () =>
    set({
      selectedIntegration: null,
      folderStack: [],
      searchQuery: "",
      organizationId: null,
      selectedResources: new Set<string>(),
    }),
}));

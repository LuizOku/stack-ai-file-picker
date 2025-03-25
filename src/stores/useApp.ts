import { create } from "zustand";

interface FolderInfo {
  id: string;
  name: string;
  path: string;
}

interface AppState {
  selectedIntegration: string | null;
  folderStack: FolderInfo[];
  searchQuery: string;
  organizationId: string | null;
  selectedResources: Set<string>;
  currentKnowledgeBaseId: string | null;
}

const initialState: AppState = {
  selectedIntegration: null,
  folderStack: [],
  searchQuery: "",
  selectedResources: new Set(),
  currentKnowledgeBaseId: null,
  organizationId: null,
};

export const useApp = create<
  AppState & {
    setSelectedIntegration: (id: string | null) => void;
    navigateToFolder: (id: string, name: string) => void;
    navigateBack: () => void;
    setSearchQuery: (query: string) => void;
    toggleResourceSelection: (id: string) => void;
    clearSelectedResources: () => void;
    setCurrentKnowledgeBaseId: (id: string | null) => void;
    setOrganizationId: (id: string | null) => void;
    navigateToRoot: () => void;
    reset: () => void;
  }
>((set) => ({
  ...initialState,

  setSelectedIntegration: (id) =>
    set(() => ({
      selectedIntegration: id,
      folderStack: [],
      selectedResources: new Set(),
    })),

  navigateToFolder: (id, name) =>
    set((state) => {
      const currentPath =
        state.folderStack.length > 0
          ? state.folderStack[state.folderStack.length - 1].path
          : "";

      const newPath = currentPath ? `${currentPath}/${name}` : name;

      return {
        folderStack: [...state.folderStack, { id, name, path: newPath }],
      };
    }),

  navigateBack: () =>
    set((state) => ({
      folderStack: state.folderStack.slice(0, -1),
    })),

  setSearchQuery: (query) =>
    set({
      searchQuery: query,
    }),

  toggleResourceSelection: (id) =>
    set((state) => {
      const newSelectedResources = new Set(state.selectedResources);
      if (newSelectedResources.has(id)) {
        newSelectedResources.delete(id);
      } else {
        newSelectedResources.add(id);
      }
      return { selectedResources: newSelectedResources };
    }),

  clearSelectedResources: () =>
    set({
      selectedResources: new Set(),
    }),

  setCurrentKnowledgeBaseId: (id) =>
    set({
      currentKnowledgeBaseId: id,
    }),

  setOrganizationId: (id) => set({ organizationId: id }),

  navigateToRoot: () => set({ folderStack: [] }),

  reset: () =>
    set({
      selectedIntegration: null,
      folderStack: [],
      searchQuery: "",
      organizationId: null,
      selectedResources: new Set<string>(),
      currentKnowledgeBaseId: null,
    }),
}));

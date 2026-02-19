import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: true,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      setTheme: (isDark: boolean) => set({ isDark }),
    }),
    {
      name: 'nebula-theme',
    }
  )
);

// Campaign types
export interface Campaign {
  __editorId?: string;
  id: string;
  ProjectName: string;
  Type: string;
  Checked: boolean;
  numberOfVisits: string;
  DailyLimit: string;
  doneVisits: string;
  doneDailyVisits: string;
  nextRun: string;
  CreateTime: string;
  Filename: string;
  TargetUrl: string;
  TargetName: string;
  lstSites: string[];
  Keywords: string[];
  lstKeywords: string[];
  lstCustomGeolocations: string[];
  strMiles: string;
  UseGeolocation: boolean;
  TimeOfVisitMin: string;
  TimeOfVisitMax: string;
  TimeOfReferrelMin: string;
  TimeOfReferrelMax: string;
  MinDelayAfterVisit: string;
  MaxDelayAfterVisit: string;
  DeviceType: string;
  strStartTime: string;
  strEndTime: string;
  UseGMBInteraction: boolean;
  UsePhoneNumberClick: boolean;
  UseCustomProxy: boolean;
  lstCustomProxies: string[];
  GMapRetriesFails: number;
  [key: string]: string | number | boolean | string[] | undefined;
}

interface CampaignState {
  campaigns: Campaign[];
  selectedIds: Set<string>;
  lastDeleted: { campaign: Campaign; timestamp: number } | null;
  searchQuery: string;
  typeFilter: string;
  
  // Actions
  setCampaigns: (campaigns: Campaign[]) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  undoDelete: () => Campaign | null;
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  clearSelection: () => void;
  setSearchQuery: (query: string) => void;
  setTypeFilter: (type: string) => void;
  getFilteredCampaigns: () => Campaign[];
  exportCampaigns: (ids?: string[]) => void;
}

export const useCampaignStore = create<CampaignState>()(
  persist(
    (set, get) => ({
      campaigns: [],
      selectedIds: new Set(),
      lastDeleted: null,
      searchQuery: '',
      typeFilter: '',

      setCampaigns: (campaigns) => set({ campaigns }),
      
      addCampaign: (campaign) => set((state) => ({
        campaigns: [campaign, ...state.campaigns]
      })),
      
      updateCampaign: (id, updates) => set((state) => ({
        campaigns: state.campaigns.map((c) =>
          c.id === id ? { ...c, ...updates } : c
        )
      })),
      
      deleteCampaign: (id) => set((state) => {
        const campaign = state.campaigns.find((c) => c.id === id);
        const selectedIds = new Set(state.selectedIds);
        selectedIds.delete(id);
        return {
          campaigns: state.campaigns.filter((c) => c.id !== id),
          selectedIds,
          lastDeleted: campaign ? { campaign, timestamp: Date.now() } : null,
        };
      }),
      
      undoDelete: () => {
        const { lastDeleted } = get();
        if (!lastDeleted || Date.now() - lastDeleted.timestamp > 5 * 60 * 1000) {
          return null;
        }
        set((state) => ({
          campaigns: [lastDeleted.campaign, ...state.campaigns],
          lastDeleted: null,
        }));
        return lastDeleted.campaign;
      },
      
      toggleSelect: (id) => set((state) => {
        const selectedIds = new Set(state.selectedIds);
        if (selectedIds.has(id)) {
          selectedIds.delete(id);
        } else {
          selectedIds.add(id);
        }
        return { selectedIds };
      }),
      
      toggleSelectAll: () => set((state) => {
        const { getFilteredCampaigns } = get();
        const filtered = getFilteredCampaigns();
        const allSelected = filtered.every((c) => state.selectedIds.has(c.id));
        return {
          selectedIds: allSelected ? new Set() : new Set(filtered.map((c) => c.id)),
        };
      }),
      
      clearSelection: () => set({ selectedIds: new Set() }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setTypeFilter: (type) => set({ typeFilter: type }),
      
      getFilteredCampaigns: () => {
        const { campaigns, searchQuery, typeFilter } = get();
        return campaigns.filter((c) => {
          const matchesSearch = !searchQuery ||
            c.ProjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.id.includes(searchQuery);
          const matchesType = !typeFilter || c.Type === typeFilter;
          return matchesSearch && matchesType;
        });
      },
      
      exportCampaigns: (ids) => {
        const { campaigns } = get();
        const toExport = ids
          ? campaigns.filter((c) => ids.includes(c.id))
          : campaigns;
        
        // Strip internal fields (eslint ignore for intentional unused var)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const sanitized = toExport.map(({ __editorId, ...rest }) => rest);
        
        const dataStr = JSON.stringify(sanitized, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ctr_campaigns_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },
    }),
    {
      name: 'ctrb-campaigns',
      partialize: (state) => ({ campaigns: state.campaigns }),
    }
  )
);

// AI Config
interface AIConfig {
  apiKey: string;
  model: string;
  useLocalAI: boolean;
  localEndpoint: string;
  localModel: string;
}

interface AIState {
  config: AIConfig;
  isConfigured: boolean;
  setConfig: (config: Partial<AIConfig>) => void;
  checkConfigured: () => boolean;
}

export const useAIStore = create<AIState>()(
  persist(
    (set, get) => ({
      config: {
        apiKey: '',
        model: 'gpt-4o-mini',
        useLocalAI: false,
        localEndpoint: 'http://localhost:11434/v1/chat/completions',
        localModel: 'llama3.1',
      },
      isConfigured: false,
      
      setConfig: (config) => set((state) => {
        const newConfig = { ...state.config, ...config };
        return {
          config: newConfig,
          isConfigured: !!newConfig.apiKey || newConfig.useLocalAI,
        };
      }),
      
      checkConfigured: () => {
        const { config } = get();
        return !!config.apiKey || config.useLocalAI;
      },
    }),
    {
      name: 'ctrb-ai-config',
    }
  )
);

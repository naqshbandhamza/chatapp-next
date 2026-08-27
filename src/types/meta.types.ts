export type AdAccount = {
    id: number;
    meta_id: string;
    name: string | null;
    account_status: number | null;
    currency: string | null;
    timezone_name: string | null;
};

export type MetaStatusResponse = {
    success: boolean;
    connected: boolean;
    meta_user_id?: string;
};

export type MetaAccountsResponse = {
    success: boolean;
    ad_accounts: AdAccount[];
};

export type Campaign = {
    id: number;
    meta_id: string;
    name: string | null;
    status: string | null;
};

export type MetaCampaignsResponse = {
    success: boolean;
    campaigns: Campaign[];
};

export type AdSet = {
    id: number;
    meta_id: string;
    name: string | null;
    status: string | null;
};

export type MetaAdSetsResponse = {
    success: boolean;
    ad_sets: AdSet[];
};

export type Ad = {
    id: number;
    meta_id: string;
    name: string | null;
    status: string | null;
};

export type MetaAdsResponse = {
    success: boolean;
    ads: Ad[];
};

export type Insight = {
    date_start: string;
    date_stop: string;

    impressions: number;
    reach: number;
    clicks: number;
    spend: number;

    ctr: number;
    cpc: number;
    cpm: number;

    conversions?: number;

    [key: string]: any;
};

export type MetaInsightsResponse = {
    success: boolean;
    insights: Insight[];
};
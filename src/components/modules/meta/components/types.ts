export type Insight = {
    date_start: string;
    impressions: number;
    reach: number;
    clicks: number;
    spend: number;
    conversions: number;
    ctr: number;
    cpc: number;
    cpm: number;
    [key: string]: number | string;
};

export type InsightTotals = {
    impressions: number;
    reach: number;
    clicks: number;
    spend: number;
    conversions: number;
    ctr: number;
    cpc: number;
    cpm: number;
};

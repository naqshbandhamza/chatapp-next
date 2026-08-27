// state/drilldown.reducer.ts

import {
    Ad,
    AdAccount,
    AdSet,
    Campaign,
    Insight,
} from "@/types/meta.types";

export type DrilldownState = {
    connected: boolean;
    accounts: AdAccount[];

    selectedAccount: AdAccount | null;
    campaigns: Campaign[];

    selectedCampaign: Campaign | null;
    adSets: AdSet[];

    selectedAdSet: AdSet | null;
    ads: Ad[];

    selectedAd: Ad | null;
    insights: Insight[];
};

export type DrilldownAction =
    | { type: "SET_CONNECTION"; connected: boolean; accounts: AdAccount[] }
    | { type: "SELECT_ACCOUNT"; account: AdAccount }
    | { type: "SET_CAMPAIGNS"; campaigns: Campaign[] }
    | { type: "SELECT_CAMPAIGN"; campaign: Campaign }
    | { type: "SET_AD_SETS"; adSets: AdSet[] }
    | { type: "SELECT_AD_SET"; adSet: AdSet }
    | { type: "SET_ADS"; ads: Ad[] }
    | { type: "SELECT_AD"; ad: Ad }
    | { type: "SET_INSIGHTS"; insights: Insight[] };

export const initialDrilldownState: DrilldownState = {
    connected: false,
    accounts: [],

    selectedAccount: null,
    campaigns: [],

    selectedCampaign: null,
    adSets: [],

    selectedAdSet: null,
    ads: [],

    selectedAd: null,
    insights: [],
};

export function drilldownReducer(
    state: DrilldownState,
    action: DrilldownAction,
): DrilldownState {
    switch (action.type) {
        case "SET_CONNECTION":
            return {
                ...initialDrilldownState,
                connected: action.connected,
                accounts: action.accounts,
            };

        case "SELECT_ACCOUNT":
            return {
                ...state,
                selectedAccount: action.account,
                selectedCampaign: null,
                selectedAdSet: null,
                selectedAd: null,
                campaigns: [],
                adSets: [],
                ads: [],
                insights: [],
            };

        case "SET_CAMPAIGNS":
            return { ...state, campaigns: action.campaigns };

        case "SELECT_CAMPAIGN":
            return {
                ...state,
                selectedCampaign: action.campaign,
                selectedAdSet: null,
                selectedAd: null,
                adSets: [],
                ads: [],
                insights: [],
            };

        case "SET_AD_SETS":
            return { ...state, adSets: action.adSets };

        case "SELECT_AD_SET":
            return {
                ...state,
                selectedAdSet: action.adSet,
                selectedAd: null,
                ads: [],
                insights: [],
            };

        case "SET_ADS":
            return { ...state, ads: action.ads };

        case "SELECT_AD":
            return {
                ...state,
                selectedAd: action.ad,
                insights: [],
            };

        case "SET_INSIGHTS":
            return { ...state, insights: action.insights };

        default:
            return state;
    }
}

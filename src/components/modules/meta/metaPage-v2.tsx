"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useState,
    type ReactNode,
} from "react";
import { useSelector } from "react-redux";

import MetaConnect from "./metaConnect";

/*
 * =================================================================
 * TYPES
 * =================================================================
 */

type AdAccount = {
    id: number;
    meta_id: string;
    name: string | null;
    account_status: number | null;
    currency: string | null;
    timezone_name: string | null;
};

type MetaStatusResponse = {
    success: boolean;
    connected: boolean;
    meta_user_id?: string;
};

type MetaAccountsResponse = {
    success: boolean;
    ad_accounts: AdAccount[];
};

type Campaign = {
    id: number;
    meta_id: string;
    name: string | null;
    status: string | null;
};

type MetaCampaignsResponse = {
    success: boolean;
    campaigns: Campaign[];
};

type AdSet = {
    id: number;
    meta_id: string;
    name: string | null;
    status: string | null;
};

type MetaAdSetsResponse = {
    success: boolean;
    ad_sets: AdSet[];
};

type Ad = {
    id: number;
    meta_id: string;
    name: string | null;
    status: string | null;
};

type MetaAdsResponse = {
    success: boolean;
    ads: Ad[];
};

type Insight = {
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

type MetaInsightsResponse = {
    success: boolean;
    insights: Insight[];
};

/*
 * =================================================================
 * DRILLDOWN STATE
 * =================================================================
 *
 * Everything below "connected" is one hierarchy: account -> campaign
 * -> ad set -> ad -> insights. Selecting something at one level
 * always needs to clear everything beneath it. Modelling this as a
 * single reducer means that reset logic lives in ONE place instead
 * of being duplicated at every click handler.
 */

type DrilldownState = {
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

type DrilldownAction =
    | { type: "SET_CONNECTION"; connected: boolean; accounts: AdAccount[] }
    | { type: "SELECT_ACCOUNT"; account: AdAccount }
    | { type: "SET_CAMPAIGNS"; campaigns: Campaign[] }
    | { type: "SELECT_CAMPAIGN"; campaign: Campaign }
    | { type: "SET_AD_SETS"; adSets: AdSet[] }
    | { type: "SELECT_AD_SET"; adSet: AdSet }
    | { type: "SET_ADS"; ads: Ad[] }
    | { type: "SELECT_AD"; ad: Ad }
    | { type: "SET_INSIGHTS"; insights: Insight[] };

const initialDrilldownState: DrilldownState = {
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

function drilldownReducer(
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

/*
 * A single object for the five independent loading flags, updated
 * with a shallow merge. Avoids five separate useState calls/setters.
 */

type LoadingState = {
    meta: boolean;
    campaigns: boolean;
    adSets: boolean;
    ads: boolean;
    insights: boolean;
};

const initialLoadingState: LoadingState = {
    meta: true,
    campaigns: false,
    adSets: false,
    ads: false,
    insights: false,
};

/*
 * =================================================================
 * GENERIC API HELPER
 * =================================================================
 *
 * Every request in this page hits the same base URL with the same
 * "Authorization: Token <token>" header and the same error handling
 * shape. Centralizing it removes ~6 copies of identical fetch
 * boilerplate. The endpoint path, query params, and error message
 * are the only things that vary per call.
 */

async function apiGet<T>(
    token: string,
    path: string,
    errorMessage: string,
    params?: Record<string, string>,
): Promise<T> {
    const query = params
        ? `?${new URLSearchParams(params).toString()}`
        : "";

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}${query}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            credentials: "include",
        },
    );

    if (!response.ok) {
        throw new Error(errorMessage);
    }

    return response.json();
}

/*
 * =================================================================
 * COMPONENT
 * =================================================================
 */

export default function MetaPage() {
    const [state, dispatch] = useReducer(
        drilldownReducer,
        initialDrilldownState,
    );

    const [loadingState, setLoadingState] = useState<LoadingState>(
        initialLoadingState,
    );

    const setLoading = useCallback(
        (key: keyof LoadingState, value: boolean) => {
            setLoadingState((prev) => ({ ...prev, [key]: value }));
        },
        [],
    );

    const [dateStart, setDateStart] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date.toISOString().split("T")[0];
    });

    const [dateEnd, setDateEnd] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });

    const [appliedDateStart, setAppliedDateStart] = useState(dateStart);
    const [appliedDateEnd, setAppliedDateEnd] = useState(dateEnd);

    const [error, setError] = useState<string | null>(null);

    const { token } = useSelector((state: any) => state.user);

    /*
     * ---------------------------------------------------------
     * LOAD META (status + ad accounts)
     * ---------------------------------------------------------
     */

    const loadMeta = useCallback(async () => {
        if (!token) {
            console.log("META: Waiting for authentication token...");
            return;
        }

        try {
            setLoading("meta", true);
            setError(null);

            const status = await apiGet<MetaStatusResponse>(
                token,
                "/api/meta/status/",
                "Failed to check Meta connection status.",
            );

            if (!status.connected) {
                dispatch({
                    type: "SET_CONNECTION",
                    connected: false,
                    accounts: [],
                });
                return;
            }

            const accountsData = await apiGet<MetaAccountsResponse>(
                token,
                "/api/meta/ad-accounts/",
                "Failed to load Meta ad accounts.",
            );

            dispatch({
                type: "SET_CONNECTION",
                connected: true,
                accounts: accountsData.ad_accounts ?? [],
            });
        } catch (err) {
            console.error("META LOAD ERROR:", err);
            setError("Unable to load your Meta connection.");
        } finally {
            setLoading("meta", false);
        }
    }, [token, setLoading]);

    /*
     * ---------------------------------------------------------
     * LOAD CAMPAIGNS
     * ---------------------------------------------------------
     */

    const loadCampaigns = useCallback(
        async (accountId: number) => {
            try {
                setLoading("campaigns", true);
                setError(null);

                const data = await apiGet<MetaCampaignsResponse>(
                    token,
                    "/api/meta/campaigns/",
                    "Failed to load campaigns.",
                    { ad_account: String(accountId) },
                );

                dispatch({
                    type: "SET_CAMPAIGNS",
                    campaigns: data.campaigns ?? [],
                });
            } catch (err) {
                console.error("CAMPAIGNS LOAD ERROR:", err);
                setError("Unable to load campaigns.");
            } finally {
                setLoading("campaigns", false);
            }
        },
        [token, setLoading],
    );

    /*
     * ---------------------------------------------------------
     * LOAD AD SETS
     * ---------------------------------------------------------
     */

    const loadAdSets = useCallback(
        async (campaignId: number) => {
            try {
                setLoading("adSets", true);
                setError(null);

                const data = await apiGet<MetaAdSetsResponse>(
                    token,
                    "/api/meta/ad-sets/",
                    "Failed to load ad sets.",
                    { campaign: String(campaignId) },
                );

                dispatch({ type: "SET_AD_SETS", adSets: data.ad_sets ?? [] });
            } catch (err) {
                console.error("AD SETS LOAD ERROR:", err);
                setError("Unable to load ad sets.");
            } finally {
                setLoading("adSets", false);
            }
        },
        [token, setLoading],
    );

    /*
     * ---------------------------------------------------------
     * LOAD ADS
     * ---------------------------------------------------------
     */

    const loadAds = useCallback(
        async (adSetId: number) => {
            try {
                setLoading("ads", true);
                setError(null);

                const data = await apiGet<MetaAdsResponse>(
                    token,
                    "/api/meta/ads/",
                    "Failed to load ads.",
                    { ad_set: String(adSetId) },
                );

                dispatch({ type: "SET_ADS", ads: data.ads ?? [] });
            } catch (err) {
                console.error("ADS LOAD ERROR:", err);
                setError("Unable to load ads.");
            } finally {
                setLoading("ads", false);
            }
        },
        [token, setLoading],
    );

    /*
     * ---------------------------------------------------------
     * LOAD INSIGHTS
     * ---------------------------------------------------------
     */

    const loadInsights = useCallback(
        async (adId: number, startDate: string, endDate: string) => {
            try {
                setLoading("insights", true);
                setError(null);

                const data = await apiGet<MetaInsightsResponse>(
                    token,
                    "/api/meta/insights/",
                    "Failed to load insights.",
                    {
                        ad: String(adId),
                        date_start: startDate,
                        date_stop: endDate,
                    },
                );

                dispatch({
                    type: "SET_INSIGHTS",
                    insights: data.insights ?? [],
                });
            } catch (err) {
                console.error("INSIGHTS LOAD ERROR:", err);
                setError("Unable to load ad insights.");
            } finally {
                setLoading("insights", false);
            }
        },
        [token, setLoading],
    );

    useEffect(() => {
        if (!token) return;

        loadMeta();
    }, [token, loadMeta]);

    /*
     * ---------------------------------------------------------
     * SELECTION HANDLERS
     * ---------------------------------------------------------
     *
     * Each handler only needs to dispatch the selection (which
     * clears everything downstream via the reducer) and kick off
     * the next fetch. No manual resetting of sibling state here.
     */

    const handleSelectAccount = useCallback(
        (account: AdAccount) => {
            dispatch({ type: "SELECT_ACCOUNT", account });
            loadCampaigns(account.id);
        },
        [loadCampaigns],
    );

    const handleSelectCampaign = useCallback(
        (campaign: Campaign) => {
            dispatch({ type: "SELECT_CAMPAIGN", campaign });
            loadAdSets(campaign.id);
        },
        [loadAdSets],
    );

    const handleSelectAdSet = useCallback(
        (adSet: AdSet) => {
            dispatch({ type: "SELECT_AD_SET", adSet });
            loadAds(adSet.id);
        },
        [loadAds],
    );

    const handleSelectAd = useCallback(
        (ad: Ad) => {
            dispatch({ type: "SELECT_AD", ad });
            loadInsights(ad.id, dateStart, dateEnd);
        },
        [loadInsights, dateStart, dateEnd],
    );

    const applyDateRange = useCallback(() => {
        if (!state.selectedAd) return;
        if (!dateStart || !dateEnd) return;

        if (dateStart > dateEnd) {
            setError("Start date cannot be after end date.");
            return;
        }

        setError(null);

        setAppliedDateStart(dateStart);
        setAppliedDateEnd(dateEnd);

        loadInsights(state.selectedAd.id, dateStart, dateEnd);
    }, [state.selectedAd, dateStart, dateEnd, loadInsights]);

    /*
     * ---------------------------------------------------------
     * DERIVED METRICS
     * ---------------------------------------------------------
     *
     * Recomputed only when `insights` actually changes, instead of
     * on every render via an inline IIFE.
     */

    const insightTotals = useMemo(() => {
        const totals = state.insights.reduce(
            (acc, insight) => {
                acc.impressions += Number(insight.impressions) || 0;
                acc.reach += Number(insight.reach) || 0;
                acc.clicks += Number(insight.clicks) || 0;
                acc.spend += Number(insight.spend) || 0;
                acc.conversions += Number(insight.conversions) || 0;

                return acc;
            },
            {
                impressions: 0,
                reach: 0,
                clicks: 0,
                spend: 0,
                conversions: 0,
            },
        );

        // Derived from totals, not averaged per-day.
        const ctr =
            totals.impressions > 0
                ? (totals.clicks / totals.impressions) * 100
                : 0;

        const cpc = totals.clicks > 0 ? totals.spend / totals.clicks : 0;

        const cpm =
            totals.impressions > 0
                ? (totals.spend / totals.impressions) * 1000
                : 0;

        return { ...totals, ctr, cpc, cpm };
    }, [state.insights]);

    const chartData = useMemo(() => {
        return [...state.insights]
            .map((insight) => ({
                ...insight,
                date: insight.date_start,
                impressions: Number(insight.impressions) || 0,
                reach: Number(insight.reach) || 0,
                clicks: Number(insight.clicks) || 0,
                spend: Number(insight.spend) || 0,
                ctr: Number(insight.ctr) || 0,
                cpc: Number(insight.cpc) || 0,
                cpm: Number(insight.cpm) || 0,
                conversions: Number(insight.conversions) || 0,
            }))
            .sort(
                (a, b) =>
                    new Date(`${a.date}T00:00:00`).getTime() -
                    new Date(`${b.date}T00:00:00`).getTime(),
            );
    }, [state.insights]);

    /*
     * ---------------------------------------------------------
     * HELPERS
     * ---------------------------------------------------------
     */

    const getStatusClass = (status: string | null) => {
        const normalized = status?.toLowerCase();

        if (normalized === "active" || normalized === "enabled") {
            return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
        }

        if (normalized === "paused" || normalized === "inactive") {
            return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
        }

        return "bg-gray-100 text-gray-600 ring-1 ring-gray-200";
    };

    /*
     * ---------------------------------------------------------
     * LOADING
     * ---------------------------------------------------------
     */

    if (loadingState.meta) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-[#f5f6f7]">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#1877F2]" />

                    <p className="text-sm text-[#65676b]">
                        Loading Meta...
                    </p>
                </div>
            </div>
        );
    }

    /*
     * ---------------------------------------------------------
     * NOT CONNECTED
     * ---------------------------------------------------------
     */

    if (!state.connected) {
        return <MetaConnect onConnected={loadMeta} />;
    }

    /*
     * ---------------------------------------------------------
     * ERROR
     * ---------------------------------------------------------
     */

    if (error) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-[#f5f6f7] p-6">
                <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                        !
                    </div>

                    <h1 className="mt-4 text-lg font-semibold text-[#1c1e21]">
                        Something went wrong
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-[#65676b]">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadMeta}
                        className="mt-6 rounded-lg bg-[#1c1e21] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    /*
     * ---------------------------------------------------------
     * CONNECTED UI
     * ---------------------------------------------------------
     */

    const {
        accounts,
        selectedAccount,
        campaigns,
        selectedCampaign,
        adSets,
        selectedAdSet,
        ads,
        selectedAd,
        insights,
    } = state;

    return (
        <div className="h-full w-full overflow-y-auto bg-[#f5f6f7]">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="mb-7">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1877F2] text-xl font-bold text-white">
                                    f
                                </div>

                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight text-[#1c1e21]">
                                        Meta Ads
                                    </h1>

                                    <p className="text-sm text-[#65676b]">
                                        Manage your advertising campaigns.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-2 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Meta Connected
                        </div>
                    </div>
                </div>

                {/* ================================================= */}
                {/* BREADCRUMB / CURRENT SELECTION */}
                {/* ================================================= */}

                {(selectedAccount || selectedCampaign || selectedAdSet) && (
                    <div className="mb-6 overflow-x-auto">
                        <div className="flex min-w-max items-center gap-2 rounded-xl border border-[#dadde1] bg-white px-4 py-3 shadow-sm">
                            <span className="text-xs font-medium uppercase tracking-wide text-[#8a8d91]">
                                Viewing
                            </span>

                            {selectedAccount && (
                                <>
                                    <span className="text-[#c7c9cc]">/</span>

                                    <span className="max-w-[180px] truncate text-sm font-semibold text-[#1c1e21]">
                                        {selectedAccount.name || "Ad Account"}
                                    </span>
                                </>
                            )}

                            {selectedCampaign && (
                                <>
                                    <span className="text-[#c7c9cc]">/</span>

                                    <span className="max-w-[180px] truncate text-sm font-semibold text-[#1c1e21]">
                                        {selectedCampaign.name || "Campaign"}
                                    </span>
                                </>
                            )}

                            {selectedAdSet && (
                                <>
                                    <span className="text-[#c7c9cc]">/</span>

                                    <span className="max-w-[180px] truncate text-sm font-semibold text-[#1c1e21]">
                                        {selectedAdSet.name || "Ad Set"}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* ================================================= */}
                {/* AD ACCOUNTS */}
                {/* ================================================= */}

                <section>
                    <div className="mb-4 flex items-end justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#8a8d91]">
                                Level 1
                            </p>

                            <h2 className="mt-1 text-xl font-bold text-[#1c1e21]">
                                Ad Accounts
                            </h2>
                        </div>

                        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#65676b] ring-1 ring-[#dadde1]">
                            {accounts.length}{" "}
                            {accounts.length === 1 ? "account" : "accounts"}
                        </span>
                    </div>

                    {accounts.length === 0 ? (
                        <EmptyState text="No ad accounts found." />
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {accounts.map((account) => {
                                const selected =
                                    selectedAccount?.id === account.id;

                                return (
                                    <button
                                        key={account.id}
                                        type="button"
                                        onClick={() =>
                                            handleSelectAccount(account)
                                        }
                                        className={`group text-left rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${selected
                                            ? "border-[#1877F2] ring-2 ring-[#1877F2]/10"
                                            : "border-[#dadde1]"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf2ff] text-[#1877F2]">
                                                    $
                                                </div>

                                                <div className="min-w-0">
                                                    <h3 className="truncate font-semibold text-[#1c1e21]">
                                                        {account.name ||
                                                            "Unnamed account"}
                                                    </h3>

                                                    <p className="mt-1 truncate text-xs text-[#8a8d91]">
                                                        {account.meta_id}
                                                    </p>
                                                </div>
                                            </div>

                                            {selected ? (
                                                <span className="rounded-full bg-[#eaf2ff] px-2.5 py-1 text-xs font-semibold text-[#1877F2]">
                                                    Selected
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                                    Active
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-5 grid grid-cols-2 gap-3">
                                            <InfoBox
                                                label="Currency"
                                                value={account.currency || "—"}
                                            />

                                            <InfoBox
                                                label="Timezone"
                                                value={
                                                    account.timezone_name ||
                                                    "—"
                                                }
                                            />
                                        </div>

                                        <div className="mt-4 flex items-center justify-between border-t border-[#f0f1f2] pt-4">
                                            <span className="text-xs text-[#8a8d91]">
                                                View campaigns
                                            </span>

                                            <span className="text-[#1877F2] transition-transform group-hover:translate-x-1">
                                                →
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* ================================================= */}
                {/* CAMPAIGNS */}
                {/* ================================================= */}

                {selectedAccount && (
                    <section className="mt-10">
                        <SectionHeader
                            eyebrow="Level 2"
                            title="Campaigns"
                            count={campaigns.length}
                            loading={loadingState.campaigns}
                        />

                        {loadingState.campaigns ? (
                            <LoadingBox text="Loading campaigns..." />
                        ) : campaigns.length === 0 ? (
                            <EmptyState text="No campaigns found for this ad account." />
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {campaigns.map((campaign) => {
                                    const selected =
                                        selectedCampaign?.id === campaign.id;

                                    return (
                                        <button
                                            key={campaign.id}
                                            type="button"
                                            onClick={() =>
                                                handleSelectCampaign(campaign)
                                            }
                                            className={`group text-left rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${selected
                                                ? "border-[#1877F2] ring-2 ring-[#1877F2]/10"
                                                : "border-[#dadde1]"
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                                                        ◈
                                                    </div>

                                                    <div className="min-w-0">
                                                        <h3 className="truncate font-semibold text-[#1c1e21]">
                                                            {campaign.name ||
                                                                "Unnamed campaign"}
                                                        </h3>

                                                        <p className="mt-1 truncate text-xs text-[#8a8d91]">
                                                            {campaign.meta_id}
                                                        </p>
                                                    </div>
                                                </div>

                                                <span
                                                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClass(
                                                        campaign.status,
                                                    )}`}
                                                >
                                                    {campaign.status ||
                                                        "Unknown"}
                                                </span>
                                            </div>

                                            <div className="mt-5 flex items-center justify-between border-t border-[#f0f1f2] pt-4">
                                                <span className="text-xs text-[#8a8d91]">
                                                    View ad sets
                                                </span>

                                                <span className="text-[#1877F2] transition-transform group-hover:translate-x-1">
                                                    →
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                )}

                {/* ================================================= */}
                {/* AD SETS */}
                {/* ================================================= */}

                {selectedCampaign && (
                    <section className="mt-10">
                        <SectionHeader
                            eyebrow="Level 3"
                            title="Ad Sets"
                            count={adSets.length}
                            loading={loadingState.adSets}
                        />

                        {loadingState.adSets ? (
                            <LoadingBox text="Loading ad sets..." />
                        ) : adSets.length === 0 ? (
                            <EmptyState text="No ad sets found for this campaign." />
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {adSets.map((adSet) => {
                                    const selected =
                                        selectedAdSet?.id === adSet.id;

                                    return (
                                        <button
                                            key={adSet.id}
                                            type="button"
                                            onClick={() =>
                                                handleSelectAdSet(adSet)
                                            }
                                            className={`group text-left rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${selected
                                                ? "border-[#1877F2] ring-2 ring-[#1877F2]/10"
                                                : "border-[#dadde1]"
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                                                        ◫
                                                    </div>

                                                    <div className="min-w-0">
                                                        <h3 className="truncate font-semibold text-[#1c1e21]">
                                                            {adSet.name ||
                                                                "Unnamed ad set"}
                                                        </h3>

                                                        <p className="mt-1 truncate text-xs text-[#8a8d91]">
                                                            {adSet.meta_id}
                                                        </p>
                                                    </div>
                                                </div>

                                                <span
                                                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClass(
                                                        adSet.status,
                                                    )}`}
                                                >
                                                    {adSet.status || "Unknown"}
                                                </span>
                                            </div>

                                            <div className="mt-5 flex items-center justify-between border-t border-[#f0f1f2] pt-4">
                                                <span className="text-xs text-[#8a8d91]">
                                                    View ads
                                                </span>

                                                <span className="text-[#1877F2] transition-transform group-hover:translate-x-1">
                                                    →
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                )}

                {/* ================================================= */}
                {/* ADS */}
                {/* ================================================= */}

                {selectedAdSet && (
                    <section className="mt-10 pb-10">
                        <SectionHeader
                            eyebrow="Level 4"
                            title="Ads"
                            count={ads.length}
                            loading={loadingState.ads}
                        />

                        {loadingState.ads ? (
                            <LoadingBox text="Loading ads..." />
                        ) : ads.length === 0 ? (
                            <EmptyState text="No ads found for this ad set." />
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {ads.map((ad) => (
                                    <div
                                        key={ad.id}
                                        className="rounded-2xl border border-[#dadde1] bg-white p-5 shadow-sm transition hover:shadow-md"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                    ▣
                                                </div>

                                                <div className="min-w-0">
                                                    <h3 className="truncate font-semibold text-[#1c1e21]">
                                                        {ad.name ||
                                                            "Unnamed ad"}
                                                    </h3>

                                                    <p className="mt-1 truncate text-xs text-[#8a8d91]">
                                                        {ad.meta_id}
                                                    </p>
                                                </div>
                                            </div>

                                            <span
                                                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClass(
                                                    ad.status,
                                                )}`}
                                            >
                                                {ad.status || "Unknown"}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleSelectAd(ad)
                                            }
                                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1c1e21] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
                                        >
                                            View insights
                                            <span>→</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {selectedAd && (
                    <div className="mt-10 pb-16">
                        {/* ========================================================= */}
                        {/* INSIGHTS HEADER */}
                        {/* ========================================================= */}

                        <div className="mb-6">
                            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-[#1877F2]" />

                                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8a8d91]">
                                            Performance Analytics
                                        </p>
                                    </div>

                                    <h2 className="mt-2 truncate text-2xl font-bold tracking-tight text-[#1c1e21]">
                                        {selectedAd.name || "Unnamed ad"}
                                    </h2>

                                    <p className="mt-1 text-sm text-[#65676b]">
                                        Detailed performance metrics and trends
                                    </p>
                                </div>

                                {/* ================================================= */}
                                {/* DATE RANGE */}
                                {/* ================================================= */}

                                <div className="rounded-2xl border border-[#dadde1] bg-white p-3 shadow-sm">
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                        <DateInput
                                            label="Start date"
                                            value={dateStart}
                                            max={dateEnd}
                                            onChange={setDateStart}
                                        />

                                        <div className="hidden h-10 items-center px-1 text-[#8a8d91] sm:flex">
                                            →
                                        </div>

                                        <DateInput
                                            label="End date"
                                            value={dateEnd}
                                            min={dateStart}
                                            max={
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                            onChange={setDateEnd}
                                        />

                                        <button
                                            type="button"
                                            onClick={applyDateRange}
                                            disabled={
                                                loadingState.insights ||
                                                !dateStart ||
                                                !dateEnd ||
                                                dateStart > dateEnd
                                            }
                                            className="
                                h-10
                                rounded-lg
                                bg-[#1c1e21]
                                px-5
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-black
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                                        >
                                            {loadingState.insights
                                                ? "Loading..."
                                                : "Apply"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ========================================================= */}
                        {/* ACTIVE RANGE */}
                        {/* ========================================================= */}

                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-[#8a8d91]">
                                    Date range
                                </span>

                                <span className="rounded-full bg-[#eaf2ff] px-3 py-1.5 text-xs font-semibold text-[#1877F2]">
                                    {appliedDateStart}
                                    <span className="mx-1.5 text-[#8ab4f8]">
                                        →
                                    </span>
                                    {appliedDateEnd}
                                </span>
                            </div>

                            {!loadingState.insights && insights.length > 0 && (
                                <span className="text-xs text-[#8a8d91]">
                                    {insights.length}{" "}
                                    {insights.length === 1 ? "day" : "days"}{" "}
                                    of data
                                </span>
                            )}
                        </div>

                        {/* ========================================================= */}
                        {/* LOADING / EMPTY / DATA */}
                        {/* ========================================================= */}

                        {loadingState.insights ? (
                            <div className="rounded-2xl border border-[#dadde1] bg-white p-12 text-center shadow-sm">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#1877F2]" />

                                    <p className="text-sm font-medium text-[#1c1e21]">
                                        Loading insights
                                    </p>

                                    <p className="text-xs text-[#8a8d91]">
                                        Fetching performance data for the selected range
                                    </p>
                                </div>
                            </div>
                        ) : insights.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-[#d5d7da] bg-white p-12 text-center shadow-sm">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f6f7] text-lg text-[#8a8d91]">
                                    —
                                </div>

                                <h3 className="mt-4 text-sm font-semibold text-[#1c1e21]">
                                    No insights found
                                </h3>

                                <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-[#65676b]">
                                    There is no performance data for this ad
                                    during the selected date range.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* ================================================= */}
                                {/* KPI SUMMARY */}
                                {/* ================================================= */}

                                <div className="mb-8">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-base font-bold text-[#1c1e21]">
                                                Performance overview
                                            </h3>

                                            <p className="mt-1 text-xs text-[#8a8d91]">
                                                Aggregated across the selected date range
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                        <InsightCard
                                            label="Impressions"
                                            value={formatNumber(
                                                insightTotals.impressions,
                                            )}
                                        />

                                        <InsightCard
                                            label="Reach"
                                            value={formatNumber(
                                                insightTotals.reach,
                                            )}
                                        />

                                        <InsightCard
                                            label="Clicks"
                                            value={formatNumber(
                                                insightTotals.clicks,
                                            )}
                                        />

                                        <InsightCard
                                            label="Spend"
                                            value={formatDecimal(
                                                insightTotals.spend,
                                            )}
                                        />

                                        <InsightCard
                                            label="CTR"
                                            value={`${formatDecimal(
                                                insightTotals.ctr,
                                                2,
                                            )}%`}
                                        />

                                        <InsightCard
                                            label="CPC"
                                            value={formatDecimal(
                                                insightTotals.cpc,
                                                2,
                                            )}
                                        />

                                        <InsightCard
                                            label="CPM"
                                            value={formatDecimal(
                                                insightTotals.cpm,
                                                2,
                                            )}
                                        />

                                        <InsightCard
                                            label="Conversions"
                                            value={formatNumber(
                                                insightTotals.conversions,
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* ========================================================= */}
                                {/* PERFORMANCE CHARTS */}
                                {/* ========================================================= */}

                                <div className="mb-8 grid gap-5 xl:grid-cols-2">

                                    {/* TRAFFIC TREND */}
                                    <InsightChartCard
                                        title="Traffic trend"
                                        description="How impressions, reach and clicks changed over time"
                                    >
                                        <PerformanceLineChart
                                            data={chartData}
                                            lines={[
                                                {
                                                    key: "impressions",
                                                    label: "Impressions",
                                                    className: "stroke-[#1877F2]",
                                                },
                                                {
                                                    key: "reach",
                                                    label: "Reach",
                                                    className: "stroke-[#8B5CF6]",
                                                },
                                                {
                                                    key: "clicks",
                                                    label: "Clicks",
                                                    className: "stroke-[#10B981]",
                                                },
                                            ]}
                                        />
                                    </InsightChartCard>

                                    {/* SPEND TREND */}
                                    <InsightChartCard
                                        title="Spend & efficiency"
                                        description="Daily spend and engagement efficiency across the selected range"
                                    >
                                        <SpendEfficiencyChart data={chartData} insightTotals={insightTotals} />
                                    </InsightChartCard>
                                </div>


                                {/* ================================================= */}
                                {/* DAILY PERFORMANCE */}
                                {/* ================================================= */}

                                <div className="overflow-hidden rounded-2xl border border-[#dadde1] bg-white shadow-sm">
                                    <div className="border-b border-[#f0f1f2] px-5 py-4">
                                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <h3 className="text-base font-bold text-[#1c1e21]">
                                                    Daily performance
                                                </h3>

                                                <p className="mt-1 text-xs text-[#8a8d91]">
                                                    Complete insight data returned for each day
                                                </p>
                                            </div>

                                            <span className="text-xs font-medium text-[#8a8d91]">
                                                {insights.length} rows
                                            </span>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[1000px] text-left">
                                            <thead>
                                                <tr className="border-b border-[#f0f1f2] bg-[#fafbfc]">
                                                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-[#8a8d91]">
                                                        Date
                                                    </th>

                                                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-[#8a8d91]">
                                                        Impressions
                                                    </th>

                                                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-[#8a8d91]">
                                                        Reach
                                                    </th>

                                                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-[#8a8d91]">
                                                        Clicks
                                                    </th>

                                                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-[#8a8d91]">
                                                        CTR
                                                    </th>

                                                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-[#8a8d91]">
                                                        CPC
                                                    </th>

                                                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-[#8a8d91]">
                                                        CPM
                                                    </th>

                                                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-[#8a8d91]">
                                                        Spend
                                                    </th>

                                                    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wide text-[#8a8d91]">
                                                        Conversions
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {insights.map(
                                                    (insight, index) => (
                                                        <tr
                                                            key={`${insight.date_start}-${index}`}
                                                            className="border-b border-[#f0f1f2] last:border-0 hover:bg-[#fafbfc]"
                                                        >
                                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-[#1c1e21]">
                                                                {formatInsightDate(
                                                                    insight.date_start,
                                                                )}
                                                            </td>

                                                            <td className="px-5 py-4 text-sm text-[#1c1e21]">
                                                                {formatNumber(
                                                                    insight.impressions,
                                                                )}
                                                            </td>

                                                            <td className="px-5 py-4 text-sm text-[#1c1e21]">
                                                                {formatNumber(
                                                                    insight.reach,
                                                                )}
                                                            </td>

                                                            <td className="px-5 py-4 text-sm text-[#1c1e21]">
                                                                {formatNumber(
                                                                    insight.clicks,
                                                                )}
                                                            </td>

                                                            <td className="px-5 py-4 text-sm text-[#1c1e21]">
                                                                {formatDecimal(
                                                                    insight.ctr,
                                                                    2,
                                                                )}
                                                                %
                                                            </td>

                                                            <td className="px-5 py-4 text-sm text-[#1c1e21]">
                                                                {formatDecimal(
                                                                    insight.cpc,
                                                                    2,
                                                                )}
                                                            </td>

                                                            <td className="px-5 py-4 text-sm text-[#1c1e21]">
                                                                {formatDecimal(
                                                                    insight.cpm,
                                                                    2,
                                                                )}
                                                            </td>

                                                            <td className="px-5 py-4 text-sm font-semibold text-[#1c1e21]">
                                                                {formatDecimal(
                                                                    insight.spend,
                                                                    2,
                                                                )}
                                                            </td>

                                                            <td className="px-5 py-4 text-sm font-semibold text-[#1c1e21]">
                                                                {formatNumber(
                                                                    insight.conversions ??
                                                                    0,
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                            </tbody>

                                            {/* ================================================= */}
                                            {/* TOTAL */}
                                            {/* ================================================= */}

                                            <tfoot>
                                                <tr className="bg-[#fafbfc]">
                                                    <td className="px-5 py-4 text-sm font-bold text-[#1c1e21]">
                                                        Total
                                                    </td>

                                                    <td className="px-5 py-4 text-sm font-bold text-[#1c1e21]">
                                                        {formatNumber(
                                                            insightTotals.impressions,
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4 text-sm font-bold text-[#1c1e21]">
                                                        {formatNumber(
                                                            insightTotals.reach,
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4 text-sm font-bold text-[#1c1e21]">
                                                        {formatNumber(
                                                            insightTotals.clicks,
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4 text-sm font-bold text-[#1c1e21]">
                                                        {formatDecimal(
                                                            insightTotals.ctr,
                                                            2,
                                                        )}
                                                        %
                                                    </td>

                                                    <td className="px-5 py-4 text-sm font-bold text-[#1c1e21]">
                                                        {formatDecimal(
                                                            insightTotals.cpc,
                                                            2,
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4 text-sm font-bold text-[#1c1e21]">
                                                        {formatDecimal(
                                                            insightTotals.cpm,
                                                            2,
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4 text-sm font-bold text-[#1c1e21]">
                                                        {formatDecimal(
                                                            insightTotals.spend,
                                                            2,
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4 text-sm font-bold text-[#1c1e21]">
                                                        {formatNumber(
                                                            insightTotals.conversions,
                                                        )}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

/*
 * =============================================================
 * REUSABLE COMPONENTS
 * =============================================================
 */

function InfoBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl bg-[#f7f8f9] p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#8a8d91]">
                {label}
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-[#1c1e21]">
                {value}
            </p>
        </div>
    );
}

function SectionHeader({
    eyebrow,
    title,
    count,
    loading,
}: {
    eyebrow: string;
    title: string;
    count: number;
    loading?: boolean;
}) {
    return (
        <div className="mb-4 flex items-end justify-between">
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8a8d91]">
                    {eyebrow}
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#1c1e21]">
                    {title}
                </h2>
            </div>

            {!loading && (
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#65676b] ring-1 ring-[#dadde1]">
                    {count}{" "}
                    {count === 1 ? title.slice(0, -1) : title.toLowerCase()}
                </span>
            )}
        </div>
    );
}

function LoadingBox({ text }: { text: string }) {
    return (
        <div className="flex min-h-[140px] items-center justify-center rounded-2xl border border-[#dadde1] bg-white">
            <div className="flex items-center gap-3 text-sm text-[#65676b]">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#1877F2]" />

                {text}
            </div>
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="flex min-h-[140px] items-center justify-center rounded-2xl border border-dashed border-[#d5d7da] bg-white">
            <div className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f6f7] text-[#8a8d91]">
                    —
                </div>

                <p className="mt-3 text-sm text-[#65676b]">{text}</p>
            </div>
        </div>
    );
}

function InsightCard({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="group rounded-2xl border border-[#dadde1] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wide text-[#8a8d91]">
                    {label}
                </p>

                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eaf2ff] text-[#1877F2]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1877F2]" />
                </div>
            </div>

            <p className="mt-4 text-2xl font-bold tracking-tight text-[#1c1e21]">
                {value}
            </p>
        </div>
    );
}

function DateInput({
    label,
    value,
    min,
    max,
    onChange,
}: {
    label: string;
    value: string;
    min?: string;
    max?: string;
    onChange: (value: string) => void;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[#8a8d91]">
                {label}
            </label>

            <input
                type="date"
                value={value}
                min={min}
                max={max}
                onChange={(e) => onChange(e.target.value)}
                className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-[#dadde1]
                    bg-white
                    px-3
                    text-sm
                    font-medium
                    text-[#1c1e21]
                    outline-none
                    transition
                    focus:border-[#1877F2]
                    focus:ring-2
                    focus:ring-[#1877F2]/10
                    sm:w-[150px]
                "
            />
        </div>
    );
}

function formatNumber(value: number | string | null | undefined) {
    const number = Number(value) || 0;

    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0,
    }).format(number);
}

function formatDecimal(
    value: number | string | null | undefined,
    maximumFractionDigits = 2,
) {
    const number = Number(value) || 0;

    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits,
    }).format(number);
}

// function formatInsightDate(value: string | null | undefined) {
//     if (!value) {
//         return "—";
//     }

//     const date = new Date(`${value}T00:00:00`);

//     if (Number.isNaN(date.getTime())) {
//         return value;
//     }

//     return new Intl.DateTimeFormat("en-US", {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//     }).format(date);
// }

function formatInsightDate(value: string | null | undefined) {
    if (!value) {
        return "—";
    }

    // Meta normally returns YYYY-MM-DD.
    // Also safely handle values such as YYYY-MM-DDTHH:mm:ss.
    const normalized = value.includes("T")
        ? value.split("T")[0]
        : value;

    const match = normalized.match(
        /^(\d{4})-(\d{2})-(\d{2})$/,
    );

    if (!match) {
        return value;
    }

    const [, year, month, day] = match;

    const date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
    );

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}



function InsightChartCard({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-[#dadde1] bg-white shadow-sm">
            <div className="border-b border-[#f0f1f2] px-5 py-4">
                <h3 className="text-base font-bold text-[#1c1e21]">
                    {title}
                </h3>

                <p className="mt-1 text-xs text-[#8a8d91]">
                    {description}
                </p>
            </div>

            <div className="p-5">
                {children}
            </div>
        </div>
    );
}


function PerformanceLineChart({
    data,
    lines,
}: {
    data: Insight[];
    lines: {
        key: string;
        label: string;
        className: string;
    }[];
}) {
    if (!data.length) {
        return (
            <div className="flex h-[280px] items-center justify-center text-sm text-[#8a8d91]">
                No chart data available
            </div>
        );
    }

    const width = 760;
    const height = 280;

    const padding = {
        top: 20,
        right: 20,
        bottom: 42,
        left: 52,
    };

    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    const values = lines.flatMap((line) =>
        data.map((item) => Number(item[line.key]) || 0),
    );

    const maxValue = Math.max(...values, 1);

    const getX = (index: number) => {
        if (data.length === 1) {
            return padding.left + innerWidth / 2;
        }

        return (
            padding.left +
            (index / (data.length - 1)) * innerWidth
        );
    };

    const getY = (value: number) => {
        return (
            padding.top +
            innerHeight -
            (value / maxValue) * innerHeight
        );
    };

    const createPath = (key: string) => {
        return data
            .map((item, index) => {
                const x = getX(index);
                const y = getY(Number(item[key]) || 0);

                return `${index === 0 ? "M" : "L"} ${x} ${y}`;
            })
            .join(" ");
    };

    const yTicks = [0, 0.25, 0.5, 0.75, 1];

    return (
        <div className="w-full">
            {/* LEGEND */}
            <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2">
                {lines.map((line) => (
                    <div
                        key={line.key}
                        className="flex items-center gap-2"
                    >
                        <span
                            className={`h-2.5 w-2.5 rounded-full ${line.className
                                .replace("stroke-", "bg-")}`}
                        />

                        <span className="text-xs font-medium text-[#65676b]">
                            {line.label}
                        </span>
                    </div>
                ))}
            </div>

            <div className="w-full overflow-hidden">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="h-auto w-full"
                    preserveAspectRatio="none"
                >
                    {/* GRID */}
                    {yTicks.map((tick) => {
                        const y =
                            padding.top +
                            innerHeight -
                            tick * innerHeight;

                        return (
                            <g key={tick}>
                                <line
                                    x1={padding.left}
                                    x2={width - padding.right}
                                    y1={y}
                                    y2={y}
                                    className="stroke-[#eef0f2]"
                                    strokeWidth="1"
                                />

                                <text
                                    x={padding.left - 10}
                                    y={y + 4}
                                    textAnchor="end"
                                    className="fill-[#8a8d91] text-[10px]"
                                >
                                    {formatCompactNumber(
                                        maxValue * tick,
                                    )}
                                </text>
                            </g>
                        );
                    })}

                    {/* LINES */}
                    {lines.map((line) => (
                        <g key={line.key}>
                            <path
                                d={createPath(line.key)}
                                fill="none"
                                className={`${line.className} opacity-90`}
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            {data.map((item, index) => (
                                <circle
                                    key={`${line.key}-${index}`}
                                    cx={getX(index)}
                                    cy={getY(
                                        Number(item[line.key]) || 0,
                                    )}
                                    r="3"
                                    className={`fill-white ${line.className}`}
                                    strokeWidth="2"
                                />
                            ))}
                        </g>
                    ))}

                    {/* X AXIS */}
                    {data.map((item, index) => {
                        // Don't overcrowd the axis when there are many days.
                        const maxLabels = 7;
                        const step = Math.max(
                            1,
                            Math.ceil(data.length / maxLabels),
                        );

                        if (
                            index % step !== 0 &&
                            index !== data.length - 1
                        ) {
                            return null;
                        }

                        return (
                            <text
                                key={`date-${index}`}
                                x={getX(index)}
                                y={height - 12}
                                textAnchor="middle"
                                className="fill-[#8a8d91] text-[10px]"
                            >
                                {formatShortInsightDate(item.date_start)}
                            </text>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}

type InsightTotals = {
    impressions: number;
    reach: number;
    clicks: number;
    spend: number;
    conversions: number;
    ctr: number;
    cpc: number;
    cpm: number;
};

function SpendEfficiencyChart({
    data,
    insightTotals
}: {
    data: Insight[];
    insightTotals: InsightTotals;
}) {
    if (!data.length) {
        return (
            <div className="flex h-[280px] items-center justify-center text-sm text-[#8a8d91]">
                No chart data available
            </div>
        );
    }

    const width = 760;
    const height = 280;

    const padding = {
        top: 20,
        right: 20,
        bottom: 42,
        left: 52,
    };

    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    const maxSpend = Math.max(
        ...data.map((item) => Number(item.spend) || 0),
        1,
    );

    const maxCtr = Math.max(
        ...data.map((item) => Number(item.ctr) || 0),
        1,
    );

    const getX = (index: number) => {
        if (data.length === 1) {
            return padding.left + innerWidth / 2;
        }

        return (
            padding.left +
            (index / (data.length - 1)) * innerWidth
        );
    };

    const getSpendY = (value: number) => {
        return (
            padding.top +
            innerHeight -
            (value / maxSpend) * innerHeight
        );
    };

    const getCtrY = (value: number) => {
        return (
            padding.top +
            innerHeight -
            (value / maxCtr) * innerHeight
        );
    };

    const spendPath = data
        .map((item, index) => {
            const x = getX(index);
            const y = getSpendY(Number(item.spend) || 0);

            return `${index === 0 ? "M" : "L"} ${x} ${y}`;
        })
        .join(" ");

    const ctrPath = data
        .map((item, index) => {
            const x = getX(index);
            const y = getCtrY(Number(item.ctr) || 0);

            return `${index === 0 ? "M" : "L"} ${x} ${y}`;
        })
        .join(" ");

    return (
        <div className="w-full">
            {/* LEGEND */}
            <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2">
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#1877F2]" />

                    <span className="text-xs font-medium text-[#65676b]">
                        Spend
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />

                    <span className="text-xs font-medium text-[#65676b]">
                        CTR
                    </span>
                </div>
            </div>

            <div className="w-full overflow-hidden">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="h-auto w-full"
                    preserveAspectRatio="none"
                >
                    {/* GRID */}
                    {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
                        const y =
                            padding.top +
                            innerHeight -
                            tick * innerHeight;

                        return (
                            <line
                                key={tick}
                                x1={padding.left}
                                x2={width - padding.right}
                                y1={y}
                                y2={y}
                                className="stroke-[#eef0f2]"
                                strokeWidth="1"
                            />
                        );
                    })}

                    {/* SPEND AXIS LABELS */}
                    {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
                        const y =
                            padding.top +
                            innerHeight -
                            tick * innerHeight;

                        return (
                            <text
                                key={`spend-${tick}`}
                                x={padding.left - 10}
                                y={y + 4}
                                textAnchor="end"
                                className="fill-[#8a8d91] text-[10px]"
                            >
                                {formatCompactNumber(
                                    maxSpend * tick,
                                )}
                            </text>
                        );
                    })}

                    {/* SPEND LINE */}
                    <path
                        d={spendPath}
                        fill="none"
                        className="stroke-[#1877F2]"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* CTR LINE */}
                    <path
                        d={ctrPath}
                        fill="none"
                        className="stroke-[#10B981]"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* DATA POINTS */}
                    {data.map((item, index) => (
                        <g key={index}>
                            <circle
                                cx={getX(index)}
                                cy={getSpendY(
                                    Number(item.spend) || 0,
                                )}
                                r="3"
                                className="fill-white stroke-[#1877F2]"
                                strokeWidth="2"
                            />

                            <circle
                                cx={getX(index)}
                                cy={getCtrY(
                                    Number(item.ctr) || 0,
                                )}
                                r="3"
                                className="fill-white stroke-[#10B981]"
                                strokeWidth="2"
                            />
                        </g>
                    ))}

                    {/* DATES */}
                    {data.map((item, index) => {
                        const maxLabels = 7;
                        const step = Math.max(
                            1,
                            Math.ceil(data.length / maxLabels),
                        );

                        if (
                            index % step !== 0 &&
                            index !== data.length - 1
                        ) {
                            return null;
                        }

                        return (
                            <text
                                key={`date-${index}`}
                                x={getX(index)}
                                y={height - 12}
                                textAnchor="middle"
                                className="fill-[#8a8d91] text-[10px]"
                            >
                                {formatShortInsightDate(
                                    item.date_start,
                                )}
                            </text>
                        );
                    })}
                </svg>
            </div>

            {/* QUICK EFFICIENCY SUMMARY */}
            <div className="mt-4 grid grid-cols-3 gap-2">
                <MiniMetric
                    label="Avg. CTR"
                    value={`${formatDecimal(
                        insightTotals.ctr,
                        2,
                    )}%`}
                />

                <MiniMetric
                    label="Avg. CPC"
                    value={formatDecimal(
                        insightTotals.cpc,
                        2,
                    )}
                />

                <MiniMetric
                    label="CPM"
                    value={formatDecimal(
                        insightTotals.cpm,
                        2,
                    )}
                />
            </div>
        </div>
    );
}


function MiniMetric({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="rounded-xl bg-[#f7f8f9] px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#8a8d91]">
                {label}
            </p>

            <p className="mt-1 text-sm font-bold text-[#1c1e21]">
                {value}
            </p>
        </div>
    );
}

function formatShortInsightDate(
    value: string | null | undefined,
) {
    if (!value) {
        return "—";
    }

    const normalized = value.includes("T")
        ? value.split("T")[0]
        : value;

    const match = normalized.match(
        /^(\d{4})-(\d{2})-(\d{2})$/,
    );

    if (!match) {
        return value;
    }

    const [, year, month, day] = match;

    const date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
    );

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
    }).format(date);
}

function formatCompactNumber(value: number) {
    return new Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
}
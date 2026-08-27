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


import {
    AdAccount,
    MetaStatusResponse,
    MetaAccountsResponse,
    Campaign,
    MetaCampaignsResponse,
    AdSet,
    MetaAdSetsResponse,
    Ad,
    MetaAdsResponse,
    Insight,
    MetaInsightsResponse,
  } from "@/types/meta.types";


import { DrilldownState, DrilldownAction, initialDrilldownState } from "./state/drilldown.reducer";
import {drilldownReducer} from "./state/drilldown.reducer";

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

import { apiGet } from "./api/api-client";

import { InfoBox } from "./components/InfoBox";
import { SectionHeader } from "./components/SectionHeader";
import { LoadingBox } from "./components/LoadingBox";
import { EmptyState } from "./components/EmptyState";
import { InsightCard } from "./components/InsightCard";
import { DateInput } from "./components/DateInput";
import { formatNumber } from "./components/formatNumber";
import { formatDecimal } from "./components/formatDecimal";
import { formatInsightDate } from "./components/formatInsightDate";
import { InsightChartCard } from "./components/InsightChartCard";
import { PerformanceLineChart } from "./components/PerformanceLineChart";
import { SpendEfficiencyChart } from "./components/SpendEfficiencyChart";
import { MiniMetric } from "./components/MiniMetric";
import { formatShortInsightDate } from "./components/formatShortInsightDate";
import { formatCompactNumber } from "./components/formatCompactNumber";

import MetaHeader from "./components/MetaHeader";
import MetaBreadcrumb from "./components/MetaBreadcrumb";
import AdAccountsSection from "./components/AdAccountsSection";
import CampaignsSection from "./components/CampaignsSection";
import AdSetsSection from "./components/AdSetsSection";
import AdsSection from "./components/AdsSection";

import InsightsHeader from "./components/InsightsHeader";

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

                <MetaHeader connected={state.connected} />

                <MetaBreadcrumb selectedAccount={selectedAccount} selectedCampaign={selectedCampaign} selectedAdSet={selectedAdSet}/>

                <AdAccountsSection accounts={accounts} selectedAccount={selectedAccount} onSelectAccount={handleSelectAccount}/>

                <CampaignsSection selectedAccount={selectedAccount}  campaigns={campaigns} selectedCampaign={selectedCampaign} getStatusClass={getStatusClass} loading={loadingState.campaigns} onSelectCampaign={handleSelectCampaign} />

               <AdSetsSection selectedCampaign={selectedCampaign} adSets={adSets} loading={loadingState.adSets} getStatusClass={getStatusClass} selectedAdSet={selectedAdSet} onSelectAdSet={handleSelectAdSet}/>

                <AdsSection selectedAdSet={selectedAdSet} ads={ads} onSelectAd={handleSelectAd} getStatusClass={getStatusClass} loading={loadingState.ads} />

                {selectedAd && (
                    <div className="mt-10 pb-16">

                       <InsightsHeader selectedAd={selectedAd} dateStart={dateStart} dateEnd={dateEnd} loading={loadingState.insights} 
                       onDateStartChange={setDateStart} onDateEndChange={setDateEnd} onApplyDateRange={applyDateRange}
                        />

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


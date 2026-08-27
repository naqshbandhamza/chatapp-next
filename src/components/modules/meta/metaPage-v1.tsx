"use client";

import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import MetaConnect from "./metaConnect";

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

export default function MetaPage() {
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);

    const [accounts, setAccounts] = useState<AdAccount[]>([]);
    const [selectedAccount, setSelectedAccount] =
        useState<AdAccount | null>(null);

    const [campaigns, setCampaigns] =
        useState<Campaign[]>([]);
    const [campaignsLoading, setCampaignsLoading] =
        useState(false);
    const [selectedCampaign, setSelectedCampaign] =
        useState<Campaign | null>(null);

    const [adSets, setAdSets] =
        useState<AdSet[]>([]);
    const [adSetsLoading, setAdSetsLoading] =
        useState(false);
    const [selectedAdSet, setSelectedAdSet] =
        useState<AdSet | null>(null);

    const [ads, setAds] = useState<Ad[]>([]);
    const [adsLoading, setAdsLoading] =
        useState(false);

    const [selectedAd, setSelectedAd] =
        useState<Ad | null>(null);

    const [insights, setInsights] =
        useState<Insight[]>([]);

    const [insightsLoading, setInsightsLoading] =
        useState(false);

    const [dateStart, setDateStart] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date.toISOString().split("T")[0];
    });

    const [dateEnd, setDateEnd] = useState(() => {
        return new Date().toISOString().split("T")[0];
    });

    const [appliedDateStart, setAppliedDateStart] =
        useState(dateStart);

    const [appliedDateEnd, setAppliedDateEnd] =
        useState(dateEnd);

    const [error, setError] =
        useState<string | null>(null);

    const { token } = useSelector(
        (state: any) => state.user,
    );

    /*
     * ---------------------------------------------------------
     * LOAD META
     * ---------------------------------------------------------
     */

    const loadMeta = useCallback(async () => {
        if (!token) {
            console.log(
                "META: Waiting for authentication token...",
            );
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const statusResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/meta/status/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                    credentials: "include",
                },
            );

            if (!statusResponse.ok) {
                throw new Error(
                    "Failed to check Meta connection status.",
                );
            }

            const status: MetaStatusResponse =
                await statusResponse.json();

            setConnected(status.connected);

            if (!status.connected) {
                setAccounts([]);
                return;
            }

            const accountsResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/meta/ad-accounts/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                    credentials: "include",
                },
            );

            if (!accountsResponse.ok) {
                throw new Error(
                    "Failed to load Meta ad accounts.",
                );
            }

            const accountsData: MetaAccountsResponse =
                await accountsResponse.json();

            setAccounts(
                accountsData.ad_accounts ?? [],
            );
        } catch (error) {
            console.error(
                "META LOAD ERROR:",
                error,
            );

            setError(
                "Unable to load your Meta connection.",
            );
        } finally {
            setLoading(false);
        }
    }, [token]);

    /*
     * ---------------------------------------------------------
     * LOAD CAMPAIGNS
     * ---------------------------------------------------------
     */

    const loadCampaigns = useCallback(
        async (accountId: number) => {
            try {
                setCampaignsLoading(true);
                setError(null);

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/meta/campaigns/?ad_account=${accountId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                        credentials: "include",
                    },
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load campaigns.",
                    );
                }

                const data: MetaCampaignsResponse =
                    await response.json();

                setCampaigns(
                    data.campaigns ?? [],
                );
            } catch (error) {
                console.error(
                    "CAMPAIGNS LOAD ERROR:",
                    error,
                );

                setError(
                    "Unable to load campaigns.",
                );
            } finally {
                setCampaignsLoading(false);
            }
        },
        [token],
    );

    /*
     * ---------------------------------------------------------
     * LOAD AD SETS
     * ---------------------------------------------------------
     */

    const loadAdSets = useCallback(
        async (campaignId: number) => {
            try {
                setAdSetsLoading(true);
                setError(null);

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/meta/ad-sets/?campaign=${campaignId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                        credentials: "include",
                    },
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load ad sets.",
                    );
                }

                const data: MetaAdSetsResponse =
                    await response.json();

                setAdSets(data.ad_sets ?? []);
            } catch (error) {
                console.error(
                    "AD SETS LOAD ERROR:",
                    error,
                );

                setError(
                    "Unable to load ad sets.",
                );
            } finally {
                setAdSetsLoading(false);
            }
        },
        [token],
    );

    /*
     * ---------------------------------------------------------
     * LOAD ADS
     * ---------------------------------------------------------
     */

    const loadAds = useCallback(
        async (adSetId: number) => {
            try {
                setAdsLoading(true);
                setError(null);

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/meta/ads/?ad_set=${adSetId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                        credentials: "include",
                    },
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load ads.",
                    );
                }

                const data: MetaAdsResponse =
                    await response.json();

                setAds(data.ads ?? []);
            } catch (error) {
                console.error(
                    "ADS LOAD ERROR:",
                    error,
                );

                setError(
                    "Unable to load ads.",
                );
            } finally {
                setAdsLoading(false);
            }
        },
        [token],
    );

    const loadInsights = useCallback(
        async (
            adId: number,
            startDate: string,
            endDate: string,
        ) => {
            try {
                setInsightsLoading(true);
                setError(null);

                const params = new URLSearchParams({
                    ad: String(adId),
                    date_start: startDate,
                    date_stop: endDate,
                });

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/meta/insights/?${params.toString()}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Token ${token}`,
                        },
                        credentials: "include",
                    },
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load insights.",
                    );
                }

                const data: MetaInsightsResponse =
                    await response.json();

                setInsights(data.insights ?? []);
            } catch (error) {
                console.error(
                    "INSIGHTS LOAD ERROR:",
                    error,
                );

                setError(
                    "Unable to load ad insights.",
                );
            } finally {
                setInsightsLoading(false);
            }
        },
        [token],
    );

    useEffect(() => {
        if (!token) return;

        loadMeta();
    }, [token, loadMeta]);

    /*
     * ---------------------------------------------------------
     * HELPERS
     * ---------------------------------------------------------
     */

    const getStatusClass = (
        status: string | null,
    ) => {
        const normalized =
            status?.toLowerCase();

        if (
            normalized === "active" ||
            normalized === "enabled"
        ) {
            return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
        }

        if (
            normalized === "paused" ||
            normalized === "inactive"
        ) {
            return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
        }

        {
            return "bg-gray-100 text-gray-600 ring-1 ring-gray-200";
        }
    };

    /*
     * ---------------------------------------------------------
     * LOADING
     * ---------------------------------------------------------
     */

    const applyDateRange = () => {
        if (!selectedAd) {
            return;
        }

        if (!dateStart || !dateEnd) {
            return;
        }

        if (dateStart > dateEnd) {
            setError("Start date cannot be after end date.");
            return;
        }

        setError(null);

        setAppliedDateStart(dateStart);
        setAppliedDateEnd(dateEnd);

        loadInsights(
            selectedAd.id,
            dateStart,
            dateEnd,
        );
    };

    if (loading) {
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

    if (!connected) {
        return (
            <MetaConnect
                onConnected={loadMeta}
            />
        );
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

                {(selectedAccount ||
                    selectedCampaign ||
                    selectedAdSet) && (
                        <div className="mb-6 overflow-x-auto">
                            <div className="flex min-w-max items-center gap-2 rounded-xl border border-[#dadde1] bg-white px-4 py-3 shadow-sm">

                                <span className="text-xs font-medium uppercase tracking-wide text-[#8a8d91]">
                                    Viewing
                                </span>

                                {selectedAccount && (
                                    <>
                                        <span className="text-[#c7c9cc]">
                                            /
                                        </span>

                                        <span className="max-w-[180px] truncate text-sm font-semibold text-[#1c1e21]">
                                            {selectedAccount.name ||
                                                "Ad Account"}
                                        </span>
                                    </>
                                )}

                                {selectedCampaign && (
                                    <>
                                        <span className="text-[#c7c9cc]">
                                            /
                                        </span>

                                        <span className="max-w-[180px] truncate text-sm font-semibold text-[#1c1e21]">
                                            {selectedCampaign.name ||
                                                "Campaign"}
                                        </span>
                                    </>
                                )}

                                {selectedAdSet && (
                                    <>
                                        <span className="text-[#c7c9cc]">
                                            /
                                        </span>

                                        <span className="max-w-[180px] truncate text-sm font-semibold text-[#1c1e21]">
                                            {selectedAdSet.name ||
                                                "Ad Set"}
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
                            {accounts.length === 1
                                ? "account"
                                : "accounts"}
                        </span>
                    </div>

                    {accounts.length === 0 ? (
                        <EmptyState text="No ad accounts found." />
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {accounts.map(
                                (account) => {
                                    const selected =
                                        selectedAccount?.id ===
                                        account.id;

                                    return (
                                        <button
                                            key={account.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedAccount(
                                                    account,
                                                );

                                                setSelectedCampaign(
                                                    null,
                                                );

                                                setSelectedAdSet(
                                                    null,
                                                );

                                                setCampaigns(
                                                    [],
                                                );

                                                setAdSets(
                                                    [],
                                                );

                                                setAds(
                                                    [],
                                                );

                                                loadCampaigns(
                                                    account.id,
                                                );
                                            }}
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
                                                    value={
                                                        account.currency ||
                                                        "—"
                                                    }
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
                                },
                            )}
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
                            loading={campaignsLoading}
                        />

                        {campaignsLoading ? (
                            <LoadingBox text="Loading campaigns..." />
                        ) : campaigns.length === 0 ? (
                            <EmptyState text="No campaigns found for this ad account." />
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {campaigns.map(
                                    (campaign) => {
                                        const selected =
                                            selectedCampaign?.id ===
                                            campaign.id;

                                        return (
                                            <button
                                                key={
                                                    campaign.id
                                                }
                                                type="button"
                                                onClick={() => {
                                                    setSelectedCampaign(
                                                        campaign,
                                                    );

                                                    setSelectedAdSet(
                                                        null,
                                                    );

                                                    setAdSets(
                                                        [],
                                                    );

                                                    setAds(
                                                        [],
                                                    );

                                                    loadAdSets(
                                                        campaign.id,
                                                    );
                                                }}
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
                                                                {
                                                                    campaign.meta_id
                                                                }
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
                                    },
                                )}
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
                            loading={adSetsLoading}
                        />

                        {adSetsLoading ? (
                            <LoadingBox text="Loading ad sets..." />
                        ) : adSets.length === 0 ? (
                            <EmptyState text="No ad sets found for this campaign." />
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {adSets.map(
                                    (adSet) => {
                                        const selected =
                                            selectedAdSet?.id ===
                                            adSet.id;

                                        return (
                                            <button
                                                key={
                                                    adSet.id
                                                }
                                                type="button"
                                                onClick={() => {
                                                    setSelectedAdSet(
                                                        adSet,
                                                    );

                                                    setAds(
                                                        [],
                                                    );

                                                    loadAds(
                                                        adSet.id,
                                                    );
                                                }}
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
                                                                {
                                                                    adSet.meta_id
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <span
                                                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClass(
                                                            adSet.status,
                                                        )}`}
                                                    >
                                                        {adSet.status ||
                                                            "Unknown"}
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
                                    },
                                )}
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
                            loading={adsLoading}
                        />

                        {adsLoading ? (
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
                                                        {
                                                            ad.meta_id
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <span
                                                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClass(
                                                    ad.status,
                                                )}`}
                                            >
                                                {ad.status ||
                                                    "Unknown"}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedAd(ad);

                                                loadInsights(
                                                    ad.id,
                                                    dateStart,
                                                    dateEnd,
                                                );
                                            }}
                                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1c1e21] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
                                        >
                                            View insights
                                            <span>
                                                →
                                            </span>
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
                                                insightsLoading ||
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
                                            {insightsLoading
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

                            {!insightsLoading && insights.length > 0 && (
                                <span className="text-xs text-[#8a8d91]">
                                    {insights.length}{" "}
                                    {insights.length === 1
                                        ? "day"
                                        : "days"}{" "}
                                    of data
                                </span>
                            )}
                        </div>

                        {/* ========================================================= */}
                        {/* LOADING */}
                        {/* ========================================================= */}

                        {insightsLoading ? (
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
                            /* ===================================================== */
                            /* EMPTY */
                            /* ===================================================== */

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
                            (() => {
                                /*
                                 * =================================================
                                 * AGGREGATE ALL INSIGHTS
                                 * =================================================
                                 *
                                 * Meta can return one row per day.
                                 *
                                 * We therefore DO NOT use insights[0].
                                 */

                                const totals = insights.reduce(
                                    (acc, insight) => {
                                        acc.impressions +=
                                            Number(
                                                insight.impressions,
                                            ) || 0;

                                        acc.reach +=
                                            Number(insight.reach) || 0;

                                        acc.clicks +=
                                            Number(insight.clicks) || 0;

                                        acc.spend +=
                                            Number(insight.spend) || 0;

                                        acc.conversions +=
                                            Number(
                                                insight.conversions,
                                            ) || 0;

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

                                /*
                                 * Calculate derived metrics from totals.
                                 *
                                 * Do NOT average daily CTR/CPC/CPM.
                                 */

                                const totalCtr =
                                    totals.impressions > 0
                                        ? (totals.clicks /
                                            totals.impressions) *
                                        100
                                        : 0;

                                const totalCpc =
                                    totals.clicks > 0
                                        ? totals.spend /
                                        totals.clicks
                                        : 0;

                                const totalCpm =
                                    totals.impressions > 0
                                        ? (totals.spend /
                                            totals.impressions) *
                                        1000
                                        : 0;

                                return (
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
                                                        totals.impressions,
                                                    )}
                                                />

                                                <InsightCard
                                                    label="Reach"
                                                    value={formatNumber(
                                                        totals.reach,
                                                    )}
                                                />

                                                <InsightCard
                                                    label="Clicks"
                                                    value={formatNumber(
                                                        totals.clicks,
                                                    )}
                                                />

                                                <InsightCard
                                                    label="Spend"
                                                    value={formatDecimal(
                                                        totals.spend,
                                                    )}
                                                />

                                                <InsightCard
                                                    label="CTR"
                                                    value={`${formatDecimal(
                                                        totalCtr,
                                                        2,
                                                    )}%`}
                                                />

                                                <InsightCard
                                                    label="CPC"
                                                    value={formatDecimal(
                                                        totalCpc,
                                                        2,
                                                    )}
                                                />

                                                <InsightCard
                                                    label="CPM"
                                                    value={formatDecimal(
                                                        totalCpm,
                                                        2,
                                                    )}
                                                />

                                                <InsightCard
                                                    label="Conversions"
                                                    value={formatNumber(
                                                        totals.conversions,
                                                    )}
                                                />
                                            </div>
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
                                                            (
                                                                insight,
                                                                index,
                                                            ) => (
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
                                                                    totals.impressions,
                                                                )}
                                                            </td>

                                                            <td className="px-5 py-4 text-sm font-bold text-[#1c1e21]">
                                                                {formatNumber(
                                                                    totals.reach,
                                                                )}
                                                            </td>

                                                            <td className="px-5 py-4 text-sm font-bold text-[#1c1e21]">
                                                                {formatNumber(
                                                                    totals.clicks,
                                                                )}
                                                            </td>

                                                            <td className="px-5 py-4 text-sm font-bold text-[#1c1e21]">
                                                                {formatDecimal(
                                                                    totalCtr,
                                                                    2,
                                                                )}
                                                                %
                                                            </td>

                                                            <td className="px-5 py-4 text-sm font-bold text-[#1c1e21]">
                                                                {formatDecimal(
                                                                    totalCpc,
                                                                    2,
                                                                )}
                                                            </td>

                                                            <td className="px-5 py-4 text-sm font-bold text-[#1c1e21]">
                                                                {formatDecimal(
                                                                    totalCpm,
                                                                    2,
                                                                )}
                                                            </td>

                                                            <td className="px-5 py-4 text-sm font-bold text-[#1c1e21]">
                                                                {formatDecimal(
                                                                    totals.spend,
                                                                    2,
                                                                )}
                                                            </td>

                                                            <td className="px-5 py-4 text-sm font-bold text-[#1c1e21]">
                                                                {formatNumber(
                                                                    totals.conversions,
                                                                )}
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()
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

function InfoBox({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
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
                    {count === 1
                        ? title.slice(0, -1)
                        : title.toLowerCase()}
                </span>
            )}
        </div>
    );
}

function LoadingBox({
    text,
}: {
    text: string;
}) {
    return (
        <div className="flex min-h-[140px] items-center justify-center rounded-2xl border border-[#dadde1] bg-white">
            <div className="flex items-center gap-3 text-sm text-[#65676b]">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#1877F2]" />

                {text}
            </div>
        </div>
    );
}

function EmptyState({
    text,
}: {
    text: string;
}) {
    return (
        <div className="flex min-h-[140px] items-center justify-center rounded-2xl border border-dashed border-[#d5d7da] bg-white">
            <div className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f6f7] text-[#8a8d91]">
                    —
                </div>

                <p className="mt-3 text-sm text-[#65676b]">
                    {text}
                </p>
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
                onChange={(e) =>
                    onChange(e.target.value)
                }
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

function formatNumber(
    value: number | string | null | undefined,
) {
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

function formatInsightDate(
    value: string | null | undefined,
) {
    if (!value) {
        return "—";
    }

    const date = new Date(
        `${value}T00:00:00`,
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


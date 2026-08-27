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

export default function MetaPage() {
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const [accounts, setAccounts] = useState<AdAccount[]>([]);
    const [error, setError] = useState<string | null>(null);

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

    const { token } = useSelector(
        (state: any) => state.user,
    );

    const loadMeta = useCallback(async () => {

        if (!token) {
            console.log("META: Waiting for authentication token...");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Check whether Meta is connected
            const statusResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/meta/status/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                credentials: "include",
            });

            if (!statusResponse.ok) {
                throw new Error(
                    "Failed to check Meta connection status.",
                );
            }

            const status: MetaStatusResponse =
                await statusResponse.json();

            setConnected(status.connected);

            // Not connected — nothing else to load
            if (!status.connected) {
                setAccounts([]);
                return;
            }

            // Connected — load ad accounts
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

            setAccounts(accountsData.ad_accounts ?? []);
        } catch (error) {
            console.error("META LOAD ERROR:", error);

            setError(
                "Unable to load your Meta connection.",
            );
        } finally {
            setLoading(false);
        }
    }, [token]);

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

    useEffect(() => {
        if (!token) {
            return;
        }

        loadMeta();
    }, [token, loadMeta]);

    if (loading) {
        return (
            <div className="flex min-h-full w-full items-center justify-center bg-[#f5f6f7]">
                <p className="text-sm text-[#65676b]">
                    Loading Meta...
                </p>
            </div>
        );
    }

    /*
     * NOT CONNECTED
     */
    if (!connected) {
        return (
            <MetaConnect
                onConnected={loadMeta}
            />
        );
    }

    /*
     * ERROR
     */
    if (error) {
        return (
            <div className="flex min-h-full w-full items-center justify-center bg-[#f5f6f7] p-6">
                <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
                    <h1 className="text-lg font-semibold text-[#1c1e21]">
                        Something went wrong
                    </h1>

                    <p className="mt-2 text-sm text-[#65676b]">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadMeta}
                        className="mt-5 rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    /*
     * CONNECTED
     */
    return (
        <div className="h-full w-full overflow-y-auto bg-[#f5f6f7] p-3 sm:p-4 md:p-6">
            <div className="mx-auto w-full max-w-6xl">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-[#1c1e21]">
                        Meta Ads
                    </h1>

                    <p className="mt-1 text-sm text-[#65676b]">
                        Manage your Meta advertising accounts.
                    </p>
                </div>

                {/* Connected status */}
                <div className="mb-6 flex items-center justify-between rounded-xl border border-[#dadde1] bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f7ed]">
                            <span className="text-lg text-[#1a7f37]">
                                ✓
                            </span>
                        </div>

                        <div>
                            <p className="font-semibold text-[#1c1e21]">
                                Meta Connected
                            </p>

                            <p className="text-sm text-[#65676b]">
                                Your Meta Business account is connected.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Ad accounts */}
                <div>
                    <h2 className="mb-4 text-lg font-semibold text-[#1c1e21]">
                        Ad Accounts
                    </h2>

                    {accounts.length === 0 ? (
                        <div className="rounded-xl border border-[#dadde1] bg-white p-8 text-center">
                            <p className="text-sm text-[#65676b]">
                                No ad accounts found.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {accounts.map((account) => (
                                <div
                                    key={account.id}
                                    className="rounded-xl border border-[#dadde1] bg-white p-5 shadow-sm"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <h3 className="truncate font-semibold text-[#1c1e21]">
                                                {account.name ||
                                                    "Unnamed account"}
                                            </h3>

                                            <p className="mt-1 text-xs text-[#65676b]">
                                                {account.meta_id}
                                            </p>
                                        </div>

                                        <span className="shrink-0 rounded-full bg-[#e7f7ed] px-2.5 py-1 text-xs font-medium text-[#1a7f37]">
                                            Connected
                                        </span>
                                    </div>

                                    <div className="mt-5 grid grid-cols-2 gap-3">
                                        <div className="rounded-lg bg-[#f5f6f7] p-3">
                                            <p className="text-xs text-[#65676b]">
                                                Currency
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-[#1c1e21]">
                                                {account.currency ||
                                                    "—"}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-[#f5f6f7] p-3">
                                            <p className="text-xs text-[#65676b]">
                                                Status
                                            </p>

                                            <p className="mt-1 text-sm font-medium text-[#1c1e21]">
                                                {account.account_status ===
                                                    1
                                                    ? "Active"
                                                    : "Inactive"}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedAccount(account);
                                            loadCampaigns(account.id);
                                        }}
                                        className="mt-5 w-full rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#333]"
                                    >
                                        Select account
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {selectedAccount && (
                    <div className="mt-10">
                        <h2 className="mb-4 text-lg font-semibold text-[#1c1e21]">
                            Campaigns
                        </h2>

                        {campaignsLoading ? (
                            <div className="rounded-xl border border-[#dadde1] bg-white p-8 text-center">
                                <p className="text-sm text-[#65676b]">
                                    Loading campaigns...
                                </p>
                            </div>
                        ) : campaigns.length === 0 ? (
                            <div className="rounded-xl border border-[#dadde1] bg-white p-8 text-center">
                                <p className="text-sm text-[#65676b]">
                                    No campaigns found.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {campaigns.map((campaign) => (
                                    <div
                                        key={campaign.id}
                                        className="rounded-xl border border-[#dadde1] bg-white p-5 shadow-sm"
                                    >
                                        <h3 className="truncate font-semibold text-[#1c1e21]">
                                            {campaign.name ||
                                                "Unnamed campaign"}
                                        </h3>

                                        <p className="mt-1 text-xs text-[#65676b]">
                                            {campaign.meta_id}
                                        </p>

                                        <p className="mt-4 text-sm text-[#65676b]">
                                            Status:{" "}
                                            <span className="font-medium text-[#1c1e21]">
                                                {campaign.status ||
                                                    "Unknown"}
                                            </span>
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedCampaign(
                                                    campaign,
                                                );

                                                loadAdSets(
                                                    campaign.id,
                                                );
                                            }}
                                            className="mt-5 w-full rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#333]"
                                        >
                                            Select campaign
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {selectedCampaign && (
                    <div className="mt-10">
                        <h2 className="mb-4 text-lg font-semibold text-[#1c1e21]">
                            Ad Sets
                        </h2>

                        {adSetsLoading ? (
                            <div className="rounded-xl border border-[#dadde1] bg-white p-8 text-center">
                                <p className="text-sm text-[#65676b]">
                                    Loading ad sets...
                                </p>
                            </div>
                        ) : adSets.length === 0 ? (
                            <div className="rounded-xl border border-[#dadde1] bg-white p-8 text-center">
                                <p className="text-sm text-[#65676b]">
                                    No ad sets found.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {adSets.map((adSet) => (
                                    <div
                                        key={adSet.id}
                                        className="rounded-xl border border-[#dadde1] bg-white p-5 shadow-sm"
                                    >
                                        <h3 className="truncate font-semibold text-[#1c1e21]">
                                            {adSet.name ||
                                                "Unnamed ad set"}
                                        </h3>

                                        <p className="mt-1 text-xs text-[#65676b]">
                                            {adSet.meta_id}
                                        </p>

                                        <p className="mt-4 text-sm text-[#65676b]">
                                            Status:{" "}
                                            <span className="font-medium text-[#1c1e21]">
                                                {adSet.status ||
                                                    "Unknown"}
                                            </span>
                                        </p>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedAdSet(adSet);
                                                loadAds(adSet.id);
                                            }}
                                            className="mt-5 w-full rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#333]"
                                        >
                                            Select ad set
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {selectedAdSet && (
                    <div className="mt-10">
                        <h2 className="mb-4 text-lg font-semibold text-[#1c1e21]">
                            Ads
                        </h2>

                        {adsLoading ? (
                            <div className="rounded-xl border border-[#dadde1] bg-white p-8 text-center">
                                <p className="text-sm text-[#65676b]">
                                    Loading ads...
                                </p>
                            </div>
                        ) : ads.length === 0 ? (
                            <div className="rounded-xl border border-[#dadde1] bg-white p-8 text-center">
                                <p className="text-sm text-[#65676b]">
                                    No ads found.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {ads.map((ad) => (
                                    <div
                                        key={ad.id}
                                        className="rounded-xl border border-[#dadde1] bg-white p-5 shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <h3 className="truncate font-semibold text-[#1c1e21]">
                                                    {ad.name ||
                                                        "Unnamed ad"}
                                                </h3>

                                                <p className="mt-1 text-xs text-[#65676b]">
                                                    {ad.meta_id}
                                                </p>
                                            </div>

                                            <span className="shrink-0 rounded-full bg-[#e7f7ed] px-2.5 py-1 text-xs font-medium text-[#1a7f37]">
                                                {ad.status ||
                                                    "Unknown"}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            className="mt-5 w-full rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#333]"
                                        >
                                            View insights
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}
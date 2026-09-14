import type {
    Ad,
    AdSet,
    AdCreative,
    AdVideo,
} from "@/types/meta.types";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import { LoadingBox } from "./LoadingBox";
import { EmptyState } from "./EmptyState";

import {
    getAdCreative,
    getAdVideo,
} from "../api/api-client";

import { useSelector } from "react-redux";

type AdsSectionProps = {
    selectedAdSet: AdSet | null;
    ads: Ad[];
    loading: boolean;
    getStatusClass: (status: string | null) => string;
    onSelectAd: (ad: Ad) => void;
    onSync: (adSetId: number) => void;
    syncing: boolean;
};

export default function AdsSection({
    selectedAdSet,
    ads,
    loading,
    getStatusClass,
    onSelectAd,
    onSync,
    syncing,
}: AdsSectionProps) {
    const { token } = useSelector(
        (state: any) => state.user,
    );

    const [creatives, setCreatives] = useState<
        Record<number, AdCreative | null>
    >({});

    const [creativeLoading, setCreativeLoading] =
        useState<Record<number, boolean>>({});

    const [videos, setVideos] = useState<
        Record<number, AdVideo | null>
    >({});

    const [videoLoading, setVideoLoading] =
        useState<Record<number, boolean>>({});

    const [isCollapsed, setIsCollapsed] =
        useState(false);

    const videoRequested = useRef<
        Record<number, boolean>
    >({});

    const videoRefs = useRef<
        Record<number, HTMLDivElement | null>
    >({});

    /*
     * Load creatives.
     */
    useEffect(() => {
        if (!ads.length || !token) {
            setCreatives({});
            setCreativeLoading({});
            return;
        }

        const loadCreatives = async () => {
            const results: Record<
                number,
                AdCreative | null
            > = {};

            await Promise.all(
                ads.map(async (ad) => {
                    setCreativeLoading((prev) => ({
                        ...prev,
                        [ad.id]: true,
                    }));

                    try {
                        const data =
                            await getAdCreative(
                                ad.id,
                                token,
                            );

                        results[ad.id] =
                            data.creative ?? null;
                    } catch (error) {
                        console.error(
                            `Failed to load creative for ad ${ad.id}`,
                            error,
                        );

                        results[ad.id] = null;
                    } finally {
                        setCreativeLoading((prev) => ({
                            ...prev,
                            [ad.id]: false,
                        }));
                    }
                }),
            );

            setCreatives(results);
        };

        loadCreatives();
    }, [ads, token]);

    /*
     * Observe video ads and load the actual video
     * when they approach the viewport.
     */
    useEffect(() => {
        if (!ads.length || !token) {
            return;
        }

        const observer =
            new IntersectionObserver(
                async (entries) => {
                    for (const entry of entries) {
                        if (!entry.isIntersecting) {
                            continue;
                        }

                        const element =
                            entry.target as HTMLElement;

                        const adId = Number(
                            element.dataset.adId,
                        );

                        if (!adId) {
                            continue;
                        }

                        if (
                            videoRequested.current[
                                adId
                            ]
                        ) {
                            observer.unobserve(
                                element,
                            );

                            continue;
                        }

                        const creative =
                            creatives[adId];

                        if (
                            !creative?.video_id
                        ) {
                            observer.unobserve(
                                element,
                            );

                            continue;
                        }

                        videoRequested.current[
                            adId
                        ] = true;

                        setVideoLoading(
                            (prev) => ({
                                ...prev,
                                [adId]: true,
                            }),
                        );

                        try {
                            const data =
                                await getAdVideo(
                                    adId,
                                    token,
                                );

                            setVideos((prev) => ({
                                ...prev,
                                [adId]:
                                    data.video ??
                                    null,
                            }));
                        } catch (error) {
                            console.error(
                                `Failed to load video for ad ${adId}`,
                                error,
                            );

                            setVideos((prev) => ({
                                ...prev,
                                [adId]: null,
                            }));
                        } finally {
                            setVideoLoading(
                                (prev) => ({
                                    ...prev,
                                    [adId]: false,
                                }),
                            );
                        }

                        observer.unobserve(element);
                    }
                },
                {
                    rootMargin: "300px 0px",
                    threshold: 0.01,
                },
            );

        ads.forEach((ad) => {
            const creative =
                creatives[ad.id];

            if (!creative?.video_id) {
                return;
            }

            const element =
                videoRefs.current[ad.id];

            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [ads, creatives, token]);

    if (!selectedAdSet) {
        return null;
    }

    return (
        <section className="mt-10 pb-10">
            {/* ========================================================= */}
            {/* HEADER */}
            {/* ========================================================= */}

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-[#1c1e21]">
                        Ads
                    </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#f5f6f7] px-3 py-1.5 text-xs font-medium tabular-nums text-[#65676b] ring-1 ring-[#e4e6eb]">
                        {ads.length}{" "}
                        {ads.length === 1
                            ? "ad"
                            : "ads"}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            onSync(
                                selectedAdSet.id,
                            )
                        }
                        disabled={syncing}
                        className="inline-flex min-h-[36px] items-center gap-2 rounded-lg bg-[#1565c0] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0f56ab] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1565c0] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {syncing ? (
                            <>
                                <span
                                    aria-hidden="true"
                                    className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                                />
                                Syncing...
                            </>
                        ) : (
                            <>
                                <span
                                    aria-hidden="true"
                                    className="text-sm"
                                >
                                    ↻
                                </span>
                                Sync Ads
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setIsCollapsed(
                                (prev) => !prev,
                            )
                        }
                        aria-expanded={!isCollapsed}
                        aria-controls="ads-panel"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#65676b] transition hover:bg-[#f0f2f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1565c0] focus-visible:ring-offset-2"
                    >
                        <span
                            aria-hidden="true"
                            className={`inline-block text-sm transition-transform duration-200 ${
                                isCollapsed
                                    ? "-rotate-90"
                                    : "rotate-0"
                            }`}
                        >
                            ▾
                        </span>

                        <span className="sr-only">
                            {isCollapsed
                                ? "Expand ads"
                                : "Collapse ads"}
                        </span>
                    </button>
                </div>
            </div>

            {/* ========================================================= */}
            {/* CONTENT */}
            {/* ========================================================= */}

            {!isCollapsed && (
                <div id="ads-panel">
                    {loading ? (
                        <LoadingBox text="Loading ads..." />
                    ) : ads.length === 0 ? (
                        <EmptyState text="No ads found for this ad set." />
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-[#e4e6eb] bg-white">
                            {/* ================================================= */}
                            {/* DESKTOP TABLE HEADER */}
                            {/* ================================================= */}

                            <div className="hidden border-b border-[#e4e6eb] bg-[#f8f9fa] px-4 py-2.5 sm:grid sm:grid-cols-[minmax(260px,2fr)_minmax(180px,1.5fr)_110px_130px] sm:items-center sm:gap-4">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8d91]">
                                    Ad
                                </span>

                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8d91]">
                                    Creative
                                </span>

                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8d91]">
                                    Status
                                </span>

                                <span className="text-right text-[10px] font-semibold uppercase tracking-wider text-[#8a8d91]">
                                    Action
                                </span>
                            </div>

                            {/* ================================================= */}
                            {/* AD ROWS */}
                            {/* ================================================= */}

                            <div className="divide-y divide-[#eef0f2]">
                                {ads.map((ad) => {
                                    const creative =
                                        creatives[
                                            ad.id
                                        ];

                                    const isLoadingCreative =
                                        creativeLoading[
                                            ad.id
                                        ];

                                    const isVideo =
                                        Boolean(
                                            creative?.video_id,
                                        );

                                    const video =
                                        videos[ad.id];

                                    const isLoadingVideo =
                                        videoLoading[
                                            ad.id
                                        ];

                                    const videoPicture =
                                        video?.picture ||
                                        null;

                                    const imageUrl =
                                        isVideo
                                            ? videoPicture ||
                                              creative?.thumbnail_url ||
                                              creative?.image_url ||
                                              null
                                            : creative?.image_url ||
                                              creative?.thumbnail_url ||
                                              null;

                                    const selected =
                                        false;

                                    return (
                                        <button
                                            key={ad.id}
                                            type="button"
                                            onClick={() =>
                                                onSelectAd(
                                                    ad,
                                                )
                                            }
                                            className={`group grid w-full gap-3 p-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1565c0] motion-reduce:transition-none sm:grid-cols-[minmax(260px,2fr)_minmax(180px,1.5fr)_110px_130px] sm:items-center sm:gap-4 sm:px-4 sm:py-3 ${
                                                selected
                                                    ? "bg-[#f5f9ff]"
                                                    : "bg-white hover:bg-[#f8f9fa]"
                                            }`}
                                        >
                                            {/* ================================================= */}
                                            {/* AD */}
                                            {/* ================================================= */}

                                            <div className="flex min-w-0 items-center gap-3">
                                                <div
                                                    ref={(
                                                        element,
                                                    ) => {
                                                        if (
                                                            isVideo
                                                        ) {
                                                            videoRefs.current[
                                                                ad.id
                                                            ] =
                                                                element;
                                                        }
                                                    }}
                                                    data-ad-id={
                                                        isVideo
                                                            ? ad.id
                                                            : undefined
                                                    }
                                                    className="relative flex h-14 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f0f2f5]"
                                                >
                                                    {isLoadingCreative ? (
                                                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#dadde1] border-t-[#1877F2]" />
                                                    ) : imageUrl ? (
                                                        <>
                                                            <img
                                                                src={
                                                                    imageUrl
                                                                }
                                                                alt={
                                                                    creative?.title ||
                                                                    ad.name ||
                                                                    "Ad creative"
                                                                }
                                                                loading="lazy"
                                                                className="h-full w-full object-cover"
                                                            />

                                                            {isVideo && (
                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-[10px] text-white">
                                                                        {isLoadingVideo ? (
                                                                            <span className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" />
                                                                        ) : (
                                                                            "▶"
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className="text-lg text-[#8a8d91]">
                                                            {isVideo
                                                                ? "▶"
                                                                : "▣"}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <h3 className="truncate text-sm font-semibold text-[#1c1e21]">
                                                        {ad.name ||
                                                            "Unnamed ad"}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* ================================================= */}
                                            {/* CREATIVE */}
                                            {/* ================================================= */}

                                            <div className="min-w-0">
                                                {creative ? (
                                                    <>
                                                        {creative.title && (
                                                            <p className="truncate text-sm font-medium text-[#1c1e21]">
                                                                {
                                                                    creative.title
                                                                }
                                                            </p>
                                                        )}

                                                        {creative.body && (
                                                            <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-[#65676b]">
                                                                {
                                                                    creative.body
                                                                }
                                                            </p>
                                                        )}

                                                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                                                            {creative.call_to_action_type && (
                                                                <span className="rounded-md bg-[#f0f2f5] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#65676b]">
                                                                    {creative.call_to_action_type.replace(
                                                                        /_/g,
                                                                        " ",
                                                                    )}
                                                                </span>
                                                            )}

                                                            {isVideo && (
                                                                <span className="rounded-md bg-[#f0f2f5] px-2 py-0.5 text-[9px] font-semibold text-[#65676b]">
                                                                    Video
                                                                </span>
                                                            )}

                                                            {!isVideo &&
                                                                creative.image_url && (
                                                                    <span className="rounded-md bg-[#f0f2f5] px-2 py-0.5 text-[9px] font-semibold text-[#65676b]">
                                                                        Image
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-[#8a8d91]">
                                                        No creative
                                                        information
                                                    </span>
                                                )}
                                            </div>

                                            {/* ================================================= */}
                                            {/* STATUS */}
                                            {/* ================================================= */}

                                            <div className="flex items-center">
                                                <span
                                                    className={`inline-flex shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${getStatusClass(
                                                        ad.status,
                                                    )}`}
                                                >
                                                    {ad.status ||
                                                        "Unknown"}
                                                </span>
                                            </div>

                                            {/* ================================================= */}
                                            {/* ACTION */}
                                            {/* ================================================= */}

                                            <div className="col-span-full flex items-center justify-between border-t border-[#eef0f2] pt-2.5 sm:col-span-1 sm:justify-end sm:border-0 sm:pt-0">
                                                <span className="text-xs font-medium text-[#65676b] sm:hidden">
                                                    View insights
                                                </span>

                                                <span
                                                    aria-hidden="true"
                                                    className="text-sm font-medium text-[#1877F2] transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
                                                >
                                                    <span className="hidden sm:inline">
                                                        View insights&nbsp;
                                                    </span>
                                                    →
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}


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

    /*
     * Keeps track of videos that have already been requested.
     * This prevents IntersectionObserver from repeatedly
     * calling getAdVideo().
     */
    const videoRequested = useRef<
        Record<number, boolean>
    >({});

    /*
     * Keep references to each video card.
     */
    const videoRefs = useRef<
        Record<number, HTMLDivElement | null>
    >({});

    /*
     * Hooks must run before any conditional return.
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
     * only when they approach the viewport.
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

                        /*
                         * Already requested.
                         */
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

                        /*
                         * Don't request anything if this
                         * isn't actually a video.
                         */
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
                    /*
                     * Start loading slightly before
                     * the card enters the viewport.
                     */
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

            <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#8a8d91]">
                        Level 4
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-[#1c1e21]">
                        Ads
                    </h2>
                </div>

                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#65676b] ring-1 ring-[#dadde1]">
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
                        className="inline-flex items-center gap-2 rounded-lg bg-[#1877F2] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {syncing ? (
                            <>
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Syncing...
                            </>
                        ) : (
                            <>
                                <span className="text-sm">
                                    ↻
                                </span>
                                Sync Ads
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* ========================================================= */}
            {/* CONTENT */}
            {/* ========================================================= */}

            {loading ? (
                <LoadingBox text="Loading ads..." />
            ) : ads.length === 0 ? (
                <EmptyState text="No ads found for this ad set." />
            ) : (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {ads.map((ad) => {
                        const creative =
                            creatives[ad.id];

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


                        const videoPicture = video?.picture || null;

                        const imageUrl =
                            isVideo
                                ? videoPicture ||
                                creative?.thumbnail_url ||
                                creative?.image_url ||
                                null
                                : creative?.image_url ||
                                creative?.thumbnail_url ||
                                null;



                        return (
                            <div
                                key={ad.id}
                                className="overflow-hidden rounded-2xl border border-[#dadde1] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                {/* ================================================= */}
                                {/* CREATIVE PREVIEW */}
                                {/* ================================================= */}

                                {/* ================================================= */}
                                {/* CREATIVE PREVIEW */}
                                {/* ================================================= */}

                                <div
                                    ref={(element) => {
                                        if (isVideo) {
                                            videoRefs.current[ad.id] = element;
                                        }
                                    }}
                                    data-ad-id={isVideo ? ad.id : undefined}
                                    className="relative aspect-[1.91/1] w-full overflow-hidden bg-[#f0f2f5]"
                                >
                                    {isLoadingCreative ? (
                                        <div className="flex h-full items-center justify-center">
                                            <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#dadde1] border-t-[#1877F2]" />
                                        </div>
                                    ) : isVideo ? (
                                        /*
                                         * Video source is currently unavailable from Meta.
                                         * Use the picture returned by the video endpoint.
                                         */
                                        videoPicture ? (
                                            <>
                                                <img
                                                    src={videoPicture}
                                                    alt={
                                                        creative?.title ||
                                                        ad.name ||
                                                        "Video ad"
                                                    }
                                                    loading="lazy"
                                                    className="h-full w-full object-cover"
                                                />

                                                {/* Play / loading indicator */}
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/70 text-xl text-white shadow-lg backdrop-blur-sm">
                                                        {isLoadingVideo ? (
                                                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                        ) : (
                                                            "▶"
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Video badge */}
                                                <div className="absolute left-3 top-3">
                                                    <span className="rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                                                        Video
                                                    </span>
                                                </div>
                                            </>
                                        ) : imageUrl ? (
                                            /*
                                             * Fallback to the creative thumbnail/image
                                             */
                                            <>
                                                <img
                                                    src={imageUrl}
                                                    alt={
                                                        creative?.title ||
                                                        ad.name ||
                                                        "Video ad"
                                                    }
                                                    loading="lazy"
                                                    className="h-full w-full object-cover"
                                                />

                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/70 text-xl text-white shadow-lg backdrop-blur-sm">
                                                        {isLoadingVideo ? (
                                                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                        ) : (
                                                            "▶"
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="absolute left-3 top-3">
                                                    <span className="rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                                                        Video
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex h-full flex-col items-center justify-center px-5 text-center">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                                                    ▶
                                                </div>

                                                <p className="mt-2 text-xs font-medium text-[#65676b]">
                                                    {isLoadingVideo
                                                        ? "Loading video..."
                                                        : "Video preview unavailable"}
                                                </p>
                                            </div>
                                        )
                                    ) : imageUrl ? (
                                        /*
                                         * Normal image ad
                                         */
                                        <img
                                            src={imageUrl}
                                            alt={
                                                creative?.title ||
                                                ad.name ||
                                                "Ad creative"
                                            }
                                            loading="lazy"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full flex-col items-center justify-center px-5 text-center">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                                                ▣
                                            </div>

                                            <p className="mt-2 text-xs font-medium text-[#65676b]">
                                                No preview available
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* ================================================= */}
                                {/* AD INFORMATION */}
                                {/* ================================================= */}

                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-3">
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

                                        <span
                                            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClass(
                                                ad.status,
                                            )}`}
                                        >
                                            {ad.status ||
                                                "Unknown"}
                                        </span>
                                    </div>

                                    {/* ================================================= */}
                                    {/* CREATIVE COPY */}
                                    {/* ================================================= */}

                                    {creative && (
                                        <div className="mt-4">
                                            {creative.title && (
                                                <h4 className="line-clamp-2 text-sm font-semibold leading-5 text-[#1c1e21]">
                                                    {
                                                        creative.title
                                                    }
                                                </h4>
                                            )}

                                            {creative.body && (
                                                <p className="mt-1.5 line-clamp-3 text-xs leading-5 text-[#65676b]">
                                                    {
                                                        creative.body
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* ================================================= */}
                                    {/* CREATIVE DETAILS */}
                                    {/* ================================================= */}

                                    {creative && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {creative.call_to_action_type && (
                                                <span className="rounded-md bg-[#f0f2f5] px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#65676b]">
                                                    {creative.call_to_action_type.replace(
                                                        /_/g,
                                                        " ",
                                                    )}
                                                </span>
                                            )}

                                            {isVideo && (
                                                <span className="rounded-md bg-[#f0f2f5] px-2 py-1 text-[10px] font-semibold text-[#65676b]">
                                                    Video
                                                </span>
                                            )}

                                            {!isVideo &&
                                                creative.image_url && (
                                                    <span className="rounded-md bg-[#f0f2f5] px-2 py-1 text-[10px] font-semibold text-[#65676b]">
                                                        Image
                                                    </span>
                                                )}
                                        </div>
                                    )}

                                    {/* ================================================= */}
                                    {/* ACTION */}
                                    {/* ================================================= */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onSelectAd(
                                                ad,
                                            )
                                        }
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1c1e21] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
                                    >
                                        View insights
                                        <span>
                                            →
                                        </span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
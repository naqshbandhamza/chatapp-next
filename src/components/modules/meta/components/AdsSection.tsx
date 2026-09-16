import type { Ad, AdSet, AdCreative, AdVideo } from "@/types/meta.types";

import { useEffect, useRef, useState } from "react";

import { LoadingBox } from "./LoadingBox";
import { EmptyState } from "./EmptyState";

import { getAdCreative, getAdVideo } from "../api/api-client";

import { useSelector } from "react-redux";

type AdsSectionProps = {
  selectedAdSet: AdSet | null;
  ads: Ad[];
  loading: boolean;
  getStatusClass: (status: string | null) => string;
  onSelectAd: (ad: Ad) => void;
  onSync: (adSetId: number) => void;
  syncing: boolean;

  /*
   * Returns the currently selected ads.
   */
  onSelectionChange?: (ads: Ad[]) => void;
};

export default function AdsSection({
  selectedAdSet,
  ads,
  loading,
  getStatusClass,
  onSelectAd,
  onSync,
  syncing,
  onSelectionChange,
}: AdsSectionProps) {
  const { token } = useSelector((state: any) => state.user);

  const [creatives, setCreatives] = useState<Record<number, AdCreative | null>>(
    {}
  );

  const [creativeLoading, setCreativeLoading] = useState<
    Record<number, boolean>
  >({});

  const [videos, setVideos] = useState<Record<number, AdVideo | null>>({});

  const [videoLoading, setVideoLoading] = useState<Record<number, boolean>>({});

  const [isCollapsed, setIsCollapsed] = useState(false);

  /*
   * Selected ads for bulk operations.
   */
  const [selectedAdIds, setSelectedAdIds] = useState<Set<number>>(new Set());

  const videoRequested = useRef<Record<number, boolean>>({});

  const videoRefs = useRef<Record<number, HTMLDivElement | null>>({});

  /*
   * Remove selected ads that no longer exist
   * in the currently displayed ad list.
   */
  useEffect(() => {
    setSelectedAdIds((previous) => {
      const availableIds = new Set(ads.map((ad) => ad.id));

      const next = new Set<number>();

      previous.forEach((id) => {
        if (availableIds.has(id)) {
          next.add(id);
        }
      });

      return next;
    });
  }, [ads]);

  /*
   * Notify parent whenever the selection changes.
   */
  useEffect(() => {
    if (!onSelectionChange) {
      return;
    }

    const selectedAds = ads.filter((ad) => selectedAdIds.has(ad.id));

    onSelectionChange(selectedAds);
  }, [ads, selectedAdIds, onSelectionChange]);

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
      const results: Record<number, AdCreative | null> = {};

      await Promise.all(
        ads.map(async (ad) => {
          setCreativeLoading((prev) => ({
            ...prev,
            [ad.id]: true,
          }));

          try {
            const data = await getAdCreative(ad.id, token);

            results[ad.id] = data.creative ?? null;
          } catch (error) {
            console.error(`Failed to load creative for ad ${ad.id}`, error);

            results[ad.id] = null;
          } finally {
            setCreativeLoading((prev) => ({
              ...prev,
              [ad.id]: false,
            }));
          }
        })
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

    const observer = new IntersectionObserver(
      async (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue;
          }

          const element = entry.target as HTMLElement;

          const adId = Number(element.dataset.adId);

          if (!adId) {
            continue;
          }

          if (videoRequested.current[adId]) {
            observer.unobserve(element);

            continue;
          }

          const creative = creatives[adId];

          if (!creative?.video_id) {
            observer.unobserve(element);

            continue;
          }

          videoRequested.current[adId] = true;

          setVideoLoading((prev) => ({
            ...prev,
            [adId]: true,
          }));

          try {
            const data = await getAdVideo(adId, token);

            setVideos((prev) => ({
              ...prev,
              [adId]: data.video ?? null,
            }));
          } catch (error) {
            console.error(`Failed to load video for ad ${adId}`, error);

            setVideos((prev) => ({
              ...prev,
              [adId]: null,
            }));
          } finally {
            setVideoLoading((prev) => ({
              ...prev,
              [adId]: false,
            }));
          }

          observer.unobserve(element);
        }
      },
      {
        rootMargin: "300px 0px",
        threshold: 0.01,
      }
    );

    ads.forEach((ad) => {
      const creative = creatives[ad.id];

      if (!creative?.video_id) {
        return;
      }

      const element = videoRefs.current[ad.id];

      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [ads, creatives, token]);

  /*
   * Toggle one ad.
   */
  const toggleAdSelection = (adId: number) => {
    setSelectedAdIds((previous) => {
      const next = new Set(previous);

      if (next.has(adId)) {
        next.delete(adId);
      } else {
        next.add(adId);
      }

      return next;
    });
  };

  /*
   * Select / deselect all currently visible ads.
   */
  const toggleSelectAll = () => {
    setSelectedAdIds((previous) => {
      if (previous.size === ads.length) {
        return new Set();
      }

      return new Set(ads.map((ad) => ad.id));
    });
  };

  const allSelected = ads.length > 0 && selectedAdIds.size === ads.length;

  const someSelected =
    selectedAdIds.size > 0 && selectedAdIds.size < ads.length;

  if (!selectedAdSet) {
    return null;
  }

  return (
    <section className="mt-10">
      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1c1e21]">
            Ads
          </h2>

          {selectedAdIds.size > 0 && (
            <p className="mt-1 text-xs text-[#65676b]">
              {selectedAdIds.size} {selectedAdIds.size === 1 ? "ad" : "ads"}{" "}
              selected
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#f5f6f7] px-3 py-1.5 text-xs font-medium tabular-nums text-[#65676b] ring-1 ring-[#e4e6eb]">
            {ads.length} {ads.length === 1 ? "ad" : "ads"}
          </span>

          {selectedAdIds.size > 0 && (
            <span className="rounded-full bg-[#e8f1ff] px-3 py-1.5 text-xs font-semibold tabular-nums text-[#1565c0] ring-1 ring-[#c9dcff]">
              {selectedAdIds.size} selected
            </span>
          )}

          <button
            type="button"
            onClick={() => onSync(selectedAdSet.id)}
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
                <span aria-hidden="true" className="text-sm">
                  ↻
                </span>
                Sync Ads
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            aria-expanded={!isCollapsed}
            aria-controls="ads-panel"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#65676b] transition hover:bg-[#f0f2f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1565c0] focus-visible:ring-offset-2"
          >
            <span
              aria-hidden="true"
              className={`inline-block text-sm transition-transform duration-200 ${
                isCollapsed ? "-rotate-90" : "rotate-0"
              }`}
            >
              ▾
            </span>

            <span className="sr-only">
              {isCollapsed ? "Expand ads" : "Collapse ads"}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* CONTENT */}
      {/* ========================================================= */}

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
            <div className="rounded-xl border border-[#e4e6eb] bg-white p-2.5 shadow-sm">
              {/* Select all / selection controls */}
              <div className="mb-2 flex items-center justify-between px-1.5">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-[#65676b] transition hover:bg-[#f5f6f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1565c0]"
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] font-bold transition-colors ${
                      allSelected
                        ? "border-[#1565c0] bg-[#1565c0] text-white"
                        : someSelected
                        ? "border-[#1565c0] bg-[#e8f1ff] text-[#1565c0]"
                        : "border-[#c8ccd0] bg-white text-transparent"
                    }`}
                  >
                    {allSelected ? "✓" : someSelected ? "−" : ""}
                  </span>

                  {allSelected ? "Deselect all" : "Select all"}
                </button>

                {selectedAdIds.size > 0 && (
                  <span className="rounded-full bg-[#e8f1ff] px-2.5 py-1 text-[10px] font-semibold text-[#1565c0] ring-1 ring-[#c9dcff]">
                    {selectedAdIds.size} selected
                  </span>
                )}
              </div>

              {/* Ad filter strip */}
              <div className="flex gap-2 pb-0.5 overflow-auto scrollbar-thin">
                {ads.map((ad) => {
                  const creative = creatives[ad.id];

                  const isLoadingCreative = creativeLoading[ad.id];

                  const isVideo = Boolean(creative?.video_id);

                  const video = videos[ad.id];

                  const isLoadingVideo = videoLoading[ad.id];

                  const videoPicture = video?.picture || null;

                  const imageUrl = isVideo
                    ? videoPicture ||
                      creative?.thumbnail_url ||
                      creative?.image_url ||
                      null
                    : creative?.image_url || creative?.thumbnail_url || null;

                  const selected = selectedAdIds.has(ad.id);

                  return (
                    <div
                      key={ad.id}
                      className={`group relative min-w-[190px] shrink-0 flex-col rounded-lg border p-3 transition-all duration-150 ${
                        selected
                          ? "border-[#b9d5ff] bg-[#f5f9ff] shadow-sm"
                          : "border-transparent bg-[#f8f9fa] hover:border-[#e4e6eb] hover:bg-white hover:shadow-sm"
                      }`}
                    >
                      {/* Top row */}
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleAdSelection(ad.id)}
                          aria-label={
                            selected
                              ? `Deselect ${ad.name || "ad"}`
                              : `Select ${ad.name || "ad"}`
                          }
                          aria-pressed={selected}
                          className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1565c0] focus-visible:ring-offset-1"
                        >
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] font-bold transition-colors ${
                              selected
                                ? "border-[#1565c0] bg-[#1565c0] text-white"
                                : "border-[#c8ccd0] bg-white text-transparent group-hover:border-[#a8adb3]"
                            }`}
                          >
                            {selected ? "✓" : ""}
                          </span>
                        </button>

                        {/* Creative preview */}
                        <button
                          type="button"
                          onClick={() => onSelectAd(ad)}
                          className="relative flex h-14 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#e9ecef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1565c0] focus-visible:ring-offset-1"
                        >
                          <div
                            ref={(element) => {
                              if (isVideo) {
                                videoRefs.current[ad.id] = element;
                              }
                            }}
                            data-ad-id={isVideo ? ad.id : undefined}
                            className="absolute inset-0"
                          >
                            {isLoadingCreative ? (
                              <div className="flex h-full w-full items-center justify-center">
                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#dadde1] border-t-[#1877F2]" />
                              </div>
                            ) : imageUrl ? (
                              <>
                                <img
                                  src={imageUrl}
                                  alt={
                                    creative?.title || ad.name || "Ad creative"
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
                              <div className="flex h-full w-full items-center justify-center">
                                <span className="text-lg text-[#8a8d91]">
                                  {isVideo ? "▶" : "▣"}
                                </span>
                              </div>
                            )}
                          </div>
                        </button>

                        {/* Ad name */}
                        <div className="min-w-0 flex-1">
                          <button
                            type="button"
                            onClick={() => onSelectAd(ad)}
                            className="block w-full text-left focus-visible:outline-none"
                          >
                            <div className="flex items-start gap-2">
                              <h3
                                className={`truncate text-sm font-semibold ${
                                  selected ? "text-[#1565c0]" : "text-[#1c1e21]"
                                }`}
                              >
                                {ad.name || "Unnamed ad"}
                              </h3>

                              {selected && (
                                <span
                                  aria-hidden="true"
                                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#1877F2] text-[9px] font-bold text-white"
                                >
                                  ✓
                                </span>
                              )}
                            </div>

                            <div className="mt-1">
                              <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold ${getStatusClass(
                                  ad.status
                                )}`}
                              >
                                {ad.status || "Unknown"}
                              </span>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Creative information */}
                      <div className="mt-3 border-t border-[#e8eef5] pt-2.5">
                        {creative ? (
                          <>
                            {/* {creative.title && (
                              <p className="truncate text-xs font-semibold text-[#1c1e21]">
                                {creative.title}
                              </p>
                            )} */}

                            {/* {creative.body && (
                              <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-[#65676b]">
                                {creative.body}
                              </p>
                            )} */}

                            {/* <div className="mt-2 flex flex-wrap gap-1.5">
                              {creative.call_to_action_type && (
                                <span className="rounded-md bg-[#eef0f2] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#65676b]">
                                  {creative.call_to_action_type.replace(
                                    /_/g,
                                    " "
                                  )}
                                </span>
                              )}

                              {isVideo && (
                                <span className="rounded-md bg-[#eef0f2] px-2 py-0.5 text-[9px] font-semibold text-[#65676b]">
                                  Video
                                </span>
                              )}

                              {!isVideo && creative.image_url && (
                                <span className="rounded-md bg-[#eef0f2] px-2 py-0.5 text-[9px] font-semibold text-[#65676b]">
                                  Image
                                </span>
                              )}
                            </div> */}
                          </>
                        ) : (
                          <span className="text-[10px] text-[#8a8d91]">
                            No creative information
                          </span>
                        )}
                      </div>

                      {/* View insights */}
                      <button
                        type="button"
                        onClick={() => onSelectAd(ad)}
                        className="mt-3 flex w-full items-center justify-between border-t border-[#e8eef5] pt-2.5 text-xs font-medium text-[#1877F2] transition hover:text-[#1565c0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1565c0] focus-visible:ring-offset-1"
                      >
                        <span className="text-[#65676b]">Ad insights</span>

                        <span>View insights →</span>
                      </button>
                    </div>
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

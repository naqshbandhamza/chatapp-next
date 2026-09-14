import { useState } from "react";

import type {
    AdSet,
    Campaign,
} from "@/types/meta.types";

import { LoadingBox } from "./LoadingBox";
import { EmptyState } from "./EmptyState";

type AdSetsSectionProps = {
    selectedCampaign: Campaign | null;
    adSets: AdSet[];
    loading: boolean;
    selectedAdSet: AdSet | null;
    getStatusClass: (status: string | null) => string;
    onSelectAdSet: (adSet: AdSet) => void;
    onSync: (campaignId: number) => void;
    syncing: boolean;
};

export default function AdSetsSection({
    selectedCampaign,
    adSets,
    loading,
    selectedAdSet,
    getStatusClass,
    onSelectAdSet,
    onSync,
    syncing,
}: AdSetsSectionProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    if (!selectedCampaign) {
        return null;
    }

    return (
        <section className="mt-10">
            {/* Header */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-[#1c1e21]">
                        Ad Sets
                    </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#f5f6f7] px-3 py-1.5 text-xs font-medium tabular-nums text-[#65676b] ring-1 ring-[#e4e6eb]">
                        {adSets.length}{" "}
                        {adSets.length === 1 ? "ad set" : "ad sets"}
                    </span>

                    <button
                        type="button"
                        onClick={() => onSync(selectedCampaign.id)}
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
                                Sync Ad Sets
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setIsCollapsed((prev) => !prev)
                        }
                        aria-expanded={!isCollapsed}
                        aria-controls="ad-sets-panel"
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
                                ? "Expand ad sets"
                                : "Collapse ad sets"}
                        </span>
                    </button>
                </div>
            </div>

            {!isCollapsed && (
                <div id="ad-sets-panel">
                    {loading ? (
                        <LoadingBox text="Loading ad sets..." />
                    ) : adSets.length === 0 ? (
                        <EmptyState text="No ad sets found for this campaign." />
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-[#e4e6eb] bg-white">
                            {/* Desktop table header */}
                            <div className="hidden border-b border-[#e4e6eb] bg-[#f8f9fa] px-4 py-2.5 sm:grid sm:grid-cols-[minmax(220px,2fr)_140px_130px] sm:items-center sm:gap-4">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8d91]">
                                    Ad Set
                                </span>

                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8d91]">
                                    Status
                                </span>

                                <span className="text-right text-[10px] font-semibold uppercase tracking-wider text-[#8a8d91]">
                                    Action
                                </span>
                            </div>

                            {/* Ad Set rows */}
                            <div className="divide-y divide-[#eef0f2]">
                                {adSets.map((adSet) => {
                                    const selected =
                                        selectedAdSet?.id === adSet.id;

                                    return (
                                        <button
                                            key={adSet.id}
                                            type="button"
                                            onClick={() =>
                                                onSelectAdSet(adSet)
                                            }
                                            className={`group grid w-full gap-3 p-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1565c0] motion-reduce:transition-none sm:grid-cols-[minmax(220px,2fr)_140px_130px] sm:items-center sm:gap-4 sm:px-4 sm:py-3 ${
                                                selected
                                                    ? "bg-[#f5f9ff]"
                                                    : "bg-white hover:bg-[#f8f9fa]"
                                            }`}
                                        >
                                            {/* Ad Set */}
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div
                                                    aria-hidden="true"
                                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                                                        selected
                                                            ? "bg-orange-50 text-orange-600"
                                                            : "bg-[#f0f2f5] text-[#65676b]"
                                                    }`}
                                                >
                                                    ◫
                                                </div>

                                                <div className="min-w-0">
                                                    <h3 className="truncate text-sm font-semibold text-[#1c1e21]">
                                                        {adSet.name ||
                                                            "Unnamed ad set"}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Status */}
                                            <div className="flex items-center">
                                                <span
                                                    className={`inline-flex shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${getStatusClass(
                                                        adSet.status,
                                                    )}`}
                                                >
                                                    {adSet.status ||
                                                        "Unknown"}
                                                </span>
                                            </div>

                                            {/* Action */}
                                            <div className="col-span-1 flex items-center justify-between border-t border-[#eef0f2] pt-2.5 sm:justify-end sm:border-0 sm:pt-0">
                                                <span className="text-xs font-medium text-[#65676b] sm:hidden">
                                                    View ads
                                                </span>

                                                <span
                                                    aria-hidden="true"
                                                    className="text-sm font-medium text-[#1877F2] transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
                                                >
                                                    <span className="hidden sm:inline">
                                                        View ads&nbsp;
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


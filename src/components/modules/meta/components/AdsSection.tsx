import type {
    Ad,
    AdSet,
} from "@/types/meta.types";

import { SectionHeader } from "./SectionHeader";
import { LoadingBox } from "./LoadingBox";
import { EmptyState } from "./EmptyState";

type AdsSectionProps = {
    selectedAdSet: AdSet | null;
    ads: Ad[];
    loading: boolean;
    getStatusClass :(status: string | null) => string;
    onSelectAd: (ad: Ad) => void;
};

export default function AdsSection({
    selectedAdSet,
    ads,
    loading,
    getStatusClass,
    onSelectAd,
}: AdsSectionProps) {
    if (!selectedAdSet) {
        return null;
    }

    return (
        <section className="mt-10 pb-10">
            <SectionHeader
                eyebrow="Level 4"
                title="Ads"
                count={ads.length}
                loading={loading}
            />

            {loading ? (
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
                                onClick={() => onSelectAd(ad)}
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
    );
}
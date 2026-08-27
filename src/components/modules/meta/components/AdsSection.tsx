// import type {
//     Ad,
//     AdSet,
// } from "@/types/meta.types";

// import { SectionHeader } from "./SectionHeader";
// import { LoadingBox } from "./LoadingBox";
// import { EmptyState } from "./EmptyState";

// type AdsSectionProps = {
//     selectedAdSet: AdSet | null;
//     ads: Ad[];
//     loading: boolean;
//     getStatusClass :(status: string | null) => string;
//     onSelectAd: (ad: Ad) => void;
// };

// export default function AdsSection({
//     selectedAdSet,
//     ads,
//     loading,
//     getStatusClass,
//     onSelectAd,
// }: AdsSectionProps) {
//     if (!selectedAdSet) {
//         return null;
//     }

//     return (
//         <section className="mt-10 pb-10">
//             <SectionHeader
//                 eyebrow="Level 4"
//                 title="Ads"
//                 count={ads.length}
//                 loading={loading}
//             />

//             {loading ? (
//                 <LoadingBox text="Loading ads..." />
//             ) : ads.length === 0 ? (
//                 <EmptyState text="No ads found for this ad set." />
//             ) : (
//                 <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//                     {ads.map((ad) => (
//                         <div
//                             key={ad.id}
//                             className="rounded-2xl border border-[#dadde1] bg-white p-5 shadow-sm transition hover:shadow-md"
//                         >
//                             <div className="flex items-start justify-between gap-3">
//                                             <div className="flex min-w-0 items-center gap-3">
//                                                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
//                                                     ▣
//                                                 </div>

//                                                 <div className="min-w-0">
//                                                     <h3 className="truncate font-semibold text-[#1c1e21]">
//                                                         {ad.name ||
//                                                             "Unnamed ad"}
//                                                     </h3>

//                                                     <p className="mt-1 truncate text-xs text-[#8a8d91]">
//                                                         {ad.meta_id}
//                                                     </p>
//                                                 </div>
//                                             </div>

//                                             <span
//                                                 className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClass(
//                                                     ad.status,
//                                                 )}`}
//                                             >
//                                                 {ad.status || "Unknown"}
//                                             </span>
//                                         </div>

//                             <button
//                                 type="button"
//                                 onClick={() => onSelectAd(ad)}
//                                 className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1c1e21] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
//                             >
//                                 View insights
//                                 <span>→</span>
//                             </button>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </section>
//     );
// }


import type {
    Ad,
    AdSet,
} from "@/types/meta.types";

import { LoadingBox } from "./LoadingBox";
import { EmptyState } from "./EmptyState";

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
                        {ads.length === 1 ? "ad" : "ads"}
                    </span>

                    <button
                        type="button"
                        onClick={() => onSync(selectedAdSet.id)}
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
                                <span className="text-sm">↻</span>
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
                                            {ad.name || "Unnamed ad"}
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
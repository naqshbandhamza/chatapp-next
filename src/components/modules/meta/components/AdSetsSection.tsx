// import type {
//     AdSet,
//     Campaign,
// } from "@/types/meta.types";

// import { SectionHeader } from "./SectionHeader";
// import { LoadingBox } from "./LoadingBox";
// import { EmptyState } from "./EmptyState";

// type AdSetsSectionProps = {
//     selectedCampaign: Campaign | null;
//     adSets: AdSet[];
//     loading: boolean;
//     selectedAdSet: AdSet | null;
//     getStatusClass :(status: string | null) => string;
//     onSelectAdSet: (adSet: AdSet) => void;
// };

// export default function AdSetsSection({
//     selectedCampaign,
//     adSets,
//     loading,
//     selectedAdSet,
//     getStatusClass,
//     onSelectAdSet,
// }: AdSetsSectionProps) {
//     if (!selectedCampaign) {
//         return null;
//     }

//     return (
//         <section className="mt-10">
//             <SectionHeader
//                 eyebrow="Level 3"
//                 title="Ad Sets"
//                 count={adSets.length}
//                 loading={loading}
//             />

//             {loading ? (
//                 <LoadingBox text="Loading ad sets..." />
//             ) : adSets.length === 0 ? (
//                 <EmptyState text="No ad sets found for this campaign." />
//             ) : (
//                 <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//                     {adSets.map((adSet) => {
//                         const selected =
//                             selectedAdSet?.id === adSet.id;

//                         return (
//                             <button
//                                 key={adSet.id}
//                                 type="button"
//                                 onClick={() => onSelectAdSet(adSet)}
//                                 className={`group text-left rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${selected
//                                         ? "border-[#1877F2] ring-2 ring-[#1877F2]/10"
//                                         : "border-[#dadde1]"
//                                     }`}
//                             >
//                                 <div className="flex items-start justify-between gap-3">
//                                     <div className="flex min-w-0 items-center gap-3">
//                                         <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
//                                             ◫
//                                         </div>

//                                         <div className="min-w-0">
//                                             <h3 className="truncate font-semibold text-[#1c1e21]">
//                                                 {adSet.name ||
//                                                     "Unnamed ad set"}
//                                             </h3>

//                                             <p className="mt-1 truncate text-xs text-[#8a8d91]">
//                                                 {adSet.meta_id}
//                                             </p>
//                                         </div>
//                                     </div>

//                                     <span
//                                         className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClass(
//                                             adSet.status,
//                                         )}`}
//                                     >
//                                         {adSet.status || "Unknown"}
//                                     </span>
//                                 </div>

//                                 <div className="mt-5 flex items-center justify-between border-t border-[#f0f1f2] pt-4">
//                                     <span className="text-xs text-[#8a8d91]">
//                                         View ads
//                                     </span>

//                                     <span className="text-[#1877F2] transition-transform group-hover:translate-x-1">
//                                         →
//                                     </span>
//                                 </div>
//                             </button>
//                         );
//                     })}
//                 </div>
//             )}
//         </section>
//     );
// }

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
    if (!selectedCampaign) {
        return null;
    }

    return (
        <section className="mt-10">
            <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#8a8d91]">
                        Level 3
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-[#1c1e21]">
                        Ad Sets
                    </h2>
                </div>

                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#65676b] ring-1 ring-[#dadde1]">
                        {adSets.length}{" "}
                        {adSets.length === 1 ? "ad set" : "ad sets"}
                    </span>

                    <button
                        type="button"
                        onClick={() => onSync(selectedCampaign.id)}
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
                                Sync Ad Sets
                            </>
                        )}
                    </button>
                </div>
            </div>

            {loading ? (
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
                                onClick={() => onSelectAdSet(adSet)}
                                className={`group rounded-2xl border bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                                    selected
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
    );
}
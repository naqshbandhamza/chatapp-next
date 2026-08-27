// import type { Ad } from "@/types/meta.types";
// import { DateInput } from "./DateInput";

// type InsightsHeaderProps = {
//     selectedAd: Ad;
//     dateStart: string;
//     dateEnd: string;
//     loading: boolean;
//     onDateStartChange: (value: string) => void;
//     onDateEndChange: (value: string) => void;
//     onApplyDateRange: () => void;
// };

// export default function InsightsHeader({
//     selectedAd,
//     dateStart,
//     dateEnd,
//     loading,
//     onDateStartChange,
//     onDateEndChange,
//     onApplyDateRange,
// }: InsightsHeaderProps) {
//     const today = new Date()
//         .toISOString()
//         .split("T")[0];

//     return (
//         <div className="mb-6">
//             <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
//                 <div className="min-w-0">
//                     <div className="flex items-center gap-2">
//                         <span className="h-2 w-2 rounded-full bg-[#1877F2]" />

//                         <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8a8d91]">
//                             Performance Analytics
//                         </p>
//                     </div>

//                     <h2 className="mt-2 truncate text-2xl font-bold tracking-tight text-[#1c1e21]">
//                         {selectedAd.name || "Unnamed ad"}
//                     </h2>

//                     <p className="mt-1 text-sm text-[#65676b]">
//                         Detailed performance metrics and trends
//                     </p>
//                 </div>

//                 <div className="rounded-2xl border border-[#dadde1] bg-white p-3 shadow-sm">
//                     <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
//                         <DateInput
//                             label="Start date"
//                             value={dateStart}
//                             max={dateEnd}
//                             onChange={onDateStartChange}
//                         />

//                         <div className="hidden h-10 items-center px-1 text-[#8a8d91] sm:flex">
//                             →
//                         </div>

//                         <DateInput
//                             label="End date"
//                             value={dateEnd}
//                             min={dateStart}
//                             max={today}
//                             onChange={onDateEndChange}
//                         />

//                         <button
//                             type="button"
//                             onClick={onApplyDateRange}
//                             disabled={
//                                 loading ||
//                                 !dateStart ||
//                                 !dateEnd ||
//                                 dateStart > dateEnd
//                             }
//                             className="
//                                 h-10
//                                 rounded-lg
//                                 bg-[#1c1e21]
//                                 px-5
//                                 text-sm
//                                 font-semibold
//                                 text-white
//                                 transition
//                                 hover:bg-black
//                                 disabled:cursor-not-allowed
//                                 disabled:opacity-50
//                             "
//                         >
//                             {loading ? "Loading..." : "Apply"}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


import type { Ad } from "@/types/meta.types";
import { DateInput } from "./DateInput";

type InsightsHeaderProps = {
    selectedAd: Ad;
    dateStart: string;
    dateEnd: string;
    loading: boolean;
    syncing: boolean;
    onDateStartChange: (value: string) => void;
    onDateEndChange: (value: string) => void;
    onApplyDateRange: () => void;
    onSync: (adId: number, dateStart: string, dateEnd: string) => void;
};

export default function InsightsHeader({
    selectedAd,
    dateStart,
    dateEnd,
    loading,
    syncing,
    onDateStartChange,
    onDateEndChange,
    onApplyDateRange,
    onSync,
}: InsightsHeaderProps) {
    const today = new Date().toISOString().split("T")[0];

    const canSync =
        !syncing &&
        !loading &&
        !!dateStart &&
        !!dateEnd &&
        dateStart <= dateEnd;

    return (
        <div className="mb-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                {/* ========================================================= */}
                {/* HEADER */}
                {/* ========================================================= */}

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

                {/* ========================================================= */}
                {/* CONTROLS */}
                {/* ========================================================= */}

                <div className="rounded-2xl border border-[#dadde1] bg-white p-3 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <DateInput
                            label="Start date"
                            value={dateStart}
                            max={dateEnd}
                            onChange={onDateStartChange}
                        />

                        <div className="hidden h-10 items-center px-1 text-[#8a8d91] sm:flex">
                            →
                        </div>

                        <DateInput
                            label="End date"
                            value={dateEnd}
                            min={dateStart}
                            max={today}
                            onChange={onDateEndChange}
                        />

                        {/* APPLY */}
                        <button
                            type="button"
                            onClick={onApplyDateRange}
                            disabled={
                                loading ||
                                syncing ||
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
                            {loading ? "Loading..." : "Apply"}
                        </button>

                        {/* SYNC */}
                        <button
                            type="button"
                            onClick={() =>
                                onSync(
                                    selectedAd.id,
                                    dateStart,
                                    dateEnd,
                                )
                            }
                            disabled={!canSync}
                            className="
                                inline-flex
                                h-10
                                items-center
                                justify-center
                                gap-2
                                rounded-lg
                                border
                                border-[#1877F2]
                                bg-[#eaf2ff]
                                px-5
                                text-sm
                                font-semibold
                                text-[#1877F2]
                                transition
                                hover:bg-[#dceaff]
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {syncing ? (
                                <>
                                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#1877F2]/30 border-t-[#1877F2]" />
                                    Syncing...
                                </>
                            ) : (
                                <>
                                    <span className="text-base">↻</span>
                                    Sync Insights
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
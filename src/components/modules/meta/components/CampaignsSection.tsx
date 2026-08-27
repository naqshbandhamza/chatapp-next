// import type { Campaign, AdAccount } from "@/types/meta.types";
// import { SectionHeader } from "./SectionHeader";
// import { EmptyState } from "./EmptyState";
// import { LoadingBox } from "./LoadingBox";

// type CampaignsSectionProps = {
//     selectedAccount: AdAccount | null;
//     campaigns: Campaign[];
//     loading: boolean;
//     selectedCampaign: Campaign | null;
//     getStatusClass :(status: string | null) => string;
//     onSelectCampaign: (campaign: Campaign) => void;
// };

// export default function CampaignsSection({
//     selectedAccount,
//     campaigns,
//     loading,
//     selectedCampaign,
//     getStatusClass,
//     onSelectCampaign,
// }: CampaignsSectionProps) {
//     if (!selectedAccount) {
//         return null;
//     }

//     return (
//         <section className="mt-10">
//             <SectionHeader
//                 eyebrow="Level 2"
//                 title="Campaigns"
//                 count={campaigns.length}
//                 loading={loading}
//             />

//             {loading ? (
//                 <LoadingBox text="Loading campaigns..." />
//             ) : campaigns.length === 0 ? (
//                 <EmptyState text="No campaigns found for this ad account." />
//             ) : (
//                 <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//                     {campaigns.map((campaign) => {
//                         const selected =
//                             selectedCampaign?.id === campaign.id;

//                         return (
//                             <button
//                                 key={campaign.id}
//                                 type="button"
//                                 onClick={() =>
//                                     onSelectCampaign(campaign)
//                                 }
//                                 className={`group text-left rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
//                                     selected
//                                         ? "border-[#1877F2] ring-2 ring-[#1877F2]/10"
//                                         : "border-[#dadde1]"
//                                 }`}
//                             >
//                                 <div className="flex items-start justify-between gap-3">
//                                                 <div className="flex min-w-0 items-center gap-3">
//                                                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
//                                                         ◈
//                                                     </div>

//                                                     <div className="min-w-0">
//                                                         <h3 className="truncate font-semibold text-[#1c1e21]">
//                                                             {campaign.name ||
//                                                                 "Unnamed campaign"}
//                                                         </h3>

//                                                         <p className="mt-1 truncate text-xs text-[#8a8d91]">
//                                                             {campaign.meta_id}
//                                                         </p>
//                                                     </div>
//                                                 </div>

//                                                 <span
//                                                     className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClass(
//                                                         campaign.status,
//                                                     )}`}
//                                                 >
//                                                     {campaign.status ||
//                                                         "Unknown"}
//                                                 </span>
//                                             </div>

//                                             <div className="mt-5 flex items-center justify-between border-t border-[#f0f1f2] pt-4">
//                                                 <span className="text-xs text-[#8a8d91]">
//                                                     View ad sets
//                                                 </span>

//                                                 <span className="text-[#1877F2] transition-transform group-hover:translate-x-1">
//                                                     →
//                                                 </span>
//                                             </div>
//                             </button>
//                         );
//                     })}
//                 </div>
//             )}
//         </section>
//     );
// }


import type { Campaign, AdAccount } from "@/types/meta.types";
import { EmptyState } from "./EmptyState";
import { LoadingBox } from "./LoadingBox";

type CampaignsSectionProps = {
    selectedAccount: AdAccount | null;
    campaigns: Campaign[];
    loading: boolean;
    selectedCampaign: Campaign | null;
    getStatusClass: (status: string | null) => string;
    onSelectCampaign: (campaign: Campaign) => void;
    onSync: (accountId: number) => void;
    syncing: boolean;
};

export default function CampaignsSection({
    selectedAccount,
    campaigns,
    loading,
    selectedCampaign,
    getStatusClass,
    onSelectCampaign,
    onSync,
    syncing,
}: CampaignsSectionProps) {
    if (!selectedAccount) {
        return null;
    }

    return (
        <section className="mt-10">
            <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#8a8d91]">
                        Level 2
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-[#1c1e21]">
                        Campaigns
                    </h2>
                </div>

                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#65676b] ring-1 ring-[#dadde1]">
                        {campaigns.length}{" "}
                        {campaigns.length === 1 ? "campaign" : "campaigns"}
                    </span>

                    <button
                        type="button"
                        onClick={() => onSync(selectedAccount.id)}
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
                                Sync Campaigns
                            </>
                        )}
                    </button>
                </div>
            </div>

            {loading ? (
                <LoadingBox text="Loading campaigns..." />
            ) : campaigns.length === 0 ? (
                <EmptyState text="No campaigns found for this ad account." />
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {campaigns.map((campaign) => {
                        const selected =
                            selectedCampaign?.id === campaign.id;

                        return (
                            <button
                                key={campaign.id}
                                type="button"
                                onClick={() =>
                                    onSelectCampaign(campaign)
                                }
                                className={`group rounded-2xl border bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                                    selected
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
                                                {campaign.meta_id}
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClass(
                                            campaign.status,
                                        )}`}
                                    >
                                        {campaign.status || "Unknown"}
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
                    })}
                </div>
            )}
        </section>
    );
}
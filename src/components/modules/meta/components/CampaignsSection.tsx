import type { Campaign, AdAccount } from "@/types/meta.types";
import { SectionHeader } from "./SectionHeader";
import { EmptyState } from "./EmptyState";
import { LoadingBox } from "./LoadingBox";

type CampaignsSectionProps = {
    selectedAccount: AdAccount | null;
    campaigns: Campaign[];
    loading: boolean;
    selectedCampaign: Campaign | null;
    getStatusClass :(status: string | null) => string;
    onSelectCampaign: (campaign: Campaign) => void;
};

export default function CampaignsSection({
    selectedAccount,
    campaigns,
    loading,
    selectedCampaign,
    getStatusClass,
    onSelectCampaign,
}: CampaignsSectionProps) {
    if (!selectedAccount) {
        return null;
    }

    return (
        <section className="mt-10">
            <SectionHeader
                eyebrow="Level 2"
                title="Campaigns"
                count={campaigns.length}
                loading={loading}
            />

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
                                className={`group text-left rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
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
                                                    {campaign.status ||
                                                        "Unknown"}
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
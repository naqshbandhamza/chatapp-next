import type {
    AdAccount,
    Campaign,
    AdSet,
} from "@/types/meta.types";

type MetaBreadcrumbProps = {
    selectedAccount: AdAccount | null;
    selectedCampaign: Campaign | null;
    selectedAdSet: AdSet | null;
};

export default function MetaBreadcrumb({
    selectedAccount,
    selectedCampaign,
    selectedAdSet,
}: MetaBreadcrumbProps) {
    if (!selectedAccount && !selectedCampaign && !selectedAdSet) {
        return null;
    }

    return (
        <div className="mb-6 overflow-x-auto">
            <div className="flex min-w-max items-center gap-2 rounded-xl border border-[#dadde1] bg-white px-4 py-3 shadow-sm">
                <span className="text-xs font-medium uppercase tracking-wide text-[#8a8d91]">
                    Viewing
                </span>

                {selectedAccount && (
                    <>
                        <span className="text-[#c7c9cc]">/</span>

                        <span className="max-w-[180px] truncate text-sm font-semibold text-[#1c1e21]">
                            {selectedAccount.name || "Ad Account"}
                        </span>
                    </>
                )}

                {selectedCampaign && (
                    <>
                        <span className="text-[#c7c9cc]">/</span>

                        <span className="max-w-[180px] truncate text-sm font-semibold text-[#1c1e21]">
                            {selectedCampaign.name || "Campaign"}
                        </span>
                    </>
                )}

                {selectedAdSet && (
                    <>
                        <span className="text-[#c7c9cc]">/</span>

                        <span className="max-w-[180px] truncate text-sm font-semibold text-[#1c1e21]">
                            {selectedAdSet.name || "Ad Set"}
                        </span>
                    </>
                )}
            </div>
        </div>
    );
}
import type { Campaign, AdAccount } from "@/types/meta.types";
import { EmptyState } from "./EmptyState";
import { LoadingBox } from "./LoadingBox";
import React from "react";

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

  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <section className="mt-10">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1c1e21]">
            Campaigns
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#f5f6f7] px-3 py-1.5 text-xs font-medium tabular-nums text-[#65676b] ring-1 ring-[#e4e6eb]">
            {campaigns.length}{" "}
            {campaigns.length === 1 ? "campaign" : "campaigns"}
          </span>

          <button
            type="button"
            onClick={() => onSync(selectedAccount.id)}
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
                Sync Campaigns
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            aria-expanded={!isCollapsed}
            aria-controls="campaigns-panel"
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
              {isCollapsed ? "Expand ad accounts" : "Collapse ad accounts"}
            </span>
          </button>
        </div>
      </div>

    {isCollapsed ? null : campaigns.length === 0 ? (
                
        <LoadingBox text="Loading campaigns..." />
      ) : campaigns.length === 0 ? (
        <EmptyState text="No campaigns found for this ad account." />
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#e4e6eb] bg-white">
          {/* Desktop table header */}
          <div className="hidden border-b border-[#e4e6eb] bg-[#f8f9fa] px-4 py-2.5 sm:grid sm:grid-cols-[minmax(220px,2fr)_140px_130px] sm:items-center sm:gap-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8d91]">
              Campaign
            </span>

            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8d91]">
              Status
            </span>

            <span className="text-right text-[10px] font-semibold uppercase tracking-wider text-[#8a8d91]">
              Action
            </span>
          </div>

          {/* Campaign rows */}
          <div className="divide-y divide-[#eef0f2]">
            {campaigns.map((campaign) => {
              const selected = selectedCampaign?.id === campaign.id;

              return (
                <button
                  key={campaign.id}
                  type="button"
                  onClick={() => onSelectCampaign(campaign)}
                  className={`group grid w-full gap-3 p-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1565c0] motion-reduce:transition-none sm:grid-cols-[minmax(220px,2fr)_140px_130px] sm:items-center sm:gap-4 sm:px-4 sm:py-3 ${
                    selected ? "bg-[#f5f9ff]" : "bg-white hover:bg-[#f8f9fa]"
                  }`}
                >
                  {/* Campaign */}
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      aria-hidden="true"
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                        selected
                          ? "bg-purple-50 text-purple-600"
                          : "bg-[#f0f2f5] text-[#65676b]"
                      }`}
                    >
                      ◈
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-[#1c1e21]">
                        {campaign.name || "Unnamed campaign"}
                      </h3>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center">
                    <span
                      className={`inline-flex shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${getStatusClass(
                        campaign.status
                      )}`}
                    >
                      {campaign.status || "Unknown"}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="col-span-1 flex items-center justify-between border-t border-[#eef0f2] pt-2.5 sm:justify-end sm:border-0 sm:pt-0">
                    <span className="text-xs font-medium text-[#65676b] sm:hidden">
                      View ad sets
                    </span>

                    <span
                      aria-hidden="true"
                      className="text-sm font-medium text-[#1877F2] transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
                    >
                      <span className="hidden sm:inline">
                        View ad sets&nbsp;
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
    </section>
  );
}

import type { AdAccount } from "@/types/meta.types";
import { EmptyState } from "./EmptyState";
import { InfoBox } from "./InfoBox";
import React from "react";

type AdAccountsSectionProps = {
  accounts: AdAccount[];
  selectedAccount: AdAccount | null;
  onSelectAccount: (account: AdAccount) => void;
  onSync: () => void;
  syncing: boolean;
};

export default function AdAccountsSection({
  accounts,
  selectedAccount,
  onSelectAccount,
  onSync,
  syncing,
}: AdAccountsSectionProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <section>
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1c1e21]">
            Ad Accounts
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#f5f6f7] px-3 py-1.5 text-xs font-medium tabular-nums text-[#65676b] ring-1 ring-[#e4e6eb]">
            {accounts.length}{" "}
            {accounts.length === 1 ? "account" : "accounts"}
          </span>

          <button
            type="button"
            onClick={onSync}
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
                Sync Accounts
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsCollapsed((prev) => !prev)}
            aria-expanded={!isCollapsed}
            aria-controls="ad-accounts-panel"
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
              {isCollapsed
                ? "Expand ad accounts"
                : "Collapse ad accounts"}
            </span>
          </button>
        </div>
      </div>

      <div id="ad-accounts-panel">
        {isCollapsed ? null : accounts.length === 0 ? (
          <EmptyState text="No ad accounts found." />
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#e4e6eb] bg-white">
            {/* Desktop table header */}
            <div className="hidden border-b border-[#e4e6eb] bg-[#f8f9fa] px-4 py-2.5 sm:grid sm:grid-cols-[minmax(220px,2fr)_110px_120px_minmax(160px,1.4fr)_110px] sm:items-center sm:gap-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8d91]">
                Account
              </span>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8d91]">
                Status
              </span>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8d91]">
                Currency
              </span>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8a8d91]">
                Timezone
              </span>

              <span className="text-right text-[10px] font-semibold uppercase tracking-wider text-[#8a8d91]">
                Action
              </span>
            </div>

            {/* Account rows */}
            <div className="divide-y divide-[#eef0f2]">
              {accounts.map((account) => {
                const selected =
                  selectedAccount?.id === account.id;

                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => onSelectAccount(account)}
                    aria-pressed={selected}
                    className={`group grid w-full gap-3 p-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1565c0] motion-reduce:transition-none sm:grid-cols-[minmax(220px,2fr)_110px_120px_minmax(160px,1.4fr)_110px] sm:items-center sm:gap-4 sm:px-4 sm:py-3 ${
                      selected
                        ? "bg-[#f5f9ff]"
                        : "bg-white hover:bg-[#f8f9fa]"
                    }`}
                  >
                    {/* Account */}
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        aria-hidden="true"
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                          selected
                            ? "bg-[#eaf2ff] text-[#1877F2]"
                            : "bg-[#f0f2f5] text-[#65676b]"
                        }`}
                      >
                        $
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-[#1c1e21]">
                          {account.name || "Unnamed account"}
                        </h3>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center">
                      {selected ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#eaf2ff] px-2 py-1 text-[10px] font-semibold text-[#1560c9]">
                          <span aria-hidden="true">✓</span>
                          Selected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700">
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                          />
                          Active
                        </span>
                      )}
                    </div>

                    {/* Mobile information labels */}
                    <div className="grid grid-cols-2 gap-2 sm:contents">
                      {/* Currency */}
                      <div className="min-w-0">
                        <div className="sm:hidden">
                          <InfoBox
                            label="Currency"
                            value={account.currency || "—"}
                          />
                        </div>

                        <div className="hidden sm:block">
                          <InfoBox
                            label="Currency"
                            value={account.currency || "—"}
                          />
                        </div>
                      </div>

                      {/* Timezone */}
                      <div className="min-w-0">
                        <InfoBox
                          label="Timezone"
                          value={account.timezone_name || "—"}
                        />
                      </div>
                    </div>

                    {/* Action */}
                    <div className="col-span-2 flex items-center justify-between border-t border-[#eef0f2] pt-2.5 sm:col-span-1 sm:justify-end sm:border-0 sm:pt-0">
                      <span className="text-xs font-medium text-[#65676b] sm:hidden">
                        View campaigns
                      </span>

                      <span
                        aria-hidden="true"
                        className="text-sm font-medium text-[#1877F2] transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
                      >
                        <span className="hidden sm:inline">
                          View campaigns&nbsp;
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
    </section>
  );
}

import type { AdAccount } from "@/types/meta.types";
import { EmptyState } from "./EmptyState";
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
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl font-bold tracking-tight text-[#1c1e21]">
            Ad Accounts
          </h2>

          <span className="rounded-full bg-[#f5f6f7] px-2.5 py-1 text-[11px] font-medium tabular-nums text-[#65676b] ring-1 ring-[#e4e6eb]">
            {accounts.length}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
          <div className="rounded-xl border border-[#e4e6eb] bg-white p-2.5 shadow-sm">
            {/* Account filter strip */}
            <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-thin">
              {accounts.map((account) => {
                const selected =
                  selectedAccount?.id === account.id;

                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => onSelectAccount(account)}
                    aria-pressed={selected}
                    className={`group relative flex min-w-[230px] shrink-0 items-center gap-3 rounded-lg border px-3.5 py-3 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1565c0] focus-visible:ring-offset-1 motion-reduce:transition-none ${
                      selected
                        ? "border-[#b9d5ff] bg-[#f5f9ff] shadow-sm"
                        : "border-transparent bg-[#f8f9fa] hover:border-[#e4e6eb] hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    {/* Account icon */}
                    <div
                      aria-hidden="true"
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                        selected
                          ? "bg-[#eaf2ff] text-[#1877F2]"
                          : "bg-[#e4e6eb] text-[#65676b]"
                      }`}
                    >
                      $
                    </div>

                    {/* Account details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 items-center gap-2">
                        <h3
                          className={`truncate text-sm font-semibold ${
                            selected
                              ? "text-[#1565c0]"
                              : "text-[#1c1e21]"
                          }`}
                        >
                          {account.name || "Unnamed account"}
                        </h3>

                        {selected && (
                          <span
                            aria-hidden="true"
                            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#1877F2] text-[9px] font-bold text-white"
                          >
                            ✓
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex min-w-0 items-center gap-2">
                        <span className="truncate text-[10px] font-medium text-[#8a8d91]">
                          {account.currency || "—"}
                        </span>

                        <span
                          aria-hidden="true"
                          className="h-1 w-1 shrink-0 rounded-full bg-[#c7c9cc]"
                        />

                        <span className="truncate text-[10px] text-[#8a8d91]">
                          {account.timezone_name || "—"}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="shrink-0">
                      {selected ? (
                        <span className="rounded-full bg-[#eaf2ff] px-2 py-1 text-[9px] font-semibold text-[#1560c9]">
                          Selected
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-medium text-emerald-700">
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                          />
                          Active
                        </span>
                      )}
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

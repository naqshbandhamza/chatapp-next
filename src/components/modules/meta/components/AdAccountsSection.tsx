// import type { AdAccount } from "@/types/meta.types";
// import { EmptyState } from "./EmptyState";
// import { InfoBox } from "./InfoBox";

// type AdAccountsSectionProps = {
//     accounts: AdAccount[];
//     selectedAccount: AdAccount | null;
//     onSelectAccount: (account: AdAccount) => void;
// };

// export default function AdAccountsSection({
//     accounts,
//     selectedAccount,
//     onSelectAccount,
// }: AdAccountsSectionProps) {
//     return (
//         <section>
//             <div className="mb-4 flex items-end justify-between">
//                 <div>
//                     <p className="text-xs font-semibold uppercase tracking-wider text-[#8a8d91]">
//                         Level 1
//                     </p>

//                     <h2 className="mt-1 text-xl font-bold text-[#1c1e21]">
//                         Ad Accounts
//                     </h2>
//                 </div>

//                 <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#65676b] ring-1 ring-[#dadde1]">
//                     {accounts.length}{" "}
//                     {accounts.length === 1 ? "account" : "accounts"}
//                 </span>
//             </div>

//             {accounts.length === 0 ? (
//                 <EmptyState text="No ad accounts found." />
//             ) : (
//                 <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
//                     {accounts.map((account) => {
//                         const selected =
//                             selectedAccount?.id === account.id;

//                         return (
//                             <button
//                                 key={account.id}
//                                 type="button"
//                                 onClick={() => onSelectAccount(account)}
//                                 className={`group text-left rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
//                                     selected
//                                         ? "border-[#1877F2] ring-2 ring-[#1877F2]/10"
//                                         : "border-[#dadde1]"
//                                 }`}
//                             >
//                                 <div className="flex items-start justify-between gap-4">
//                                     <div className="flex min-w-0 items-center gap-3">
//                                         <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf2ff] text-[#1877F2]">
//                                             $
//                                         </div>

//                                         <div className="min-w-0">
//                                             <h3 className="truncate font-semibold text-[#1c1e21]">
//                                                 {account.name ||
//                                                     "Unnamed account"}
//                                             </h3>

//                                             <p className="mt-1 truncate text-xs text-[#8a8d91]">
//                                                 {account.meta_id}
//                                             </p>
//                                         </div>
//                                     </div>

//                                     {selected ? (
//                                         <span className="rounded-full bg-[#eaf2ff] px-2.5 py-1 text-xs font-semibold text-[#1877F2]">
//                                             Selected
//                                         </span>
//                                     ) : (
//                                         <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
//                                             Active
//                                         </span>
//                                     )}
//                                 </div>

//                                 <div className="mt-5 grid grid-cols-2 gap-3">
//                                     <InfoBox
//                                         label="Currency"
//                                         value={account.currency || "—"}
//                                     />

//                                     <InfoBox
//                                         label="Timezone"
//                                         value={
//                                             account.timezone_name || "—"
//                                         }
//                                     />
//                                 </div>

//                                 <div className="mt-4 flex items-center justify-between border-t border-[#f0f1f2] pt-4">
//                                     <span className="text-xs text-[#8a8d91]">
//                                         View campaigns
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

import type { AdAccount } from "@/types/meta.types";
import { EmptyState } from "./EmptyState";
import { InfoBox } from "./InfoBox";

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
    return (
        <section>
            <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#8a8d91]">
                        Level 1
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-[#1c1e21]">
                        Ad Accounts
                    </h2>
                </div>

                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#65676b] ring-1 ring-[#dadde1]">
                        {accounts.length}{" "}
                        {accounts.length === 1 ? "account" : "accounts"}
                    </span>

                    <button
                        type="button"
                        onClick={onSync}
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
                                Sync Accounts
                            </>
                        )}
                    </button>
                </div>
            </div>

            {accounts.length === 0 ? (
                <EmptyState text="No ad accounts found." />
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {accounts.map((account) => {
                        const selected =
                            selectedAccount?.id === account.id;

                        return (
                            <button
                                key={account.id}
                                type="button"
                                onClick={() => onSelectAccount(account)}
                                className={`group rounded-2xl border bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                                    selected
                                        ? "border-[#1877F2] ring-2 ring-[#1877F2]/10"
                                        : "border-[#dadde1]"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf2ff] text-[#1877F2]">
                                            $
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="truncate font-semibold text-[#1c1e21]">
                                                {account.name ||
                                                    "Unnamed account"}
                                            </h3>

                                            <p className="mt-1 truncate text-xs text-[#8a8d91]">
                                                {account.meta_id}
                                            </p>
                                        </div>
                                    </div>

                                    {selected ? (
                                        <span className="rounded-full bg-[#eaf2ff] px-2.5 py-1 text-xs font-semibold text-[#1877F2]">
                                            Selected
                                        </span>
                                    ) : (
                                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                            Active
                                        </span>
                                    )}
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <InfoBox
                                        label="Currency"
                                        value={account.currency || "—"}
                                    />

                                    <InfoBox
                                        label="Timezone"
                                        value={
                                            account.timezone_name || "—"
                                        }
                                    />
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t border-[#f0f1f2] pt-4">
                                    <span className="text-xs text-[#8a8d91]">
                                        View campaigns
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
type MetaHeaderProps = {
    connected: boolean;
};

export default function MetaHeader({
    connected,
}: MetaHeaderProps) {
    return (
        <div className="mb-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1877F2] text-xl font-bold text-white">
                            f
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-[#1c1e21]">
                                Meta Ads
                            </h1>

                            <p className="text-sm text-[#65676b]">
                                Manage your advertising campaigns.
                            </p>
                        </div>
                    </div>
                </div>

                {connected && (
                    <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-2 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        Meta Connected
                    </div>
                )}
            </div>
        </div>
    );
}
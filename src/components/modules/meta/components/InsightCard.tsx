export function InsightCard({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="group rounded-2xl border border-[#dadde1] bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wide text-[#8a8d91]">
                    {label}
                </p>

                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eaf2ff] text-[#1877F2]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#1877F2]" />
                </div>
            </div>

            <p className="mt-4 text-2xl font-bold tracking-tight text-[#1c1e21]">
                {value}
            </p>
        </div>
    );
}

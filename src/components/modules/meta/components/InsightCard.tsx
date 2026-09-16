export function InsightCard({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="rounded-lg border border-[#e4e8ee] bg-[#f8fafc] px-3 py-2">
            <p className="text-[10px] font-medium uppercase tracking-wide text-[#8a8d91]"
            style={{fontSize:"10px"}}
            >
                {label}
            </p>
            <p className="mt-0.5 text-sm font-semibold tabular-nums text-[#1c1e21]">
                {value}
            </p>
        </div>
    );
}

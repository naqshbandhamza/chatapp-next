export function MiniMetric({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="rounded-xl bg-[#f7f8f9] px-3 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#8a8d91]">
                {label}
            </p>

            <p className="mt-1 text-sm font-bold text-[#1c1e21]">
                {value}
            </p>
        </div>
    );
}

export function InfoBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-xl bg-[#f7f8f9] p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#8a8d91]">
                {label}
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-[#1c1e21]">
                {value}
            </p>
        </div>
    );
}

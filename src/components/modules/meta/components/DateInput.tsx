export function DateInput({
    label,
    value,
    min,
    max,
    onChange,
}: {
    label: string;
    value: string;
    min?: string;
    max?: string;
    onChange: (value: string) => void;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-[#8a8d91]">
                {label}
            </label>

            <input
                type="date"
                value={value}
                min={min}
                max={max}
                onChange={(e) => onChange(e.target.value)}
                className="
                    h-10
                    w-full
                    rounded-lg
                    border
                    border-[#dadde1]
                    bg-white
                    px-3
                    text-sm
                    font-medium
                    text-[#1c1e21]
                    outline-none
                    transition
                    focus:border-[#1877F2]
                    focus:ring-2
                    focus:ring-[#1877F2]/10
                    sm:w-[150px]
                "
            />
        </div>
    );
}

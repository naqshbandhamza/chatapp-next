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
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-[#8a8d91]">
                {label}
            </label>

            <input
                type="date"
                value={value}
                min={min}
                max={max}
                onChange={(e) => onChange(e.target.value)}
                className="
                    h-8
                    w-full
                    rounded-md
                    border
                    border-[#dadde1]
                    bg-white
                    px-2
                    text-xs
                    font-medium
                    text-[#1c1e21]
                    outline-none
                    transition
                    focus:border-[#1877F2]
                    focus:ring-1
                    focus:ring-[#1877F2]/15
                    sm:w-[140px]
                "
            />
        </div>
    );
}

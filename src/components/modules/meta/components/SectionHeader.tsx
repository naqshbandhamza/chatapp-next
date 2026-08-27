export function SectionHeader({
    eyebrow,
    title,
    count,
    loading,
}: {
    eyebrow: string;
    title: string;
    count: number;
    loading?: boolean;
}) {
    return (
        <div className="mb-4 flex items-end justify-between">
            <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8a8d91]">
                    {eyebrow}
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#1c1e21]">
                    {title}
                </h2>
            </div>

            {!loading && (
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#65676b] ring-1 ring-[#dadde1]">
                    {count}{" "}
                    {count === 1 ? title.slice(0, -1) : title.toLowerCase()}
                </span>
            )}
        </div>
    );
}

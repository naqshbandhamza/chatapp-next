export function formatShortInsightDate(
    value: string | null | undefined,
) {
    if (!value) {
        return "—";
    }

    const normalized = value.includes("T")
        ? value.split("T")[0]
        : value;

    const match = normalized.match(
        /^(\d{4})-(\d{2})-(\d{2})$/,
    );

    if (!match) {
        return value;
    }

    const [, year, month, day] = match;

    const date = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
    );

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
    }).format(date);
}

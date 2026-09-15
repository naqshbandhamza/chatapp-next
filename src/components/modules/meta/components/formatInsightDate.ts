// export function formatInsightDate(value: string | null | undefined) {
//     if (!value) {
//         return "—";
//     }

//     // Meta normally returns YYYY-MM-DD.
//     // Also safely handle values such as YYYY-MM-DDTHH:mm:ss.
//     const normalized = value.includes("T")
//         ? value.split("T")[0]
//         : value;

//     const match = normalized.match(
//         /^(\d{4})-(\d{2})-(\d{2})$/,
//     );

//     if (!match) {
//         return value;
//     }

//     const [, year, month, day] = match;

//     const date = new Date(
//         Number(year),
//         Number(month) - 1,
//         Number(day),
//     );

//     if (Number.isNaN(date.getTime())) {
//         return value;
//     }

//     return new Intl.DateTimeFormat("en-US", {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//     }).format(date);
// }


export function formatInsightDate(
    value: string | null | undefined,
): string {

    //console.log(value)

    if (!value) {
        return "—";
    }


    // Meta normally returns YYYY-MM-DD.
    // Also safely handle ISO datetime values.
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

    const yearNumber = Number(year);
    const monthNumber = Number(month);
    const dayNumber = Number(day);

    // Validate the actual calendar date without
    // introducing any timezone conversion.
    const daysInMonth = new Date(
        Date.UTC(yearNumber, monthNumber, 0),
    ).getUTCDate();

    if (
        monthNumber < 1 ||
        monthNumber > 12 ||
        dayNumber < 1 ||
        dayNumber > daysInMonth
    ) {
        return value;
    }

    const monthName = new Intl.DateTimeFormat("en-US", {
        month: "short",
        timeZone: "UTC",
    }).format(
        new Date(Date.UTC(yearNumber, monthNumber - 1, 1)),
    );

    return `${monthName} ${dayNumber}, ${yearNumber}`;
}


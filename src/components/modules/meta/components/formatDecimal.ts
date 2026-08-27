export function formatDecimal(
    value: number | string | null | undefined,
    maximumFractionDigits = 2,
) {
    const number = Number(value) || 0;

    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits,
    }).format(number);
}

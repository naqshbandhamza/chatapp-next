export function formatNumber(value: number | string | null | undefined) {
    const number = Number(value) || 0;

    return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: 0,
    }).format(number);
}

import { Insight, InsightTotals } from "./types";
import { formatDecimal } from "./formatDecimal";
import { formatCompactNumber } from "./formatCompactNumber";
import { formatShortInsightDate } from "./formatShortInsightDate";
import { MiniMetric } from "./MiniMetric";

export function SpendEfficiencyChart({
    data,
    insightTotals
}: {
    data: Insight[];
    insightTotals: InsightTotals;
}) {
    if (!data.length) {
        return (
            <div className="flex h-[280px] items-center justify-center text-sm text-[#8a8d91]">
                No chart data available
            </div>
        );
    }

    const width = 760;
    const height = 280;

    const padding = {
        top: 20,
        right: 20,
        bottom: 42,
        left: 52,
    };

    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    const maxSpend = Math.max(
        ...data.map((item) => Number(item.spend) || 0),
        1,
    );

    const maxCtr = Math.max(
        ...data.map((item) => Number(item.ctr) || 0),
        1,
    );

    const getX = (index: number) => {
        if (data.length === 1) {
            return padding.left + innerWidth / 2;
        }

        return (
            padding.left +
            (index / (data.length - 1)) * innerWidth
        );
    };

    const getSpendY = (value: number) => {
        return (
            padding.top +
            innerHeight -
            (value / maxSpend) * innerHeight
        );
    };

    const getCtrY = (value: number) => {
        return (
            padding.top +
            innerHeight -
            (value / maxCtr) * innerHeight
        );
    };

    const spendPath = data
        .map((item, index) => {
            const x = getX(index);
            const y = getSpendY(Number(item.spend) || 0);

            return `${index === 0 ? "M" : "L"} ${x} ${y}`;
        })
        .join(" ");

    const ctrPath = data
        .map((item, index) => {
            const x = getX(index);
            const y = getCtrY(Number(item.ctr) || 0);

            return `${index === 0 ? "M" : "L"} ${x} ${y}`;
        })
        .join(" ");

    return (
        <div className="w-full">
            {/* LEGEND */}
            <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2">
                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#1877F2]" />

                    <span className="text-xs font-medium text-[#65676b]">
                        Spend
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />

                    <span className="text-xs font-medium text-[#65676b]">
                        CTR
                    </span>
                </div>
            </div>

            <div className="w-full overflow-hidden">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="h-auto w-full"
                    preserveAspectRatio="none"
                >
                    {/* GRID */}
                    {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
                        const y =
                            padding.top +
                            innerHeight -
                            tick * innerHeight;

                        return (
                            <line
                                key={tick}
                                x1={padding.left}
                                x2={width - padding.right}
                                y1={y}
                                y2={y}
                                className="stroke-[#eef0f2]"
                                strokeWidth="1"
                            />
                        );
                    })}

                    {/* SPEND AXIS LABELS */}
                    {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
                        const y =
                            padding.top +
                            innerHeight -
                            tick * innerHeight;

                        return (
                            <text
                                key={`spend-${tick}`}
                                x={padding.left - 10}
                                y={y + 4}
                                textAnchor="end"
                                className="fill-[#8a8d91] text-[10px]"
                            >
                                {formatCompactNumber(
                                    maxSpend * tick,
                                )}
                            </text>
                        );
                    })}

                    {/* SPEND LINE */}
                    <path
                        d={spendPath}
                        fill="none"
                        className="stroke-[#1877F2]"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* CTR LINE */}
                    <path
                        d={ctrPath}
                        fill="none"
                        className="stroke-[#10B981]"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* DATA POINTS */}
                    {data.map((item, index) => (
                        <g key={index}>
                            <circle
                                cx={getX(index)}
                                cy={getSpendY(
                                    Number(item.spend) || 0,
                                )}
                                r="3"
                                className="fill-white stroke-[#1877F2]"
                                strokeWidth="2"
                            />

                            <circle
                                cx={getX(index)}
                                cy={getCtrY(
                                    Number(item.ctr) || 0,
                                )}
                                r="3"
                                className="fill-white stroke-[#10B981]"
                                strokeWidth="2"
                            />
                        </g>
                    ))}

                    {/* DATES */}
                    {data.map((item, index) => {
                        const maxLabels = 7;
                        const step = Math.max(
                            1,
                            Math.ceil(data.length / maxLabels),
                        );

                        if (
                            index % step !== 0 &&
                            index !== data.length - 1
                        ) {
                            return null;
                        }

                        return (
                            <text
                                key={`date-${index}`}
                                x={getX(index)}
                                y={height - 12}
                                textAnchor="middle"
                                className="fill-[#8a8d91] text-[10px]"
                            >
                                {formatShortInsightDate(
                                    item.date_start,
                                )}
                            </text>
                        );
                    })}
                </svg>
            </div>

            {/* QUICK EFFICIENCY SUMMARY */}
            <div className="mt-4 grid grid-cols-3 gap-2">
                <MiniMetric
                    label="Avg. CTR"
                    value={`${formatDecimal(
                        insightTotals.ctr,
                        2,
                    )}%`}
                />

                <MiniMetric
                    label="Avg. CPC"
                    value={formatDecimal(
                        insightTotals.cpc,
                        2,
                    )}
                />

                <MiniMetric
                    label="CPM"
                    value={formatDecimal(
                        insightTotals.cpm,
                        2,
                    )}
                />
            </div>
        </div>
    );
}

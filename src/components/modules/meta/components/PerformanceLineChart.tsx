import { Insight } from "./types";
import { formatCompactNumber } from "./formatCompactNumber";
import { formatShortInsightDate } from "./formatShortInsightDate";

export function PerformanceLineChart({
    data,
    lines,
}: {
    data: Insight[];
    lines: {
        key: string;
        label: string;
        className: string;
    }[];
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

    const values = lines.flatMap((line) =>
        data.map((item) => Number(item[line.key]) || 0),
    );

    const maxValue = Math.max(...values, 1);

    const getX = (index: number) => {
        if (data.length === 1) {
            return padding.left + innerWidth / 2;
        }

        return (
            padding.left +
            (index / (data.length - 1)) * innerWidth
        );
    };

    const getY = (value: number) => {
        return (
            padding.top +
            innerHeight -
            (value / maxValue) * innerHeight
        );
    };

    const createPath = (key: string) => {
        return data
            .map((item, index) => {
                const x = getX(index);
                const y = getY(Number(item[key]) || 0);

                return `${index === 0 ? "M" : "L"} ${x} ${y}`;
            })
            .join(" ");
    };

    const yTicks = [0, 0.25, 0.5, 0.75, 1];

    return (
        <div className="w-full">
            {/* LEGEND */}
            <div className="mb-5 flex flex-wrap gap-x-5 gap-y-2">
                {lines.map((line) => (
                    <div
                        key={line.key}
                        className="flex items-center gap-2"
                    >
                        <span
                            className={`h-2.5 w-2.5 rounded-full ${line.className
                                .replace("stroke-", "bg-")}`}
                        />

                        <span className="text-xs font-medium text-[#65676b]">
                            {line.label}
                        </span>
                    </div>
                ))}
            </div>

            <div className="w-full overflow-hidden">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="h-auto w-full"
                    preserveAspectRatio="none"
                >
                    {/* GRID */}
                    {yTicks.map((tick) => {
                        const y =
                            padding.top +
                            innerHeight -
                            tick * innerHeight;

                        return (
                            <g key={tick}>
                                <line
                                    x1={padding.left}
                                    x2={width - padding.right}
                                    y1={y}
                                    y2={y}
                                    className="stroke-[#eef0f2]"
                                    strokeWidth="1"
                                />

                                <text
                                    x={padding.left - 10}
                                    y={y + 4}
                                    textAnchor="end"
                                    className="fill-[#8a8d91] text-[10px]"
                                >
                                    {formatCompactNumber(
                                        maxValue * tick,
                                    )}
                                </text>
                            </g>
                        );
                    })}

                    {/* LINES */}
                    {lines.map((line) => (
                        <g key={line.key}>
                            <path
                                d={createPath(line.key)}
                                fill="none"
                                className={`${line.className} opacity-90`}
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            {data.map((item, index) => (
                                <circle
                                    key={`${line.key}-${index}`}
                                    cx={getX(index)}
                                    cy={getY(
                                        Number(item[line.key]) || 0,
                                    )}
                                    r="3"
                                    className={`fill-white ${line.className}`}
                                    strokeWidth="2"
                                />
                            ))}
                        </g>
                    ))}

                    {/* X AXIS */}
                    {data.map((item, index) => {
                        // Don't overcrowd the axis when there are many days.
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
                                {formatShortInsightDate(item.date_start)}
                            </text>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}

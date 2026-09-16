import { ReactNode } from "react";

export function InsightChartCard({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <div className="overflow-hidden rounded-lg border border-[#e4e8ee] bg-white">
            <div className="border-b border-[#eef1f5] px-3 py-2">
                <h3 className="text-sm font-semibold text-[#1c1e21]">{title}</h3>
                <p className="mt-0.5 text-[11px] leading-4 text-[#8a8d91]">
                    {description}
                </p>
            </div>
            <div className="p-3">{children}</div>
        </div>
    );
}

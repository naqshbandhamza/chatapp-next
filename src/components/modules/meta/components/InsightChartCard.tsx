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
        <div className="overflow-hidden rounded-2xl border border-[#dadde1] bg-white shadow-sm">
            <div className="border-b border-[#f0f1f2] px-5 py-4">
                <h3 className="text-base font-bold text-[#1c1e21]">
                    {title}
                </h3>

                <p className="mt-1 text-xs text-[#8a8d91]">
                    {description}
                </p>
            </div>

            <div className="p-5">
                {children}
            </div>
        </div>
    );
}

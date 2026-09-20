"use client";

import { useEffect } from "react";

interface AutomationAlertToastProps {
  type: "new" | "updated";
  alert: any;
  onClose: () => void;
  duration?: number;
}

export default function AutomationAlertToast({
  type,
  alert,
  onClose,
  duration = 8000,
}: AutomationAlertToastProps) {
  useEffect(() => {
    const timeout = setTimeout(onClose, duration);

    return () => clearTimeout(timeout);
  }, [onClose, duration]);

  return (
    <div className="fixed right-6 top-6 z-50 w-[380px]">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">

        <div className="flex items-start gap-3 p-4">

          {/* Icon */}

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6C5CE7]/10">
            <span className="text-lg">
              ⚡
            </span>
          </div>

          {/* Content */}

          <div className="min-w-0 flex-1">

            <div className="flex items-start justify-between gap-3">

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {type === "new"
                    ? "New automation alert"
                    : "Automation alert updated"}
                </p>

                <p className="mt-0.5 text-xs text-gray-500">
                  Creative fatigue detected
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="text-lg leading-none text-gray-400 transition hover:text-gray-600"
              >
                ×
              </button>

            </div>

            {/* Ad */}

            <p className="mt-3 truncate text-sm font-medium text-gray-900">
              {alert.ad_name}
            </p>

            {/* Campaign */}

            {alert.campaign_name && (
              <p className="mt-1 truncate text-xs text-gray-500">
                {alert.campaign_name}
              </p>
            )}

            {/* Message */}

            <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-600">
              {alert.message}
            </p>

          </div>
        </div>

        {/* Progress bar */}

        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-[#6C5CE7]"
            style={{
              animation: `automation-toast-progress ${duration}ms linear forwards`,
            }}
          />
        </div>

      </div>

      <style jsx>{`
        @keyframes automation-toast-progress {
          from {
            width: 100%;
          }

          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
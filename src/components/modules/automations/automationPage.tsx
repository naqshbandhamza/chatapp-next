"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getAutomationCampaigns } from "@/lib/queries/Automations/getAutomationCampaigns";
import { getAutomationSettings } from "@/lib/queries/Automations/getAutomationSettings";
import { updateAutomationSettings } from "@/lib/queries/Automations/updateAutomationSettings";

interface AutomationPageProps {
  alerts: any[];
}

function AutomationAlert({ alert }: { alert: any }) {
    const current = alert.metrics?.current;
    const baseline = alert.metrics?.baseline;
    const changes = alert.metrics?.changes;
    const periods = alert.metrics?.periods;

    const lastDetected = alert.last_detected_at
    ? new Date(alert.last_detected_at).toLocaleString()
    : null;
  
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-100 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              {/* <h2 className="font-semibold text-gray-900">{alert.title}</h2> */}
              <h2 className="font-semibold text-gray-900">Creatives Analysis</h2>
              <p className="mt-1 text-sm text-gray-500">
                Creative fatigue Analysis
              </p>
            </div>

            {lastDetected && (
            <div className="text-right">
              <p className="text-xs text-gray-400">Last updated</p>
              <p className="mt-0.5 text-xs font-medium text-gray-600">
                {lastDetected}
              </p>
            </div>
          )}
  
            {/* <span
              className="
                              rounded-full
                              bg-yellow-100
                              px-3
                              py-1
                              text-xs
                              font-medium
                              capitalize
                              text-yellow-700
                          "
            >
              {alert.severity}
            </span> */}
          </div>
  
          {/* Campaign hierarchy */}
          <div className="mt-5 grid grid-cols-3 gap-4">
            <Info label="Campaign" value={alert.campaign_name} />
  
            <Info label="Ad Set" value={alert.ad_set_name} />
  
            <Info label="Ad" value={alert.ad_name} />
          </div>
  
          {alert.message && (
            <p className="mt-5 text-sm text-gray-600">{alert.message}</p>
          )}
        </div>
  
        {/* Metrics */}
        {current && baseline && changes && (
          <div className="p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900">
                Performance comparison
              </h3>
  
              <p className="mt-1 text-xs text-gray-500">
                Current period compared with the previous baseline period.
              </p>
            </div>
  
            {/* Date periods */}
            <div className="mb-5 grid grid-cols-2 gap-4">
              <Period
                label="Current period"
                start={periods?.current?.start}
                end={periods?.current?.end}
              />
  
              <Period
                label="Previous period"
                start={periods?.baseline?.start}
                end={periods?.baseline?.end}
              />
            </div>
  
            {/* Comparison table */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="grid grid-cols-4 border-b border-gray-200 bg-gray-50 px-4 py-3">
                <div className="text-xs font-medium text-gray-500">Metric</div>
  
                <div className="text-right text-xs font-medium text-gray-500">
                  Previous
                </div>
  
                <div className="text-right text-xs font-medium text-gray-500">
                  Current
                </div>
  
                <div className="text-right text-xs font-medium text-gray-500">
                  Difference
                </div>
              </div>
  
              <ComparisonRow
                label="CTR"
                previous={baseline.ctr}
                current={current.ctr}
                change={changes.ctr_percent}
                suffix="%"
              />
  
              <ComparisonRow
                label="CPM"
                previous={baseline.cpm}
                current={current.cpm}
                change={changes.cpm_percent}
              />
  
              <ComparisonRow
                label="Frequency"
                previous={baseline.frequency}
                current={current.frequency}
                change={changes.frequency_percent}
              />
  
              <ComparisonRow
                label="Spend"
                previous={baseline.spend}
                current={current.spend}
                change={changes.spend_percent}
              />
  
              <ComparisonRow
                label="Impressions"
                previous={baseline.impressions}
                current={current.impressions}
              />
  
              <ComparisonRow
                label="Clicks"
                previous={baseline.clicks}
                current={current.clicks}
              />
  
              <ComparisonRow
                label="Link clicks"
                previous={baseline.link_clicks}
                current={current.link_clicks}
              />
  
              <ComparisonRow
                label="Reach"
                previous={baseline.reach}
                current={current.reach}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
  
  function ComparisonRow({
    label,
    previous,
    current,
    change,
    suffix = "",
  }: {
    label: string;
    previous?: number;
    current?: number;
    change?: number;
    suffix?: string;
  }) {
    return (
      <div
        className="
                  grid
                  grid-cols-4
                  items-center
                  border-b
                  border-gray-100
                  px-4
                  py-3
                  last:border-b-0
              "
      >
        <div className="text-sm font-medium text-gray-700">{label}</div>
  
        <div className="text-right text-sm text-gray-500">
          {formatValue(previous, suffix)}
        </div>
  
        <div className="text-right text-sm font-semibold text-gray-900">
          {formatValue(current, suffix)}
        </div>
  
        <div className="text-right">
          {change !== undefined ? (
            <ChangeValue value={change} />
          ) : (
            <span className="text-sm text-gray-400">—</span>
          )}
        </div>
      </div>
    );
  }
  
  function ChangeValue({ value }: { value: number }) {
    const positive = value > 0;
    const negative = value < 0;
  
    return (
      <span
        className={`
                  text-sm
                  font-semibold
                  ${
                    positive
                      ? "text-green-600"
                      : negative
                      ? "text-red-600"
                      : "text-gray-500"
                  }
              `}
      >
        {positive ? "+" : ""}
        {value.toFixed(1)}%
      </span>
    );
  }
  
  function Period({
    label,
    start,
    end,
  }: {
    label: string;
    start?: string;
    end?: string;
  }) {
    return (
      <div className="rounded-lg bg-gray-50 p-3">
        <p className="text-xs font-medium text-gray-500">{label}</p>
  
        <p className="mt-1 text-sm font-semibold text-gray-900">
          {formatDate(start)}
          {" → "}
          {formatDate(end)}
        </p>
      </div>
    );
  }
  
  function Info({ label, value }: { label: string; value?: string }) {
    return (
      <div>
        <p className="text-xs text-gray-500">{label}</p>
  
        <p className="mt-1 text-sm font-medium text-gray-900">{value || "—"}</p>
      </div>
    );
  }
  
  function formatValue(value?: number, suffix = "") {
    if (value === undefined || value === null) {
      return "—";
    }
  
    if (typeof value !== "number") {
      return value;
    }
  
    return `${value.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })}${suffix}`;
  }
  
  function formatDate(value?: string) {
    if (!value) {
      return "—";
    }
  
    const date = new Date(value);
  
    if (Number.isNaN(date.getTime())) {
      return value;
    }
  
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  
export default function AutomationPage({ alerts }: AutomationPageProps) {
  const { token } = useSelector((state: any) => state.user);

  const [enabled, setEnabled] = useState(false);
  const [currentDays, setCurrentDays] = useState(3);
  const [baselineDays, setBaselineDays] = useState(7);

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const loadSettings = async () => {
      try {
        setLoading(true);

        const [campaignsResponse, settingsResponse] = await Promise.all([
          getAutomationCampaigns(token),
          getAutomationSettings(token),
        ]);

        setCampaigns(campaignsResponse.data);

        if (settingsResponse.success && settingsResponse.data) {
          const settings = settingsResponse.data;

          setEnabled(settings.enabled);
          setCurrentDays(settings.current_days);
          setBaselineDays(settings.baseline_days);
          setSelectedCampaignIds(settings.campaign_ids || []);
        }
      } catch (err) {
        console.error("Failed to load automation settings:", err);

        setError("Unable to load automation settings.");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [token]);

  const toggleCampaign = (campaignId: number) => {
    setSelectedCampaignIds((previous) => {
      if (previous.includes(campaignId)) {
        return previous.filter((id) => id !== campaignId);
      }

      return [...previous, campaignId];
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const response = await updateAutomationSettings(token, {
        enabled,
        current_days: currentDays,
        baseline_days: baselineDays,
        campaign_ids: selectedCampaignIds,
      });

      if (!response.success) {
        throw new Error("Failed to save automation settings.");
      }

      setSaved(true);
    } catch (err) {
      console.error("Failed to save automation settings:", err);

      setError("Unable to save automation settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-500">Loading automation settings...</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Automations</h1>

          <p className="mt-1 text-sm text-gray-500">
            Configure automated monitoring for your Meta Ads.
          </p>
        </div>

        {/* Creative Fatigue */}

        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 p-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Creative Fatigue
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Detect declining creative performance automatically.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setEnabled((value) => !value)}
              className={`relative h-6 w-11 rounded-full transition ${
                enabled ? "bg-[#6C5CE7]" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                  enabled ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>

          <div className="space-y-6 p-6">
            {/* Periods */}

            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-900">
                Detection Period
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-gray-600">
                    Current period
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={currentDays}
                      onChange={(event) =>
                        setCurrentDays(Number(event.target.value))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#6C5CE7]"
                    />

                    <span className="text-sm text-gray-500">days</span>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-600">
                    Compare against
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={baselineDays}
                      onChange={(event) =>
                        setBaselineDays(Number(event.target.value))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#6C5CE7]"
                    />

                    <span className="text-sm text-gray-500">days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Campaigns */}

            <div>
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-900">Campaigns</h3>

                <p className="mt-1 text-xs text-gray-500">
                  Select the campaigns you want this automation to monitor.
                </p>
              </div>

              <div className="space-y-2">
                {campaigns.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
                    <p className="text-sm text-gray-500">No campaigns found.</p>
                  </div>
                ) : (
                  campaigns.map((campaign) => {
                    const selected = selectedCampaignIds.includes(campaign.id);

                    return (
                      <button
                        key={campaign.id}
                        type="button"
                        onClick={() => toggleCampaign(campaign.id)}
                        className={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition ${
                          selected
                            ? "border-[#6C5CE7] bg-[#6C5CE7]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {campaign.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {campaign.ad_account_name}
                          </p>
                        </div>

                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded border ${
                            selected
                              ? "border-[#6C5CE7] bg-[#6C5CE7] text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {selected && <span className="text-xs">✓</span>}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Error */}

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Saved */}

            {saved && (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
                Automation settings saved.
              </div>
            )}

            {/* Save */}

            <div className="flex justify-end border-t border-gray-100 pt-6">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-[#6C5CE7] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="h-full overflow-y-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Automations</h1>

          <p className="mt-1 text-sm text-gray-500">
            Automated monitoring and alerts for your Meta Ads.
          </p>
        </div>

        {alerts.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center">
            <p className="text-sm text-gray-500">No automation alerts yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <AutomationAlert key={alert.alert_id} alert={alert} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

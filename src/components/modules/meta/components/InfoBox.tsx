type InfoBoxTone = "neutral" | "blue" | "purple" | "green" | "amber" | "red";

const TONE_STYLES: Record<
  InfoBoxTone,
  { bg: string; label: string; value: string }
> = {
  neutral: {
    bg: "bg-[#f7f8f9]",
    label: "text-[#65676b]",
    value: "text-[#1c1e21]",
  },
  blue: {
    bg: "bg-[#eaf2ff]",
    label: "text-[#1560c9]",
    value: "text-[#0d3f8f]",
  },
  purple: {
    bg: "bg-[#f3f0fd]",
    label: "text-[#7c3aed]",
    value: "text-[#5b21b6]",
  },
  green: {
    bg: "bg-emerald-50",
    label: "text-emerald-700",
    value: "text-emerald-900",
  },
  amber: {
    bg: "bg-amber-50",
    label: "text-amber-700",
    value: "text-amber-900",
  },
  red: {
    bg: "bg-red-50",
    label: "text-red-700",
    value: "text-red-900",
  },
};

// Maps common label text to a tone. Add to this as new labels come up —
// call sites never need to change since resolution happens by label string.
function resolveTone(label: string): InfoBoxTone {
  const key = label.trim().toLowerCase();

  if (
    key.includes("currency") ||
    key.includes("spend") ||
    key.includes("budget")
  ) {
    return "blue";
  }
  if (
    key.includes("timezone") ||
    key.includes("time") ||
    key.includes("date")
  ) {
    return "purple";
  }
  if (key.includes("status") || key.includes("active")) {
    return "green";
  }
  if (key.includes("warning") || key.includes("pending")) {
    return "amber";
  }
  if (
    key.includes("error") ||
    key.includes("failed") ||
    key.includes("rejected")
  ) {
    return "red";
  }

  return "neutral";
}

export function InfoBox({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: InfoBoxTone;
}) {
  const resolvedTone = tone ?? resolveTone(label);
  const styles = TONE_STYLES[resolvedTone];

  return (
    <div
      className={`flex min-w-0 items-center gap-1.5 rounded-md ${styles.bg} px-2 py-1.5`}
    >
      <span
        className={`inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles.label}`}
      >
        {label}
      </span>

      <span
        title={value}
        className={`min-w-0 truncate text-xs font-semibold ${styles.value}`}
      >
        {value}
      </span>
    </div>
  );
}

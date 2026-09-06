"use client";

interface SectionEyebrowProps {
  number: string;
  label: string;
  theme?: "light" | "dark";
}

export default function SectionEyebrow({ number, label, theme = "dark" }: SectionEyebrowProps) {
  const labelColor = theme === "light" ? "text-muted-light" : "text-muted-dark";
  return (
    <div className={`font-label ${labelColor} flex items-center gap-2 mb-6 select-none`}>
      <span className="text-accent font-semibold">{number}</span>
      <span>—</span>
      <span className="tracking-widest">{label}</span>
    </div>
  );
}

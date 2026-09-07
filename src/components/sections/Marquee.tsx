"use client";

interface MarqueeProps {
  items: string[];
  duration?: string; // e.g. "28s"
  pauseOnHover?: boolean;
  theme?: "light" | "dark";
}

export default function Marquee({
  items,
  duration = "55s",
  pauseOnHover = true,
  theme = "dark"
}: MarqueeProps) {
  const containerBg = theme === "dark" ? "bg-bg-dark border-y border-border-dark" : "bg-bg-light border-y border-border-light";
  const textColor = theme === "dark" ? "text-text-light" : "text-text-dark";

  // Duplicate items array to make sure it scrolls seamlessly without empty spaces
  const marqueeItems = [...items, ...items, ...items, ...items];

  return (
    <div
      className={`relative w-full overflow-hidden ${containerBg} py-5 md:py-6 select-none`}
      style={{ contentVisibility: "auto" }}
    >
      <div
        className={`flex whitespace-nowrap min-w-full ${
          pauseOnHover ? "hover:[animation-play-state:paused]" : ""
        }`}
      >
        <div
          className="flex items-center shrink-0 animate-marquee"
          style={{ animationDuration: duration }}
        >
          {marqueeItems.map((item, index) => (
            <div key={index} className="flex items-center mx-4 md:mx-6">
              <span className={`font-label tracking-widest text-xs md:text-sm ${textColor}`}>
                {item}
              </span>
              {/* Divider: Acid green asterisk */}
              <span className="text-accent ml-8 md:ml-12 font-bold text-lg leading-none select-none">
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

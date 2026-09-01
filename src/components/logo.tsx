import { cn } from "@/lib/utils";

type LogoProps = {
  /**
   * Sizing is driven by `font-size`: the wordmark renders at 1em and the icon
   * scales with it. Pass a Tailwind text-size utility (e.g. `text-[22px]`).
   */
  className?: string;
  /** Show the "AI Automation & Chatbots" descriptor under the wordmark. */
  showTagline?: boolean;
  /** Render only the icon, without the wordmark. */
  iconOnly?: boolean;
};

/**
 * AXHER brand lockup: a bold "A" monogram fused with an AI/structural-truss
 * node graph, plus the wordmark. Monochrome via `currentColor` so it adapts to
 * the surface it sits on (the site runs a dark theme, so it inherits
 * `text-foreground` and renders light).
 */
export function Logo({ className, showTagline = false, iconOnly = false }: LogoProps) {
  const icon = (
    <svg
      viewBox="0 0 128 118"
      role="img"
      aria-label="AXHER"
      className={cn("w-auto shrink-0", iconOnly ? "h-[1em]" : "h-[1.2em]")}
    >
      {/* Bold "A" monogram */}
      <path
        d="M44 6 L82 112 L64 112 L55 82 L33 82 L24 112 L6 112 Z M44 41 L54 68 L34 68 Z"
        fill="currentColor"
        fillRule="evenodd"
      />

      {/* Neural / structural node graph fused to the A's right shoulder */}
      <g stroke="currentColor" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.55}>
        <line x1="72" y1="17" x2="108" y2="29" />
        <line x1="72" y1="17" x2="90" y2="52" />
        <line x1="108" y1="29" x2="90" y2="52" />
        <line x1="108" y1="29" x2="120" y2="64" />
        <line x1="90" y1="52" x2="120" y2="64" />
        <line x1="90" y1="52" x2="100" y2="86" />
        <line x1="120" y1="64" x2="100" y2="86" />
        <line x1="90" y1="52" x2="66" y2="60" />
        <line x1="72" y1="17" x2="66" y2="60" />
      </g>
      <g fill="currentColor">
        <circle cx="72" cy="17" r="6" />
        <circle cx="108" cy="29" r="6" />
        <circle cx="90" cy="52" r="5.5" />
        <circle cx="66" cy="60" r="5" />
        <circle cx="120" cy="64" r="5.5" opacity={0.4} />
        <circle cx="100" cy="86" r="5.5" opacity={0.4} />
      </g>
    </svg>
  );

  if (iconOnly) {
    return <span className={cn("inline-flex text-foreground", className)}>{icon}</span>;
  }

  return (
    <span className={cn("inline-flex items-center gap-[0.42em] text-foreground", className)}>
      {icon}
      <span className="flex flex-col leading-[0.95]">
        <span className="font-display text-[1em] font-extrabold tracking-[-0.01em]">AXHER</span>
        {showTagline && (
          <span className="mt-[0.15em] text-[0.34em] font-semibold uppercase leading-none tracking-[0.2em] text-muted-foreground">
            AI Automation &amp; Chatbots
          </span>
        )}
      </span>
    </span>
  );
}

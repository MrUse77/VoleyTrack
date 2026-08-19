import { Badge as PrimitiveBadge } from "../primitives/Badge";
import type { HTMLAttributes } from "react";

type BadgeTone = "accent" | "muted" | "success" | "neutral";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  variant?: "default" | "success" | "danger" | "accent";
};

function mapToneToVariant(tone: BadgeTone | undefined, variant: BadgeProps["variant"]): "default" | "success" | "danger" | "accent" | undefined {
  if (variant) return variant;
  if (!tone) return undefined;
  if (tone === "muted" || tone === "neutral") return "default";
  if (tone === "success") return "success";
  return "accent";
}

export function Badge({ tone = "neutral", variant, className = "", ...props }: BadgeProps) {
  const resolvedVariant = mapToneToVariant(tone, variant);
  return <PrimitiveBadge variant={resolvedVariant} className={className} {...props} />;
}

export type { BadgeProps };

import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

type BrandButtonBase = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
};

type BrandButtonLink = BrandButtonBase & {
  as?: "link";
  href: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

type BrandButtonButton = BrandButtonBase & {
  as?: "button";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export type BrandButtonProps = BrandButtonLink | BrandButtonButton;

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-ink text-white shadow-soft hover:-translate-y-[1px] border border-brand-ink",
  secondary:
    "bg-white text-[var(--text-primary)] border border-[#dfe5e1] hover:border-brand-leaf",
  ghost: "bg-transparent text-[var(--text-primary)] hover:text-brand-leaf",
};

export function BrandButton(props: BrandButtonProps) {
  const { variant = "primary", className, children, as = "link", ...rest } = props;
  const classes = cn(
    "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-transform",
    variantClasses[variant],
    className,
  );

  if (as === "button") {
    const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button type={buttonProps.type ?? "button"} className={classes} {...buttonProps}>
        {children}
      </button>
    );
  }

  const linkProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
  return (
    <Link href={"href" in props ? props.href : "#"} className={classes} {...linkProps}>
      {children}
    </Link>
  );
}


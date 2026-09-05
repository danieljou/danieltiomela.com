import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold " +
    "leading-none select-none transition-[transform,border-color,filter,background-color] " +
    "duration-200 ease-brand " +
    "focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-secondary " +
    "disabled:pointer-events-none disabled:opacity-50 " +
    // R08  touch targets never below 44px on the sizes used on mobile
    "min-h-11",
  {
    variants: {
      variant: {
        primary:
          "grad-brand-action text-ink hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0",
        ghost:
          "border border-line text-text hover:border-line-strong hover:-translate-y-0.5 active:translate-y-0",
        quiet: "text-muted hover:text-secondary-text",
      },
      size: {
        sm: "px-4 py-2.5 text-sm",
        md: "px-6 py-3.5 text-[15px]",
        lg: "px-8 py-4 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type BaseProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: never;
    isLoading?: boolean;
  };

type ButtonAsLink = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
    /** Set for outbound links  adds rel and the new-tab affordance. */
    external?: boolean;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * One button, three weights. `primary` is the single most important action on
 * a page  if two are on screen, one of them is wrong.
 */
export const Button = forwardRef<
  HTMLButtonElement & HTMLAnchorElement,
  ButtonProps
>(function Button({ className, variant, size, children, ...props }, ref) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if ("href" in props && props.href !== undefined) {
    const { href, external, ...rest } = props as ButtonAsLink;
    const isExternal = external ?? /^https?:\/\//.test(href);
    return (
      <Link
        ref={ref}
        href={href}
        className={classes}
        {...(isExternal
          ? { target: "_blank", rel: "noreferrer noopener" }
          : {})}
        {...rest}
      >
        {children}
      </Link>
    );
  }

  const { isLoading, disabled, ...rest } = props as ButtonAsButton;
  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
});

function Spinner() {
  return (
    // The global reduced-motion rule freezes every animation, which would
    // leave a spinner stopped mid-turn  the one thing that reads as broken
    // rather than busy. Under that preference the icon is dropped entirely;
    // the label already switches to "Sending…" and the button is disabled.
    <svg
      className="h-4 w-4 animate-spin motion-reduce:hidden"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        opacity="0.25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export { buttonVariants };

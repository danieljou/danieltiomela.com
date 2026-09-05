import { Button } from "@/components/ui/Button";
import { Node } from "@/components/brand/Brand";
import { cn } from "@/lib/utils";

/**
 * R01  an empty result is a state to design, not an accident to leave blank.
 * It says what is missing, why, and what to do instead.
 */
export function EmptyState({
  title,
  body,
  action,
  className,
}: {
  title: string;
  body: string;
  action?: { label: string; href: string };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-4 rounded-lg border border-dashed",
        "border-line bg-surface/40 px-6 py-14 text-center",
        className,
      )}
    >
      <Node muted />
      <div className="max-w-md">
        <p className="font-display text-lg font-semibold text-text-strong">
          {title}
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{body}</p>
      </div>
      {action && (
        <Button href={action.href} variant="ghost" size="sm" className="mt-2">
          {action.label}
        </Button>
      )}
    </div>
  );
}

/**
 * R06  a human sentence, a way out, and an error id when there is one.
 */
export function ErrorState({
  title,
  body,
  retryLabel,
  onRetry,
  errorId,
  className,
}: {
  title: string;
  body: string;
  retryLabel: string;
  onRetry?: () => void;
  errorId?: string;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-start gap-4 rounded-lg border border-danger/40",
        "bg-danger/[0.06] px-6 py-8",
        className,
      )}
    >
      <div>
        <p className="font-display text-lg font-semibold text-text-strong">
          {title}
        </p>
        <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-muted">
          {body}
        </p>
      </div>
      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
      {errorId && (
        <p className="font-mono text-[11px] uppercase tracking-widest text-faint">
          Error ID · {errorId}
        </p>
      )}
    </div>
  );
}

/** R02  a skeleton shaped like the content that is coming, not a spinner. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-md bg-surface-2",
        "motion-safe:animate-pulse",
        className,
      )}
    />
  );
}

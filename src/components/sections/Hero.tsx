import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Tag, Pill } from "@/components/ui/Tag";
import { Trace, Glow } from "@/components/brand/Brand";
import { Container } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { site } from "@/lib/site";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/types";
import type { CSSProperties } from "react";

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <Parallax speed={0.06} className="absolute inset-0">
        <Trace opacity={0.42} />
      </Parallax>
      <Glow
        tone="blue"
        className="-left-40 -top-56 h-[520px] w-[720px] opacity-55"
      />
      <Glow
        tone="cyan"
        className="-right-40 top-10 h-[480px] w-[620px] opacity-45"
      />
      <Glow
        tone="violet"
        className="left-1/3 -bottom-64 h-[420px] w-[520px] opacity-60"
      />

      <Container className="relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 lg:py-28">
        <div>
          <Pill pulse>{dict.hero.availability}</Pill>

          <p className="mt-7 font-mono text-xs uppercase tracking-[0.2em] text-secondary-text sm:text-[13px]">
            {dict.hero.eyebrow}
          </p>

          <h1
            id="hero-title"
            className="mt-4 text-[clamp(2.5rem,7vw,4.25rem)] font-bold leading-[1.02]"
          >
            {dict.hero.name}
          </h1>

          <p className="mt-3 font-display text-2xl font-medium grad-text sm:text-[28px]">
            {dict.hero.role}
          </p>

          <Reveal>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-muted sm:text-lg">
              {dict.hero.lede.split(" ").map((word, i) => (
                <span
                  key={i}
                  className="reveal-word"
                  style={{ "--word-delay": `${i * 45}ms` } as CSSProperties}
                >
                  {word}&nbsp;
                </span>
              ))}
            </p>
          </Reveal>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={`/${locale}/projects`}>{dict.hero.ctaPrimary}</Button>
            <Button href={`/${locale}/contact`} variant="ghost">
              {dict.hero.ctaSecondary}
            </Button>
          </div>

          <p className="mt-5 text-sm text-faint">{dict.hero.availabilityDetail}</p>

          <ul
            className="mt-10 flex flex-wrap gap-2"
            aria-label={dict.stack.label}
          >
            {site.stack.slice(0, 6).map((t) => (
              <li key={t}>
                <Tag>{t}</Tag>
              </li>
            ))}
          </ul>
        </div>

        {/* Decorative composition  the portrait carries no information the
            text does not already give, so it stays out of the a11y tree. */}
        <div className="relative mx-auto hidden w-full max-w-sm lg:block">
          <div
            aria-hidden="true"
            className="absolute inset-x-6 -inset-y-4 rounded-full border border-line/70"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -inset-y-12 rounded-full border border-line/40"
          />
          <Image
            src="/assets/brand/portrait.png"
            alt=""
            width={605}
            height={468}
            priority
            sizes="(min-width: 1024px) 384px, 0px"
            style={{
              // The source is a bust crop, so its lower edge is a hard cut.
              // Fading it out is what makes it read as lighting, not as a
              // photo that ran out.
              maskImage: "linear-gradient(180deg,#000 62%,transparent 97%)",
              WebkitMaskImage:
                "linear-gradient(180deg,#000 62%,transparent 97%)",
            }}
            className="relative w-full drop-shadow-[0_24px_60px_rgba(5,10,22,0.55)]"
          />
        </div>
      </Container>
    </section>
  );
}

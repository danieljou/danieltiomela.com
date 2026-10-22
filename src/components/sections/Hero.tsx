import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Tag, Pill } from "@/components/ui/Tag";
import { Glow } from "@/components/brand/Brand";
import { Container } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Scene3D } from "@/components/motion/Scene3D";
import { HeroScene } from "@/components/three/HeroScene";
import { site } from "@/lib/site";
import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content/types";
import type { CSSProperties } from "react";

const CHIP_POSITION = ["-left-6 top-[14%]", "-right-8 top-[42%]", "left-2 bottom-[10%]"];

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div aria-hidden="true" className="dot-grid absolute inset-0" />
      <Glow tone="blue" className="-left-40 -top-56 h-130 w-180 opacity-55" />
      <Glow tone="cyan" className="-right-40 top-10 h-120 w-155 opacity-45" />
      <Glow tone="violet" className="left-1/3 -bottom-64 h-105 w-130 opacity-60" />

      <Container className="relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12 lg:py-28">
        <div>
          <Pill pulse>{dict.hero.availability}</Pill>

          <p className="mt-7 font-mono text-xs uppercase tracking-[0.2em] text-secondary-text sm:text-[13px]">
            {dict.hero.eyebrow}
          </p>

          <h1
            id="hero-title"
            className="mt-4 text-[clamp(2.75rem,7.5vw,5rem)] font-bold leading-[0.98] tracking-[-0.03em]"
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

          <ul className="mt-10 flex flex-wrap gap-2" aria-label={dict.stack.label}>
            {site.stack.slice(0, 6).map((t) => (
              <li key={t}>
                <Tag>{t}</Tag>
              </li>
            ))}
          </ul>
        </div>

        {/* Decorative composition  the portrait carries no information the
            text does not already give, so it stays out of the a11y tree. It is
            a stack of layers at different depths: the WebGL rings behind, the
            portrait in the middle, tags floating in front. The whole stack
            leans toward the cursor, so the layers slide against each other. */}
        <div aria-hidden="true" className="pointer-events-none relative mx-auto hidden w-full max-w-md lg:block">
          <HeroScene />
          <Scene3D baseRx={2} baseRy={-4} global>
            <div className="layer relative">
              <div
                className="layer absolute inset-x-6 -inset-y-4 rounded-full border border-line/70"
                style={{ "--z": "-70px" } as CSSProperties}
              />
              <div
                className="layer absolute inset-x-0 -inset-y-12 rounded-full border border-line/40"
                style={{ "--z": "-120px" } as CSSProperties}
              />
              <div className="layer" style={{ "--z": "20px" } as CSSProperties}>
                <Image
                  src="/assets/brand/portrait.png"
                  alt=""
                  width={605}
                  height={468}
                  priority
                  sizes="(min-width: 1024px) 448px, 0px"
                  style={{
                    // The source is a bust crop, so its lower edge is a hard cut.
                    // Fading it out is what makes it read as lighting, not as a
                    // photo that ran out.
                    maskImage: "linear-gradient(180deg,#000 62%,transparent 97%)",
                    WebkitMaskImage: "linear-gradient(180deg,#000 62%,transparent 97%)",
                  }}
                  className="relative w-full drop-shadow-[0_24px_60px_rgba(5,10,22,0.55)]"
                />
              </div>
              {site.stack.slice(0, 3).map((t, i) => (
                <span
                  key={t}
                  style={
                    {
                      "--z": `${70 + i * 28}px`,
                      "--float-dur": `${6 + i * 1.3}s`,
                      "--float-delay": `${i * -1.7}s`,
                    } as CSSProperties
                  }
                  className={`layer float-chip absolute z-10 rounded-full border border-line-strong/80 bg-bg/70 px-3.5 py-1.5 font-mono text-xs text-text shadow-[0_10px_30px_rgba(5,10,22,0.5)] backdrop-blur-md ${CHIP_POSITION[i]}`}
                >
                  <span className="mr-2 inline-block size-1.5 rounded-full bg-secondary align-middle" />
                  {t}
                </span>
              ))}
            </div>
          </Scene3D>
        </div>
      </Container>
    </section>
  );
}

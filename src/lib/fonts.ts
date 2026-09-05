import localFont from "next/font/local";

/**
 * Self-hosted so the type never depends on a third party being up, and so the
 * first paint carries the brand face rather than a fallback.
 */
export const spaceGrotesk = localFont({
  src: [
    { path: "../fonts/space-grotesk-500.ttf", weight: "500", style: "normal" },
    { path: "../fonts/space-grotesk-700.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-space-grotesk",
  display: "swap",
  fallback: ["Sora", "Manrope", "system-ui", "sans-serif"],
});

export const inter = localFont({
  src: [
    { path: "../fonts/inter-400.ttf", weight: "400", style: "normal" },
    { path: "../fonts/inter-500.ttf", weight: "500", style: "normal" },
    { path: "../fonts/inter-600.ttf", weight: "600", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

export const jetbrainsMono = localFont({
  src: [
    { path: "../fonts/jetbrains-mono-400.ttf", weight: "400", style: "normal" },
    { path: "../fonts/jetbrains-mono-500.ttf", weight: "500", style: "normal" },
  ],
  variable: "--font-jetbrains",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

export const fontVariables = `${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`;

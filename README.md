# danieltiomela.com

Personal site of **Daniel Tiomela Jou** Full Stack & DevOps engineer, Yaoundé.
Bilingual (EN/FR), statically rendered, built on the brand system v1.1.

---

## Stack

|            |                                                                               |
| ---------- | ----------------------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, React 19)                                             |
| Language   | TypeScript, `strict`                                                          |
| Styling    | Tailwind CSS v4 (`@theme` / `@utility`, no config file)                       |
| Variants   | `class-variance-authority` + `clsx` + `tailwind-merge`                        |
| Validation | Zod, shared between browser and server                                        |
| Mail       | Resend, via a Server Action                                                   |
| Fonts      | Space Grotesk / Inter / JetBrains Mono, self-hosted through `next/font/local` |
| Hosting    | Vercel see [`DEPLOY.md`](./DEPLOY.md)                                         |

No CSS framework beyond Tailwind, no component library, no client-side data
fetching. Every page is prerendered at build time; the only server code that
runs at request time is the locale redirect and the contact action.

---

## Running it

```bash
npm install
cp .env.example .env.local   # only needed for the contact form
npm run dev                  # http://localhost:3000 → redirects to /en or /fr
```

```bash
npm run build && npm start   # production build, 20 static pages
npm run lint
```

---

## Where things are

```
src/
  app/[locale]/          every page lives under a locale segment
    layout.tsx           <html>, fonts, metadata, JSON-LD, skip link
    page.tsx             home
    about/ projects/ contact/ blog/
    projects/[slug]/     case-study template
    loading.tsx  error.tsx  not-found.tsx
  app/globals.css        design tokens + the four brand utilities
  app/sitemap.ts  robots.ts
  proxy.ts               Accept-Language → /en or /fr
  content/
    types.ts             the Dictionary contract
    en.ts  fr.ts         all site copy  both must satisfy Dictionary
    projects.ts          project data + the case-study template
  components/
    brand/               Monogram, Trace, Glow, ArchBlock, Metric, Connection
    ui/                  Button, Card, Tag
    layout/              Header, Footer, Section, Container
    sections/            Hero, ProjectCard, ContactForm, shared sections
    feedback/            loading / empty / error states
  lib/
    site.ts              single source of truth: name, links, email, stack
    i18n.ts  fonts.ts  utils.ts  contact-rules.ts
```

---

## Editing the content

Almost everything you will want to change is data, not markup.

**`src/lib/site.ts`** name, role, email, GitHub, LinkedIn, stack, feature
flags. Change an address here and the header, footer, structured data, sitemap
and contact page all follow. Nothing is hardcoded anywhere else.

**`src/content/en.ts` and `fr.ts`** every string on the site. Both are typed
against `Dictionary`, so adding a key to one and forgetting the other is a
build error rather than a missing sentence in production.

**`src/content/projects.ts`** the projects. Each has a `sections` array, the
seven-step case-study spine, and it is deliberately empty. The template at the
bottom of that file explains each step. One filled-in case study is worth more
than every other page here: it is the only place that shows how you think
rather than what you have installed.

**Adding a language** add the code to `locales` in `src/lib/i18n.ts`, add
`src/content/<code>.ts` implementing `Dictionary`, register it in
`getDictionary`. The routes, sitemap and `hreflang` tags generate themselves.

---

## The design system

Tokens are ported verbatim from the brand system v1.1 into `@theme` in
`globals.css`, with two deliberate deviations, both documented in place:

- `--color-faint` is lightened from `#5C6E8E` to `#7386A8`. At 10–12px the
  original measured 3.4:1 under the 4.5:1 floor for small text.
- Filled buttons use `grad-brand-action`, the brand gradient with a lightened
  blue end. The original gives ink-on-gradient 4.40:1; this clears 4.5 across
  the whole sweep. The decorative rule still uses the original gradient.

Spacing intentionally uses Tailwind's own numeric scale. Defining
`--spacing-sm/md/lg/xl` in `@theme` shadows the named container sizes and
silently turns `max-w-xl` into 40px there is a comment in `globals.css`
saying so, and it is there because it happened.

---

## Accessibility

Targeted at WCAG 2.1 AA, and measured rather than assumed:

- **87 foreground/background pairs** sampled across every page in both locales
  0 below their threshold.
- Skip link is the first tab stop; focus is restyled, never removed.
- Every input has a real `<label>`, a visible required marker, on-blur
  validation from the same Zod schema the server uses, `aria-invalid`, and an
  error tied by `aria-describedby` and announced with `role="alert"`.
- Inputs are 16px on mobile below that, iOS Safari zooms the page on focus.
- Touch targets ≥ 44px. `viewport-fit=cover` plus a `max()` gutter keeps text
  off the notch.
- `prefers-reduced-motion` is honoured globally; the submit spinner hides under
  it rather than freezing mid-turn.
- The portrait is decorative and stays out of the accessibility tree the
  heading beside it already carries the information.

---

## Contact form

`src/actions/contact.ts` is a Server Action. It validates with the schema in
`src/lib/contact-rules.ts` the same one the browser uses on blur, so the
client can never accept something the server will reject checks a honeypot,
throttles, and sends through Resend.

Failure is explicit: the form returns a short Error ID (`CONFIG`, `SEND`,
`RATE`, `UNKNOWN`) and tells the visitor to email directly. It never reports
success for a message that did not send.

The throttle is a per-instance `Map`: three submissions per address per minute.
That stops a double-click and a casual bot, not a distributed flood. If it ever
gets seriously abused, swap the `seen` map for Upstash Redis about ten lines.

---

## Deployment

See [`DEPLOY.md`](./DEPLOY.md): GitHub → Vercel → Resend → the Hostinger DNS
records for `danieltiomela.com`.

---

## Two things to know before you edit

**The blog is hidden on purpose.** `features.blog = false` in `src/lib/site.ts`
removes it from the navigation and the sitemap. The page exists and works. Flip
the flag once there are two posts an empty blog costs more credibility than
no blog.

**`middleware.ts` is `proxy.ts` here.** Next 16 renamed it. If you paste in
middleware code from a tutorial, it will silently never run.

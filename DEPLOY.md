# Deployment Vercel + the Hostinger domain

You keep `danieltiomela.com` registered at Hostinger. Only the DNS points at
Vercel. Nothing about the registration changes.

---

## 1. Push to GitHub

```bash
cd portfolio
git init
git add .
git commit -m "Portfolio: Next.js, bilingual, brand system v1.1"
git branch -M main
git remote add origin https://github.com/danieljou/portfolio.git
git push -u origin main
```

Create the repository on GitHub first, **empty** no README, no .gitignore.
The project already has both.

---

## 2. Import into Vercel

1. vercel.com → **Add New… → Project** → import `danieljou/portfolio`.
2. Vercel detects Next.js on its own. Change nothing in the build settings.
3. Before the first deploy, open **Environment Variables** and add the two from
   step 3 below. Adding them now avoids a first deploy where the contact form
   is broken.
4. Deploy. You get a `*.vercel.app` URL check the site works there before
   touching DNS.

Every `git push` to `main` redeploys. Every pull request gets its own preview
URL.

---

## 3. Contact form Resend

The form fails cleanly with an Error ID when these are missing, so the site is
never _pretending_ to send mail. But it does need them to actually work.

1. Create an account at **resend.com** (free: 3,000 emails/month, 100/day).
2. **API Keys → Create** → copy the `re_…` value.
3. In Vercel → Settings → Environment Variables, add both, for all three
   environments (Production, Preview, Development):

   | Name                 | Value                   |
   | -------------------- | ----------------------- |
   | `RESEND_API_KEY`     | `re_…`                  |
   | `CONTACT_FROM_EMAIL` | `onboarding@resend.dev` |

`onboarding@resend.dev` works instantly with no setup, but Resend will only
deliver it to the address that owns the account which is fine here, since
every message goes to you.

**Better, once the domain is live:** in Resend → Domains, add
`danieltiomela.com`. Resend gives you a few DNS records to add at Hostinger
(SPF, DKIM). Once verified, change `CONTACT_FROM_EMAIL` to
`contact@danieltiomela.com`. Messages then arrive from your own domain instead
of Resend's, which matters when a recruiter replies.

---

## 4. Point the domain at Vercel

In Vercel → your project → **Settings → Domains**, add `danieltiomela.com`.

Vercel then displays **the exact DNS records to create** for your domain an
A record for the apex and a CNAME for `www`.

> Copy those values from that screen, not from a tutorial including this one.
> Vercel has changed its published IP more than once, and a stale A record in a
> blog post is the most common reason a domain silently fails to resolve.

Then in Hostinger → **Domains → DNS / Nameservers → Manage DNS records**:

1. Delete any existing `A` record on `@` and any `CNAME` on `www` that point at
   Hostinger's own hosting two records for the same name will fight.
2. Add the records exactly as Vercel showed them.
3. Leave every `MX` record alone if you have email on this domain. Deleting
   those is how people lose their mail.

Propagation is usually minutes, occasionally a few hours. Vercel's Domains page
shows a live check and issues the TLS certificate automatically once the records
resolve.

Verify from a terminal:

```bash
dig +short danieltiomela.com
dig +short www.danieltiomela.com
```

---

## 5. After the first live deploy

- [ ] `danieltiomela.com` redirects to `/en` or `/fr` based on browser language
- [ ] HTTPS is active Vercel issues the certificate on its own
- [ ] `danieltiomela.com/sitemap.xml` and `/robots.txt` respond
- [ ] Send yourself a message through the contact form and confirm it arrives
- [ ] Paste the URL into a LinkedIn post draft check the preview card renders
- [ ] Add the URL to: GitHub profile, LinkedIn, the CV, the email signature

---

## Things that will bite

**The blog is hidden on purpose.** `src/lib/site.ts` has
`features.blog = false`, which removes it from the navigation and the sitemap.
Flip it to `true` once you have two posts. An empty blog costs more credibility
than no blog.

**Case studies are empty on purpose.** `src/content/projects.ts` has real
stack, roles and repositories but no `sections`. The template at the bottom of
that file is the seven-step spine. One filled-in case study is worth more than
everything else on the site it is the only place where you show how you
think, rather than what you have installed.

**`src/lib/site.ts` is the single source of truth.** Change an email or a handle
there and the header, footer, structured data, sitemap and contact page all
follow. Do not hardcode them anywhere else.

**Rate limiting is per-instance.** The contact form throttles three submissions
per email per minute, held in the memory of one serverless instance. That stops
an accidental double-click and a casual bot, not a distributed flood. If it ever
gets seriously abused, swap the `seen` map in `src/actions/contact.ts` for
Upstash Redis it is about ten lines.

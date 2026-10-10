# Deploying Vyom

The site is a **static export**. `npm run build` writes a complete, self-contained
site to `out/` — no server runtime, no Node process, no serverless functions. That
makes it cheap and portable: Vercel is set up below, but the same `out/` directory
would work on Cloudflare Pages, Netlify or S3 unchanged.

---

## 1. Before you start

```bash
npm install
npm run check    # typecheck + lint + build, all must pass
```

`npm run check` is the same gate CI should enforce. If it fails locally it will
fail on Vercel.

---

## 2. Connect the GitHub repository to Vercel

1. Push the repository to GitHub (see §7 if it is not there yet).
2. Sign in at [vercel.com](https://vercel.com) with the GitHub account that owns
   the repository.
3. **Add New… → Project**, then **Import** the `vyom` repository. Grant Vercel
   access to the repository if prompted.
4. Vercel detects Next.js and fills in the build settings. Confirm they read:

   | Setting | Value |
   | --- | --- |
   | Framework Preset | Next.js |
   | Build Command | `npm run build` |
   | Output Directory | *(leave as the Next.js default)* |
   | Install Command | `npm install` |
   | Node.js Version | 22.x |

   Do **not** override the output directory to `out`. Next.js tells Vercel where
   the export landed; overriding it can break the routing for
   `trailingSlash: true`.
5. Add the environment variable in §3 **before** the first deploy.
6. Click **Deploy**.

---

## 3. Environment variables

One variable, and it stays empty until the backend exists.

In **Project → Settings → Environment Variables**, add:

| Name | Value | Environments |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | *(empty)* | Production, Preview, Development |

While it is empty, `submitBenchmarkRequest()` in `src/lib/api.ts` builds a
pre-filled `mailto:` link and nothing is transmitted or stored. When the backend
lands, set it to the API's base URL (no trailing slash) and that one function
starts POSTing to `${NEXT_PUBLIC_API_URL}/benchmark-requests` instead. **No other
file needs to change.**

`NEXT_PUBLIC_` variables are inlined into the client bundle at build time, so
they are public by definition. Never put a secret behind this prefix, and
remember a change only takes effect after a redeploy.

Locally, copy `.env.example` to `.env.local` and leave the value empty.

---

## 4. Preview deployments for every branch

Vercel does this by default once the repository is connected, and the default is
what we want:

- **Every push to any non-production branch** gets its own preview URL.
- **Every pull request** gets a preview URL commented on the PR, updated on each
  push.

Confirm under **Settings → Git**:

- *Production Branch* is `main`.
- *Deploy Previews* is enabled for all branches.

Two things worth doing on previews:

1. **Protect them.** Previews are public URLs by default. Under
   **Settings → Deployment Protection**, turn on *Vercel Authentication* for
   Preview so only your team can open them. This matters while the site is a
   concept preview with placeholder copy.
2. **Leave `indexable: false`.** Previews must never be indexed. Because the flag
   lives in `site.config.ts` and defaults to `false`, previews emit
   `noindex` and a `Disallow: /` robots.txt automatically.

---

## 5. Production deploys from `main`

- Merging to `main` triggers a production deploy to the production domain.
- Nothing else deploys to production. Previews never do.
- Roll back from **Deployments → ⋯ → Promote to Production** on a previous
  successful deployment; it is instant, because every build is kept.

A deploy fails rather than ships if `npm run build` fails, which includes the
TypeScript check. Lint is not part of `next build`, so enforce `npm run check` in
CI if you want lint to block a merge.

---

## 6. Custom domain

1. **Project → Settings → Domains → Add**, enter the domain (for example
   `vyom.health`).
2. Vercel shows the DNS records to create at your registrar:
   - **Apex** (`vyom.health`): an `A` record to Vercel's anycast IP, or an
     `ALIAS`/`ANAME` to `cname.vercel-dns.com` if your registrar supports it.
   - **Subdomain** (`www.vyom.health`): a `CNAME` to `cname.vercel-dns.com`.
3. Add both, and set one as primary with the other redirecting to it. Vercel
   issues and renews the TLS certificate automatically once DNS resolves —
   usually minutes, occasionally up to a few hours.
4. **Update `siteConfig.url` in `site.config.ts` to the live origin** and
   redeploy. It is the base for canonical URLs, `sitemap.xml` and the Open Graph
   image URL, so if it is wrong those all point at the wrong host.

---

## 7. Pushing to GitHub

If the repository is not on GitHub yet:

```bash
gh repo create vyom --private --source=. --remote=origin --push
```

Afterwards, ordinary work:

```bash
git checkout -b my-change
git push -u origin my-change     # Vercel builds a preview
# open a PR, review the preview, merge to main → production deploy
```

---

## 8. Going live

The site ships `noindex` on every page and a `Disallow: /` robots.txt until you
say otherwise. This is deliberate: it is a concept preview with placeholder copy
and sample data.

Before flipping the switch, clear these:

- [ ] Replace `email: '[YOUR EMAIL]'` in `site.config.ts`.
- [ ] Replace `[BIO PLACEHOLDER]` and `[ADVISERS PLACEHOLDER]` in
      `src/content/company.ts`.
- [ ] Have a lawyer review `/privacy` and `/terms`, then remove the draft notice
      in `src/content/legal.ts` and update the "Last updated" dates.
- [ ] Set `siteConfig.url` to the live origin (§6).
- [ ] Decide whether the "Concept preview" bar should stay. It is
      `showNotice` in `site.config.ts`.
- [ ] Re-check that every figure on the site is still a sourced fact, a labelled
      Target, or Sample data.

Then, in `site.config.ts`:

```ts
indexable: true,
```

Commit, merge to `main`, and confirm on the live site that:

- `https://<domain>/robots.txt` reads `Allow: /`.
- The page source no longer contains `<meta name="robots" content="noindex…">`.
- `https://<domain>/sitemap.xml` lists all 14 routes with the right origin.

Finally, submit the sitemap in Google Search Console.

Flipping `indexable` back to `false` and redeploying de-indexes the site again,
though search engines take time to drop pages that are already indexed.

---

## Reference

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Static export to `out/` |
| `npm run start` | Serve the built `out/` locally |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run check` | All three, in order |

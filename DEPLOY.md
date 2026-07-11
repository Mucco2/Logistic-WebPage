# DEPLOY.md – Sådan sættes lw-transport.de i drift

Sitet er 100 % statisk (HTML/CSS/JS). **Der er intet build-step og ingen miljøvariabler** – filerne uploades som de er.

## 1. FØR upload – blokerende punkter

- [ ] **Impressum og Datenschutzerklärung er IKKE færdige.** Begge sider indeholder synlige pladsholdere og røde advarselsbokse. Udfyld alle punkter i `LAUNCH-CHECKLIST.md` først. Sitet må ikke gå live før dette er på plads (§ 5 DDG / DSGVO).
- [ ] Test alle tre formularer (tilbud + 2× ring-op) med rigtige testdata og bekræft, at mailen ankommer til `info@lw-transport.de`.

## 2. Hvad skal uploades – og hvad skal IKKE

**Upload:**
- Alle `.html`-filer, `robots.txt`, `sitemap.xml`, `site.webmanifest`
- `favicon.ico`, `favicon-32x32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `Aramlogo.png`
- Billeder: `Vito1.jpg`, `Vito2.jpg`, `Vito3.jpg`, `faq1.jpg`, `kunder.jpg`
- Mapperne `css/`, `js/`, `assets/fonts/` (inkl. LICENSE-filerne – OFL-licensen kræver, at de følger med fontene) og `assets/images/`

**Upload IKKE:**
- `LAUNCH-CHECKLIST.md`, `DEPLOY.md`, `assets/images/SOURCES.md` (intern dokumentation)
- `.gitignore`, `.git/`, `.claude/`

Fjern derefter linjen `Disallow: /LAUNCH-CHECKLIST.md` fra `robots.txt` – når filen ikke uploades, afslører linjen kun et internt filnavn.

## 3. Domæne og HTTPS

- [ ] Bekræft `https://lw-transport.de` som endelig domæne (canonical-tags og sitemap peger på netop denne, uden www).
- [ ] Aktivér HTTPS (Let's Encrypt el.lign.) og sæt redirects op, så alle varianter ender på `https://lw-transport.de/...`:
  - `http://` → `https://` (301)
  - `https://www.` → `https://` (301)

## 4. 404-side

Hostingen skal levere `404.html` **med HTTP-status 404** for ukendte URL'er (ikke redirect til forsiden). På Apache-hosting (IONOS, Strato, all-inkl m.fl.) i `.htaccess`:

```apache
ErrorDocument 404 /404.html
```

På Netlify/Cloudflare Pages sker det automatisk, når filen hedder `404.html`.

## 5. Security headers

Sættes hos hosteren (`.htaccess`, kontrolpanel eller `_headers`-fil). Bemærk: CSP'en skal tillade EmailJS-SDK'et fra jsDelivr og API-kald til EmailJS – ellers går formularerne i stykker.

```apache
<IfModule mod_headers.c>
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; connect-src 'self' https://api.emailjs.com; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; object-src 'none'; upgrade-insecure-requests"
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>
```

Test formularerne igen EFTER at CSP er slået til.

## 6. Cache og komprimering

Filnavnene har ingen versions-hash, så brug moderate cache-tider:

```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 1 hour"
  ExpiresByType text/css "access plus 7 days"
  ExpiresByType application/javascript "access plus 7 days"
  ExpiresByType image/jpeg "access plus 30 days"
  ExpiresByType image/png "access plus 30 days"
  ExpiresByType image/webp "access plus 30 days"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>
```

Aktivér gzip/brotli-komprimering for HTML/CSS/JS, hvis hosteren ikke gør det automatisk.

## 7. EmailJS – skal hærdes før launch

Formularerne sender via EmailJS med en offentlig nøgle (`js/form.js`). Nøglen er designet til at være offentlig, men uden begrænsninger kan fremmede bruge den til spam:

- [ ] Log ind på dashboard.emailjs.com → Account → Security: **begræns nøglen til domænet `lw-transport.de`** (domain whitelist).
- [ ] Slå rate-limiting til og hold øje med forbruget (gratis-planen har månedskvote).
- [ ] Afklar EmailJS DPA/Auftragsverarbeitung og USA-overførsel (jf. `LAUNCH-CHECKLIST.md`) og opdater datenschutz.html derefter.

## 8. E-mail-levering (SPF/DKIM/DMARC)

For at mails fra domænet (og svar på formular-mails) ikke lander i spam:

- [ ] Opsæt SPF-, DKIM- og DMARC-DNS-records for `lw-transport.de` hos mail-udbyderen.
- [ ] Send en testmail til Gmail/Outlook og tjek, at den ikke markeres som spam.

## 9. Efter launch

- [ ] Klik alle sider igennem på mobil og desktop (menu, formularer, lightbox, telefon-/WhatsApp-links).
- [ ] Test at `https://lw-transport.de/findes-ikke` giver status 404 med 404-siden.
- [ ] Opret Google Search Console (og evt. Bing Webmaster) og indsend `sitemap.xml`.
- [ ] Kør PageSpeed Insights / Lighthouse og bekræft, at der ikke er nye advarsler.
- [ ] Bekræft i browserens netværksfane: ingen eksterne kald ved almindelig sidevisning (kun ved formular-afsendelse må `cdn.jsdelivr.net` og `api.emailjs.com` optræde) – det er dét, datenschutz.html lover.

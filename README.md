# isystemsautomation.github.io

Corporate website of ISYSTEMS AUTOMATION S.R.L. — static build, served by
GitHub Pages at <https://www.isystemsautomation.com>.

Repository root = site root. No build step, no framework; plain HTML, CSS and
JavaScript, exported from the previous Joomla installation.

## Layout

| | |
|---|---|
| Pages | 19 + `404.html` |
| Assets | 129 (css / js / fonts / images) |
| Size | ~11 MB |
| External requests | `fonts.googleapis.com` (Poppins, Open Sans) |

URL structure is identical to the previous site, so inbound links and search
rankings are preserved:

```
/                                        /service.html
/company.html                            /service/process-automation.html
/contact.html                            /service/process-optimization-advanced-process-control.html
/industries.html                         /service/manufacturing-execution-system.html
/industries/power-generation.html        /service/safety-systems-burner-management-systems.html
/industries/oil-and-gas.html             /service/industrial-furniture-control-centers.html
/industries/cement-and-coal.html         /service/maintenance.html
/industries/control-centers.html
/industries/smart-home-automation.html   /power-plant-performance-calculation.html
                                         /virtual-power-plant.html
                                         /advanced-controllers-cfb-boiler.html
```

The last three were previously reachable only through query-string URLs and now
have proper paths; links on the home page point at the new locations.

## Deployment

This is the organization site (`<org>.github.io`), so it publishes at the root
of the domain. `Settings -> Pages -> Source: GitHub Actions`.
`CNAME` holds `www.isystemsautomation.com`.

`.github/workflows/pages.yml` runs a `guard` job before publishing: it greps the
tree for known injection markers and fails the deployment if any are found. Do
not remove it.

All asset paths are root-relative (`/templates/...`), so the site must be served
from the domain root, not a subdirectory.

> Setting a custom domain on the organization site makes that domain the default
> for every project site in the org that has no domain of its own. Project sites
> that need to stay on their own hostname must set it explicitly.

## Known gaps

- The contact form on `/contact.html` was a Joomla AJAX endpoint and is disabled
  (`action="#"`, `data-static-disabled="1"`). It needs an external handler —
  Formspree, a Cloudflare Worker, or similar. Until then the working contact
  path on that page is `mailto:office@isystemsautomation.com`.
- Site search and the tag listing (`/component/tags/`) were removed; those links
  now point at `/`.
- Cloudflare email obfuscation (`/cdn-cgi/l/email-protection`) was decoded back
  to plain `mailto:`, since the decoder script is not available off Cloudflare.

## Possible improvements

- Self-host the Google Fonts stylesheet and font files — currently the only
  outbound request, and a GDPR consideration.
- Minify the HTML: the Joomla markup is verbose, pages run 60-160 KB.
- Drop unused iconfont sets under `media/com_sppagebuilder/assets/iconfont/` —
  several dozen are shipped, only a handful are referenced.

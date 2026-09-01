# Replacement copy — "About HomeMaster" block on home-master.eu

Target: the "About HomeMaster" and "Open Source & Documentation" section on
the home page of www.home-master.eu. This is the HomeMaster shop, not the
ISYSTEMS corporate site — the copy lives in the Odoo product/page content.

## Why this is being rewritten

The current block says "European industrial automation company with 17+ years
of experience" and never names the company. The word ISYSTEMS appears zero
times on the entire home page. The only link to isystemsautomation.com is in
the footer.

That anonymity throws away the strongest trust signal the brand has. A buyer
looking at a DIN-rail module from an unfamiliar brand is asking one question:
is this a real manufacturer or a hobby project that will disappear? The answer
— it is made by a company that has been building refinery and power plant
control systems since 2007 — is on the page but unnamed.

Three further fixes: "17+ years" is a stale counter (founded 2007, so use the
founding year, not a number that ages); "industrial-grade reliability" is
asserted where it can now be evidenced; and the product's industrial traits
are listed as features rather than explained as consequences of who builds it.

Remove the 👉 emoji from the button.

---

## About HomeMaster

HomeMaster is made by **ISYSTEMS AUTOMATION S.R.L.**, an engineering company
in Ploiești, Romania, founded in 2007. Our other work is control systems for
power plants and refineries: distributed control systems, burner management
and safety instrumented systems, on Emerson Ovation, ABB, Siemens, Yokogawa
and HIMA platforms. One refinery CHP plant has been under our control systems
continuously since 2007.

HomeMaster is what happens when the people who do that build something for a
house.

### Why it is built this way

The design decisions below are not features chosen from a list. They are how
industrial control systems are built, applied to a building.

**Wired RS-485, not radio.** In a plant, a command that arrives sometimes is
a command that does not arrive. Modbus RTU over a wired bus is deterministic:
the same request takes the same time every time, and a failure is a failure
rather than a silence.

**Logic in the module, not in the cloud.** Every module runs its own logic and
keeps working with the network down, the controller off and the internet gone.
In a plant this is called fail-safe operation and it is not optional. In a
house it means the lights work when your router does not.

**Isolation designed for mains, not for a bench.** Opto-isolators rated at
8 kV, isolated DC/DC converters at 6 kV, reinforced insulation between the
mains side and the 24 V SELV bus, with creepage and clearance measured on the
assembled board.

**Documentation that lets you leave.** Open schematics, open firmware, the
full Modbus register map. Nothing here needs us to keep existing.

### Certified, not just claimed

Every product in the range carries a signed EU Declaration of Conformity.
Getting there took two rounds of testing and four months of engineering
between them.

- **EMC** — emissions and immunity tested at an ISO/IEC 17025 accredited
  laboratory: conducted and radiated emissions to EN 55032 Class B, RF
  immunity, EFT/burst and electrostatic discharge to EN 55035 and
  EN IEC 61000-4
- **LVD** — electrical safety to EN 62368-1 on our own bench under the
  manufacturer's declaration: dielectric strength, insulation resistance,
  touch current, temperature rise and single-fault conditions
- **RED** — for the Wi-Fi products
- **RoHS** — documented to EN IEC 63000

The full account, including what failed the first time and what we changed,
is published: **EU Compliance & Standards**.

The test capability we built for it is described on the parent company site:
**Compliance and Testing at ISYSTEMS AUTOMATION**
→ https://www.isystemsautomation.com/compliance.html

---

## Open Source & Documentation

All hardware and firmware are public:

- GitHub repository — firmware, schematics, examples
- ESPHome configurations, ready to use
- Modbus register maps and module configuration
- Home Assistant integration examples

Button: **View hardware, firmware and documentation on GitHub**

---

## Notes for whoever applies this

- The two links that matter are the one to
  https://www.isystemsautomation.com/compliance.html and the existing internal
  link to the EU Compliance & Standards article. Both belong in the body text,
  not only in the footer.
- Consider adding the ISYSTEMS name to the page footer as "HomeMaster is a
  brand of ISYSTEMS AUTOMATION S.R.L., Ploiești, Romania" with company
  registration and VAT number, the same way the corporate site does it. An
  anonymous webshop selling mains-connected hardware into the EU reads badly
  to anyone who checks.
- Do not reintroduce a years-of-experience counter. Use "founded in 2007".

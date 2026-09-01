# Source copy for /compliance.html

This file is the source text for the Compliance and Testing page. It is not
published as-is; an agent converts it to HTML in the site template. Edit here,
then regenerate the page, so the two never drift apart.

Headings marked `##` become `h2`, `###` become `h3`.

---

## We went through this ourselves

ISYSTEMS AUTOMATION is not a test laboratory. We are a manufacturer that had to
get eleven products through EU conformity assessment, and built the test
capability to do it.

The first round did not go well. Early-revision boards came back with a
punch-list: resets under fast transients on one module, lamp flicker on the
dimmer, analog input deviations under conducted RF, a manual restart needed
after electrostatic discharge to a USB shell, and a dielectric breakdown on a
relay-to-SELV barrier.

Four months of engineering followed. Opto-isolators went from 2.5 kV to 8 kV.
Isolated DC/DC converters went from 1.5 kV to 6 kV. Creepage and clearance were
widened between SELV and mains-related circuitry. Common-mode chokes went onto
the dimmer AC path, ferrite beads with RC damping onto every LED output, a
GND / GND_USB split into the USB-C path, ferrite and LC filtering onto the 24 V
input of every module. Relay coil and logic supply rails were separated. The
cable specification in the manual changed to shielded RS-485 and shielded
analog.

The second round came back clean. Eleven EU Declarations of Conformity are
issued and the hardware ships.

Everything on this page comes out of that. We are selling the route, not the
chamber.

### One test that is worth describing

During the first electric-strength pass, a sample broke down at about 2.1 kV on
the relay-to-SELV barrier, and failed again on retest at a lower threshold. It
turned out to be the very first PCB revision — an early prototype with a known
issue around the relay output area, never released into production. It was
quarantined, labelled, and the test repeated on the production-revision board,
which passed the reinforced-insulation requirement.

The lesson went into the process: every test record we write names the PCB
revision it was performed on. A result that does not name its revision is not a
result. It is the most common way a compliance file quietly becomes worthless.

---

## What we can do for you

### Route planning: which directives, which standards

The first thing that goes wrong is scope. Products get declared under the wrong
directive, or a directive gets missed entirely.

Two cases we see repeatedly:

A product runs entirely on SELV and the manufacturer concludes the Low Voltage
Directive does not apply. But its relay contacts can switch user-supplied
250 V AC. That brings it into LVD scope. Of our own eleven products, nine are in
scope and only two are outside — and several of those nine have no mains input
at all.

A product has Wi-Fi. Under the Low Voltage Directive and the EMC Directive the
manufacturer self-declares and no notified body exists or is required. Under the
Radio Equipment Directive that is only true if the harmonised standards are
applied in full. Otherwise a notified body is mandatory. The three routes are
not the same route.

We establish which directives apply, which harmonised standards give presumption
of conformity, and which conformity assessment module you are actually on,
before any money goes into testing.

### Electrical safety testing to EN 62368-1

Directive 2014/35/EU is assessed under Module A: the manufacturer performs the
conformity assessment and signs the declaration. What the directive requires is
that the testing behind that signature is real.

We run the following on our bench:

**Electric strength, clause 5.4.9.** Dielectric strength across every isolation
barrier between mains-side and SELV circuits, at the reinforced-insulation test
level, 60 s.

**Insulation resistance, clause 5.4.10.** 500 V DC for 60 s across the same
barriers, against the reinforced-insulation minimum.

**Touch current, clause 5.7.** At 1.06 times rated mains voltage, both
polarities, at every accessible terminal, against the 0.25 mA r.m.s. limit.

**Temperature rise, clauses 5.4.1.4 and 9.** Components instrumented with K-type
thermocouples, equipment in worst-case operating mode, measurements stabilised
over one hour and corrected to rated ambient per Annex B.3. Assessed against the
lower of the component datasheet maximum and the Table 9 limit — which is the
part people skip, and it is usually the datasheet that governs.

**Single-fault conditions, Annex B.4.** Defined faults applied one at a time:
supply short, output short, load short, over-voltage on inputs, watchdog
disabled, mains over-voltage transient. Checking that no fire, no electric shock
hazard and no hazardous energy at an accessible terminal results.

**Creepage and clearance, clause 5.4.2.** Each insulation path measured on the
assembled board against Tables 11 and 14 for the applicable working voltage,
overvoltage category, pollution degree and material group. Measured on the
board, not read off the layout file — they differ more often than you would
like.

You get a written report per test, naming the PCB revision. Findings are design
findings: which barrier is weak, which path is short, which component runs hot
in which operating mode.

### EMC screening and design review

Our emissions equipment is a handheld spectrum analyser with near-field probes.
That is not a calibrated EMI receiver, and we do not report absolute levels
against limit lines from it. Anyone who tells you a probe set substitutes for a
chamber is selling you something.

What it does well is find the source and prove the fix:

- Locating the origin of an emission on a populated board
- Before-and-after comparison across a design change
- Confirming that a filter, a ferrite or a ground rework did what it was meant
  to do

Where you already hold a failure report from an accredited laboratory, we work
from it directly. A report tells you which frequency failed and by how much. It
does not tell you which loop on your board is radiating. That translation is the
work, and it is what we spent four months doing on our own hardware.

### Technical file and Declaration of Conformity

Risk assessment, test records, design documentation and the declaration itself,
assembled to survive a market surveillance request rather than to fill a folder.

Structured so each certified hardware revision is tied to a controlled PCB
revision identifier and archived manufacturing files, and every declaration
names the hardware revision the assessment was performed on.

### Cyber Resilience Act readiness

Regulation (EU) 2024/2847 obliges manufacturers of products with digital
elements to report an actively exploited vulnerability within 24 hours of
becoming aware of it, and to file a full notification within 72. The reporting
obligations apply from 11 September 2026.

The clock starts at awareness, not at confirmation. Most manufacturers we speak
to have no mechanism that could meet 24 hours, and no record of when awareness
began — which is the first thing an authority asks.

We built and operate this for our own line, and set the same up for others:

- Named reporting officer and deputy, with authority to file
- The awareness timestamp, and where it is recorded
- Internal deadlines tighter than the regulatory ones, with reserve
- Incident register: what is logged, and for how long
- CycloneDX SBOM generated in CI on every build, held in the technical file
- Monthly reconciliation against published vulnerability sources
- Coordinated disclosure policy and a security contact that is monitored
- The distinction that saves you work: a vulnerability reported by a researcher
  and not being exploited is not notifiable under Article 14

---

## What we are not

We are not accredited to ISO/IEC 17025, we are not a certification body and we
are not a notified body. We do not issue certificates.

Our reports do not replace testing at an accredited laboratory where your
conformity assessment route requires it. Where accredited testing is needed, we
prepare the hardware and the documentation for it — which is what determines
whether that round passes.

If someone offers you certification from a non-accredited lab, that is the point
to stop the conversation.

---

## Equipment

| Instrument | Used for |
|---|---|
| GW Instek GPT-9804 hi-pot and insulation resistance tester | Electric strength, insulation resistance |
| Programmable AC source | Rated and over-voltage conditions, touch current |
| Calibrated true-RMS multimeter with K-type thermocouple probes | Temperature rise, electrical measurement |
| Calibrated calliper and creepage gauge | Creepage and clearance on assembled boards |
| Handheld spectrum analyser with near-field probes | Emission source location, before-and-after comparison |

Measuring instruments are calibrated with traceability to ISO/IEC 17025.

---

## Standards and legislation

| Reference | Scope |
|---|---|
| EN 62368-1:2020+A11:2020 | Electrical safety, audio/video and IT equipment |
| EN 55032 / EN 55035 | Emissions and immunity, multimedia equipment |
| EN IEC 61000-4-2 / -3 / -4 / -6 | ESD, radiated RF, EFT/burst and conducted RF immunity |
| EN IEC 63000 | Technical documentation for RoHS |
| Directive 2014/35/EU | Low Voltage |
| Directive 2014/30/EU | Electromagnetic Compatibility |
| Directive 2014/53/EU | Radio Equipment |
| Regulation (EU) 2024/2847 | Cyber Resilience Act |

---

## How it starts

Send us what you have: the schematic, the layout, a photograph of the assembled
board, and whatever compliance documentation exists — including a failure report
if you have one.

We come back with which directives apply, which standards apply, what we can
test on our bench, what has to go to an accredited laboratory, and what it will
take. That assessment is a fixed fee and it is deducted from the work if you
proceed.

office@isystemsautomation.com

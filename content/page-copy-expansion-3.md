# Addendum 3 — project record from the client recommendation letter

Sourced from a signed recommendation letter by the General Manager of the
refinery CHP operator, plus the plant scheme annexed to it. Everything below
is evidence-backed and can be substantiated on request.

Client naming convention: sites operated by sanctioned entities are described
by plant type and location, not by brand. The recommendation letter itself is
supplied on request, not published. Named clients elsewhere on the site
(Dalkia Termo Prahova, Nuclearelectrica, Azomureș, TIAB) stay named.

Apply with `page-copy-expansion.md` and `page-copy-expansion-2.md`.

> **The project list is NOT in this file.** It lives only in
> `page-copy-expansion-5.md`, as a four-column table. An earlier revision of
> this file carried the same projects as a bullet list, and applying both
> files kept overwriting the table with the list. The list has been deleted
> from here. Never render the project list as `<ul>`. If you find a bullet
> list under the "Project list" heading on references.html, it is a
> regression — replace it with the table from file 5.

---

# PAGE: /references.html — replace only the "The plant we know best" section

## The plant we know best

Most of the work below was carried out at one industrial CHP plant supplying
a refinery in Ploiești, Romania, continuously from 2007 to 2018 and again
from 2022.

The plant: three steam boilers of 120 t/h and one circulating fluidized bed
boiler of 260 t/h at 100 bar; three steam turbines of 12 MW and one of 30 MW;
steam headers at 100, 35, 16, 6 and 1.2 bar with reducing stations between
them. Fuels are natural gas, refinery gas and petroleum coke. The refinery
takes steam from four headers and electricity from the plant. A photovoltaic
park and a wind farm are dispatched together with it.

Knowing a plant for eleven years is a different kind of engineering from
delivering a project to it. Nothing below was handed over and forgotten.

The section that follows it — "Project list" — comes from
`page-copy-expansion-5.md` and is a table. Do not edit it from this file.

---

# PAGE: /industries/power-generation.html — add one new h2 section after
# "Island mode operation and load rejection"

## Grid code compliance and system operator interface

A generating plant is only connected as long as it answers to the system
operator on the operator's terms. We implement that interface.

- Active and reactive power setpoint control from dispatch
- Reporting to the transmission system operator over IEC 60870-5-101
- Reporting to the market operator over IEC 60870-5-104
- Telecontrol over four redundant communication channels, so the loss of one
  path does not interrupt control or data transfer
- Primary and secondary frequency control, with the response measured at
  acceptance rather than assumed
- Resynchronisation after islanded operation

We have delivered this for conventional plant, for a photovoltaic park and
for a wind farm dispatched as one balancing group.

---

# PAGE: /industries/power-generation.html — add one new h2 section after
# "Automatic boiler start-up"

## Plant-wide protection

Protection logic implemented across a whole station rather than machine by
machine: four turbines, four boilers and the auxiliary equipment, so that a
trip on one item takes the correct action on the rest instead of cascading.

---

# PAGE: /acceptance-testing.html — add one h2 section before
# "Platforms we have tested on"

## Independent expert review

We are also asked to review someone else's test results. In one case a
completed functional test protocol for a turbogenerator — turbine governor
behaviour, generation balancing, automatic synchronisation and 6.3 kV
automatic transfer switching — was given to us for expert review, to
establish what had not been demonstrated and where the conclusions did not
follow from the measurements.

A test report is evidence only if the tests behind it prove what the report
claims. Reading one properly is a separate skill from running one.

---

# PAGE: /service/process-optimization-advanced-process-control.html —
# add after "What we actually control"

## Delivered as named optimisers

On four boilers of one plant we implemented, as a set:

- Performance monitoring system
- Combustion optimiser
- Steam temperature and pressure optimiser
- Fuel optimiser
- SOx and NOx emission optimiser

They run together against a real-time optimisation target rather than as
independent loops, with plant coordinated control above them setting the
load.

---

# PAGE: /service/industrial-furniture-control-centers.html — add at the top,
# before the existing content

## Control rooms we have built

Three control rooms designed and built for one industrial power plant: a
plant control room in 2011, a central control room in 2015, and operator
console panels supplied in 2010. All three are in continuous operation.

---

# IMAGES — new, extracted from the client recommendation annexes

Four photographs of control rooms designed and built by ISYSTEMS AUTOMATION.
Supplied separately as controlrooms.tar.gz.

  control-room-power-plant-operators.jpg
      Power plant control room, operators at consoles
  control-room-power-plant-videowall.jpg
      Power plant control room with overview video wall
  central-control-room-consoles.jpg
      Central control room, operator consoles and overview displays
  central-control-room-in-use.jpg
      Central control room in use
      NOTE: client branding is legible on the operators' clothing in this
      one. Do not publish it while the naming convention above is in force.

Use the first three:
  /service/industrial-furniture-control-centers.html — all three
  /industries/control-centers.html — control-room-power-plant-videowall.jpg
  /references.html — central-control-room-consoles.jpg in the gallery

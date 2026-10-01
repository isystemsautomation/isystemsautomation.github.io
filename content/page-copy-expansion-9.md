# Addendum 9 — hydro power

Source material: the hydro project archive. Three ISYSTEMS projects, newest
first:

1. **Belorechensk hydroelectric power plant** — unit control system
   commissioning, periodic maintenance, and a vibration and overspeed
   protection upgrade. 2019–2021.
2. **Small hydro plant on the Beshenka river, Krasnaya Polyana** — a complete
   control system delivered from specification through commissioning and
   witnessed testing, operated unattended over telecontrol. 2020–2021.
3. **Single remote control centre for a cascade** — concept design and
   specification for operating four hydro plants and a photovoltaic station
   from one control room. **Taken to concept and specification. Not built.**
   It belongs on the site as experience, and it must be described honestly as
   a concept, never implied to be an operating installation.

## Rules that apply to everything in this file

- No client names anywhere. No country names in project descriptions —
  **cities stay** (Belorechensk, Krasnaya Polyana are fine; "Russia" is not).
- No personnel names, no contract values, no prices, no contract numbers.
- The project list on `/references.html` is a **table**, never a `<ul>`. It
  lives in `content/page-copy-expansion-5.md`. Do not reintroduce a bullet
  version of it from any older file.
- Meta descriptions stay at or under 160 characters.
- One `<h1>` per page, no `<h2>` that merely restates the `<h1>`, every
  `<img>` has a real `alt`, no skipped heading levels.
- Do not add any image that is not already in `src/assets/img/`. If no
  existing photograph fits a new section, ship it without one.

---

# PAGE 1 — /references.html

## 1a. Replace the two existing hydro rows

Find these two rows in the project table in
`content/page-copy-expansion-5.md` and replace them.

**Remove:**

```
| 2020–2021 | Hydroelectric power plant, Krasnaya Polyana · hydro turbine control | Siemens S7-300 / S7-1500 / S7-1200, TIA Portal | |
| 2019 | Hydroelectric power plant, Belorechensk · hydro turbine control | Yokogawa Centum VP | |
```

**Insert in their place** (keep the newest-first ordering of the table —
these two sit between the 2019–2021 Pančevo rows and the 2018–2019 sludge
dosing row):

```
| 2020–2021 | Small hydro plant on the Beshenka river, Krasnaya Polyana · complete control system | Siemens S7-300 with WinCC | 0.95 MW Pelton unit with two nozzles and a deflector. Specification, design documentation, cabinet build, field instrumentation, commissioning and witnessed testing. Operated unattended from a control room at another plant in the group over four redundant encrypted channels on IEC 60870-5-104 |
| 2019–2021 | Hydroelectric power plant, Belorechensk · unit control commissioning, maintenance and protection upgrade | Yokogawa Centum VP; Siemens S7-1500 for vibration | Commissioning of the unit 3 control system. Periodic maintenance with two engineers on site for a week each quarter, including load rejection and isolated-district testing of the frequency and power controller. Shaft speed transducers and vibration transducers added, with an overspeed trip at 160 % of rated speed brought into the protection scheme |
```

Note the platform correction: the Siemens S7-1500 belongs to the Belorechensk
vibration system, not to the Krasnaya Polyana unit, which is S7-300 with
WinCC. The current table has this the wrong way round.

## 1b. Add one row for the control centre concept

Insert as a 2021 row, so it sits above the two rows above:

```
| 2021 | Cascade of four hydro plants and a photovoltaic station · single remote control centre | Concept and specification | Concept design and scope definition for operating a whole generating group from one control room: communication architecture to each site, MES and archive servers, engineering stations, changes required at each plant, video surveillance and autonomous drone inspection. Taken to concept and specification; not built |
```

The phrase **"Taken to concept and specification; not built"** is not
optional. It stays exactly as written.

---

# PAGE 2 — /hydro-turbine-control.html

The page already covers unit control, protection voting, failure-mode testing
and telecontrol. Four things are missing, and they are the strongest material
we have.

## 2a. New section, after "Protection design and voting"

### Load rejection, measured

A governor is only as good as its worst rejection. On the Pelton unit above
we ran a staged load rejection programme on the running machine, with the
generator breaker opened by hand at the switchgear at each step and six
people stationed around the plant recording a different parameter.

| Rejected load | Peak speed | Penstock pressure, peak | Oil pressure unit, minimum |
|---|---|---|---|
| 0.10 MW | 514 rpm | 21 MPa | 22.5 MPa |
| 0.15 MW | 560 rpm | 20 MPa | 23 MPa |
| 0.25 MW | 500 rpm | — | 23.5 MPa |
| 0.45 MW | 596 rpm | 21.5 MPa | 24 MPa |
| 0.95 MW | — | 21 MPa | 24 MPa |

Standing pressure in the penstock was 19 MPa, and the rejections pushed it to
21.5 MPa and pulled it down to 16 MPa on the rebound. The deflector servomotor
closed in 2 seconds; the nozzle needles took up to 20.

The number that matters is 596 rpm against an overspeed trip set at 600. Four
revolutions per minute of margin, measured rather than calculated, on a
machine that had to stay in service. After every step the penstock expansion
joints were walked and inspected, and a man watched the vacuum breaker valve
at anchor block 31 and logged every time it lifted.

We also took the load characteristic the same day, so that the relationship
between cylinder position and output was a measurement and not an assumption:
86 % travel produced 130 kW, 90 % produced 400 kW, 95 % produced 950 kW. The
curve is steep in the middle, which is exactly where a load controller tuned
on paper gets into trouble.

## 2b. Replace the "Telecontrol and remote operation" section

Keep the existing text about breaking channels one at a time — it is good —
and put this in front of it.

### Telecontrol and remote operation

The unit is operated from a control room at another plant in the group. There
is no operator in the machine hall. That single decision drives most of the
architecture.

The link is four redundant encrypted channels — two terrestrial internet
providers, a satellite link and GSM — carrying IEC 60870-5-104, with a
communication controller at each end handling load distribution and failover.
Start and stop, load setpoint, the daily load schedule and the choice of
control algorithm are permitted from the remote station. **Every other command
is refused and filtered in the communication controller.** A remote operator
cannot reach into the unit and move something that was not on the list, which
is a cheaper and more durable protection than any amount of network
segmentation.

Links of this kind fail in ways that are not obvious. On this plant the GSM
channel dropped periodically while the modem still reported a healthy signal
from the base station and sat there for 30 to 120 minutes until it was
power-cycled. That is not a channel that redundancy testing finds; it is one
that a trend over ten days finds. We raised it with the operator rather than
papering over it with an automatic modem reset.

*(then the existing paragraphs about disconnecting channels and about total
loss of link)*

## 2c. New section, after telecontrol

### Watching the civil works, not just the machine

On a hydro plant the dam, the intake and the penstock fail more slowly than
the unit does, and more expensively. The instrumentation that watches them
belongs in the same system:

- Piezometer boreholes in the dam, read continuously rather than walked
  monthly with a dip meter.
- Radar level in the settling basin, brought back to the unit cabinet over
  fibre, driving a control loop that holds headwater level by moving the
  unit's load. The machine follows the water rather than the water being
  managed around the machine.
- Water level at the intake, and automatic control of the bypass and
  spill valves.
- An autonomous drone with its own charging station and weather station,
  flying a fixed route on a schedule with no operator present, and uploading
  to the archive server automatically.
- Process video, with motion detection raising an alert at the remote control
  room.

All of it feeds a plant performance and condition subsystem that computes
running hours, assesses equipment condition and produces maintenance
recommendations, with an interface into the owner's maintenance management
system.

## 2d. New section, at the end before "Related"

### Starting a cold machine

A governor commissioned on warm oil behaves differently on cold oil, and an
unattended plant has no one present to notice. Before a cold start the drain
tank is heated for hours, then the hydraulic cylinder is cycled through full
travel with holds at each end to push warm oil through the regulating system.
That sequence is an algorithm in the control system, not a line in an
operating instruction, because there is nobody there to follow the
instruction.

Remote start was proven as its own test programme, as was the behaviour of
the unit through a controller restart — what the machine does while the
controller is down, and what it does as the controller comes back and finds
the plant in a state it did not leave it in.

## 2e. Update the page meta

```
description: "Pelton nozzle and deflector control, protection voting, measured load rejection results, unattended operation over four redundant IEC 60870-5-104 channels."
```

(155 characters.)

---

# PAGE 3 — new page: /hydro-remote-operations.html

A page about operating hydro plants without staff on site, and about the
concept study for running a whole group from one room. It should link from
`/hydro-turbine-control.html`, from `/industries/control-centers.html` and
from `/virtual-power-plant.html`.

```
title: Remote Operation of Unattended Hydro Plants | ISYSTEMS
permalink: /hydro-remote-operations.html
description: "Unattended hydro plants operated over redundant telecontrol, and a concept for running a cascade of hydro plants and a photovoltaic station from one room."
```

## H1

Remote Operation of Unattended Hydro Plants

## Lead

Small hydro plants are expensive to staff and cheap to run. The economics push
towards nobody on site, and the engineering has to catch up with that: every
decision an absent operator would have made has to be either an algorithm, a
designed failure response, or an accepted risk that somebody has written down.

We have built one such plant and operated it remotely, and we have taken the
next step — a whole generating group from one room — to concept and
specification.

## Section: What an unattended plant has to decide for itself

- What it does when the link to the control room is lost entirely, and for
  how long it is allowed to keep running without one.
- What it does when the controller restarts and finds the machine in a state
  it did not leave it in.
- How it starts from cold when nobody is there to warm the oil system by hand.
- Which remote commands are permitted at all, and what happens to the rest.
- How the headwater is managed when inflow changes and no one is watching the
  basin.

These are the questions we answer in design. The telecontrol architecture, the
command filtering and the cold-start algorithm are described under
<a href="/hydro-turbine-control.html">Hydro Turbine Control and Protection</a>.

## Section: One control room for a whole group

*(This section must be explicit that the work stopped at concept and
specification.)*

We were asked to work out what it would take to operate four hydro plants and
a photovoltaic station from a single control room, and produced the concept
and the specification for it. The study was not taken through to
construction.

What the study covered:

**At the control room.** Archive and calculation servers, operator and
engineering stations, communication equipment, the MES layer and its
interface to the owner's maintenance management system, and video walls and
surveillance.

**At each plant, graded by what was already there.** Two of the sites needed
new unit and electrical control, local control panels, instrumentation, cable
routes, changes to existing valve and drive assemblies, changes to the 6 kV
switchgear cells, modification of the electro-hydraulic turbine control, and
vibration and overspeed protection. The other two already had modern unit
control and needed only communication equipment, digital and hard-wired links
for start, stop and setpoints, and extensions to the auxiliary and drainage
drive assemblies.

**At the photovoltaic station.** Changes to the existing system to export data
and accept setpoints, communications equipment, and configuration at the
dispatching end — with a frank note in the study that the installed SCADA was
old enough that an upgrade or replacement would probably be needed to retain
local control and local archiving.

**What was deliberately excluded.** Civil works, control room furnishing and
display walls, new electrical equipment and new drive assemblies. A concept
study that quietly includes everything is not a concept study; it is a wish.

The same architecture — several sites dispatched as one — is what we built
and ran for seven years on a CHP plant, a photovoltaic station and a wind
farm, described under
<a href="/virtual-power-plant.html">Virtual Power Plant</a>.

## Section: Related

Links to /hydro-turbine-control.html, /industries/control-centers.html,
/virtual-power-plant.html, /cybersecurity.html.

---

# PAGE 4 — /cybersecurity.html

Add one section, after "Telecontrol links are part of the plant".

## Section: Regulator-facing security assessment

Classifying an operational technology system against a national critical
infrastructure regime is paperwork with teeth: the categorisation decides
what the operator then has to do for the life of the plant, and it is
submitted to a regulator who can disagree.

We have prepared that dossier for the control system of a hydro plant —
system purpose and architecture, the networks it touches and how, the
hardware and software inventory down to controller and operating system
level, which protection mechanisms are in place, the attacker categories
considered and why, the threats assessed as applicable, the types of computer
incident the system could suffer, and the significance criteria with the
reasoning behind each value.

The regime was not the EU one, but the exercise is the same one an operator
faces under NIS2 and the same inventory an IEC 62443 assessment starts from.
Having done it on an operating plant is the difference between describing the
method and having defended the answers.

Also add to the existing "Telecontrol links are part of the plant" section,
as a new paragraph after "Redundancy proved by failure":

**Command filtering at the edge.** On the unattended hydro plant we operate
remotely, the remote station may start and stop the unit, set load, load the
daily schedule and select the control algorithm. Every other command is
rejected in the communication controller at the plant end. A whitelist in the
controller that terminates the link is worth more than a firewall rule
somewhere upstream, because it survives a compromise of everything above it.

---

# PAGE 5 — /service/maintenance.html

Add a section. The point it makes — that maintenance on a generating plant is
a test programme, not an inspection round — is one of our strongest and the
page does not currently make it.

## Section: Maintenance on a generating plant is a test programme

An inspection round tells you that a system looks healthy. On a generating
plant that is not enough, because the functions that matter are the ones that
have not run since the last time anybody made them run.

On the hydro plant we maintain, each quarterly visit puts two engineers on
site for a week, and the programme includes proving, on the running or
shutdown machine as appropriate:

- the emergency shutdown chain, including the shield release command
- the shutdown sequences, step by step
- overspeed protection
- compliance with the governing guarantees, by load rejection
- the power controller while synchronised to the grid
- the frequency and power controller, by load rejection
- **the frequency and power controller with the plant transferred to an
  isolated district**

Alongside that, the things that are only discovered by measuring them: battery
capacity in the uninterruptible supplies, proved by running them down for at
least 30 minutes rather than reading a status lamp; the stored-energy
cabinets that close the guide vanes when everything else is gone; failover of
the redundant control network and the redundant supply, proved by breaking
each; time synchronisation across the system against the GPS reference; and a
restore from backup that is actually performed.

Where a failure stops the machine or breaks the exchange of data with the
system operator, we are on site within 24 hours of the notification.

Island mode and the testing behind it are covered under
<a href="/island-mode/">Island Mode Operation</a>.

---

# PAGE 6 — /island-mode/

The island mode page is currently all thermal. Add a short section so that it
covers hydro, because hydro islanding is a different problem and the page
ranks for the term.

## Section: Islanding a hydro unit

A hydro machine entering an island has the opposite problem to a turbogenerator.
A steam turbine has stored energy in the boiler and can hold frequency while
the fuel system catches up; a hydro unit has a water column that resists being
accelerated and a governor that cannot be allowed to act as fast as the
frequency error asks it to, because the penstock will not take the pressure
transient.

That trade-off is why islanding work on hydro starts with load rejection
measurements rather than with controller tuning. The measured relationship
between rejected load, speed rise and penstock pressure sets the fastest
governor response the machine can survive, and the island's frequency
performance follows from that, not the other way round.

On the hydro plants we maintain, transferring the frequency and power
controller to an isolated district is a tested function in the periodic
programme, not a theoretical capability.

Link from here to /hydro-turbine-control.html.

# Addendum 10 — turbine types and governing systems

Companion to `content/page-copy-expansion-9.md`. Where addendum 9 adds the
projects, this one adds the thing a hydro buyer actually looks for: **which
machine types we have worked on, and which kind of governing and actuation
system.** Those two axes are what distinguishes a hydro integrator from a
general automation house, and the site currently says almost nothing about
either.

All figures below come from plant documentation. Do not round them, do not
invent any that are not here, and do not add a machine type or a governing
system that is not listed.

The same naming rules as addendum 9 apply: no client names, no country names,
cities only.

---

# PAGE — /hydro-turbine-control.html

Two new sections. They go immediately after the lead paragraph and before
"Unit control", because they are what a visitor scans for first.

## Section A — Turbine types

### Machines we have worked on

Hydro is not one discipline. A Pelton wheel, a Kaplan runner and a Francis
runner fail differently, are regulated differently and need different things
from a control system. The experience below is by machine type.

#### Pelton — impulse machines

Horizontal Pelton unit, two nozzles with needle control and a deflector
ahead of them. The control problem is nozzle staging — the second nozzle
brought in at a defined opening of the first — plus deflector timing, which
is what actually protects the penstock, because the deflector can cut the jet
in seconds while the needles take twenty.

Measured on the machine: deflector servomotor closing in 2 seconds over its
full 190 mm travel; needle travel of 60 mm taking 36 seconds to close and 9
to open; peak speed of 596 rpm on a full rejection against a 600 rpm trip.
The load characteristic is strongly non-linear — 86 % of cylinder travel gave
130 kW, 95 % gave 950 kW — which is the part a controller tuned on paper gets
wrong.

#### Kaplan — double-regulated propeller machines

Double regulation means the wicket gates and the runner blades move together
on a programmed relationship — the combinator — and the control system owns
that relationship. Large and small machines of this family behave nothing
alike:

| | Large unit | Small unit |
|---|---|---|
| Runner diameter | 6.6 m | 2.25 m |
| Output | 40–50 MW | 4.2 MW |
| Rated head | 17.5 m, range to 24.5 m | 16.5 m |
| Speed | 88.3 rpm | 250 rpm |
| Flow at rated output | 277 m³/s | 30.4 m³/s |
| Wicket gate closing time | 14 s | 3 s |
| Blade travel time | 45–50 s | 15 s |
| Runaway speed | 180 rpm | 600 rpm |
| Speed rise on full rejection | 127 rpm, measured | 315 rpm, measured |

Permanent droop is set at 4 %, adjustable between 0 and 6 %. Overspeed is
caught by a mechanical centrifugal switch at 155 % of rated speed, which on
the large machine is 137 rpm — a reminder that on a slow machine the
protection setting is a number no electronic tachometer would find
remarkable.

The fourteen-second gate closing time on the large unit is the whole design
in one figure. It cannot be made faster, because the water column will not
allow it, so everything downstream — droop, the island-mode response, what
the machine can be asked to do for the grid — follows from it.

#### Francis and other vertical reactive machines

Vertical machine with a spiral case, wicket gates, turbine cover, thrust
bearing and upper and lower brackets. The instrumentation set is different
again: twelve stator winding points and twelve core points, twelve thrust
bearing pads, four points on each guide bearing, shaft seal temperature,
water level on the turbine cover, differential pressure across the
components, spiral case pressure, and absolute vibration and shaft runout on
both brackets.

Representative settings from a unit we maintain: stator winding and core trip
at 120 °C with one-out-of-twelve voting and alarm at 110 °C; guide bearing
and thrust pads trip at 70 °C, alarm at 65 °C; turbine guide bearing at 65 °C
with its oil bath at 55 °C; shaft seal at 40 °C; bracket absolute vibration
alarm at 90 µm and trip at 100 µm; shaft runout trip at 6 mm; spiral case
pressure trip at 0.72 MPa; water level on the turbine cover at 191 mm with a
2-second delay. Overspeed, measured as shaft frequency, trips at 160 % of
rated. Below 15 Hz for 60 seconds the gates are driven closed and the brakes
applied.

The sensor-failure logic is as interesting as the trip settings. A single
failed stator sensor raises an alarm; four failed sensors out of a group of
four, or all twelve, trip the unit. A protection scheme that trusts a
measurement it can no longer make is worse than one that admits it is blind.

## Section B — Governing and actuation

### Governing systems, from oil to all-electric

A hydro governor can be built four or five different ways, and the
differences matter far more than the brand of controller sitting above them.
We have worked across the range.

**Classical oil-hydraulic.** An accumulator unit at 20 kgf/cm², duty and
standby pumps cycling on contact gauges with a run-to-rest ratio around 1:15
to 1:25, a relief valve at 21–22 kgf/cm², standby pump start at 16 kgf/cm²
with a warning, and a shutdown on low accumulator pressure at 12 kgf/cm².
Sump level watched by float, with start inhibited below 50 mm. Everything
about this architecture assumes somebody is in the machine hall reading a
sight glass, and converting it to unattended operation is most of the work.

**Electro-hydraulic on wicket gates.** The governor acts through a
distributor block onto the gate servomotors. Gate position is the controlled
variable and the hydraulic system is the actuator, with all that implies for
response time and for what happens when oil pressure is lost.

**Electro-hydraulic on Pelton nozzles.** The same idea applied to needle and
deflector cylinders — but with two independently staged nozzles and a
deflector that has its own, much faster, closing path. We supervise spool
position against the controller's demand and trip on a mismatch of more than
2 % held for 2 seconds, which catches a sticking spool before it becomes a
runaway.

**All-electric wicket gate drive.** Gates driven by electric actuators
through frequency converters, with no oil pressure system at all. The
converters are supervised at both 380 V and 364 V, and a stored-energy
cabinet holds enough charge to close the gates when the supply is gone —
alarmed below 300 V, because a stored-energy cabinet that is quietly flat is
the same thing as no gate closure at all. On a plant like this, proving the
stored-energy capacity is a maintenance task of the same weight as proving a
UPS battery.

**Electric linear actuators for modulating duty.** Self-locking linear
actuators with stepper or brushless DC motors, up to 15 kN and 85 mm of
stroke, EN ISO 5210 F05 and F07 valve attachment, electronic torque or travel
seating, rated for continuous modulating duty at up to 1,200 starts per hour.
These are what replaces a small hydraulic positioner when the machine is
small enough and the oil system is not worth keeping.

### Retrofits we have designed

**Distributor block replaced by a proportional servo valve.** A two-stage
pilot-operated proportional directional valve with integrated electronics and
electrical position feedback of the main spool, rated to 350 bar, mounted to
ISO 4401, with a spring-centred main spool. The gain is not only resolution —
it is that the spool position becomes a measurement the control system can
supervise, instead of a mechanical state nobody can see.

**Making loss of cabinet power a safe state.** On one unit the start/stop
mechanism used two solenoids, pulsed, with a mechanical latch holding the
block in whichever state it had last been driven to. Losing the control
cabinet's supply therefore left the machine exactly where it was. We
specified the replacement: one spring-loaded solenoid, energised to arm and
to admit oil to the main spool, so that removing power lets the spring drive
the spool to its safe position and close the main cylinder and the nozzles.
A protection function implemented in a spring is a protection function that
does not need the controller to be alive.

**Overspeed and vibration added to an existing protection scheme.** Shaft
speed sensors wired to speed transducers with their relay setpoints at 160 %
of rated speed, taken into the trip scheme and onto the shield release; an
unused fourth speed sensor cabled in and brought into service; vibration
transducers added and collected by a separate controller whose analogue
outputs feed the unit control system, with the protection logic changed to
use them.

**Gate drive condition made visible.** Converter supply monitoring, guide
bearing and seal temperatures, shaft runout and absolute vibration on both
brackets brought into the same system as the governor, so that the thing
regulating the machine and the thing watching the machine are not two
separate projects.

---

# Where else this material belongs

**`/references.html`** — in the row for the Pelton plant, after "0.95 MW
Pelton unit with two nozzles and a deflector", the sentence about replacing
the distributor block with a proportional servo valve can be added if the
Detail column is not already too long. Judgement call; do not let the cell
run past about 400 characters.

**`/service.html`** and **`/industries/power-generation.html`** — one line
each, naming the machine types, so that a visitor landing on a service page
learns we do hydro at all:

> Hydro: Pelton, Kaplan and vertical reactive machines; oil-hydraulic,
> electro-hydraulic and all-electric governing.

**`/island-mode/`** — the hydro section specified in addendum 9 should cite
the fourteen-second gate closing time as the concrete reason a hydro unit
cannot be asked for the frequency response a turbogenerator gives.

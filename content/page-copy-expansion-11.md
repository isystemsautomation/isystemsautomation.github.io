# Addendum 11 — vibration on slow machines, and governor structure

Third companion file, after addenda 9 and 10. Two subjects, both of which
separate someone who has worked on hydro from someone who has worked on
turbines in general:

1. **Why vibration monitoring on a hydro unit is a different instrument set
   from a steam or gas turbine**, and what is actually measured.
2. **The governor is not one controller.** It is several, and the interesting
   engineering is in which one is in charge and how the machine moves between
   them — plus what a wide head range does to all of it.

Same naming rules as addenda 9 and 10: no client names, no country names,
cities only, no prices, no contract numbers.

---

# PAGE — /hydro-turbine-control.html

Two new sections, placed after "Governing systems, from oil to all-electric"
from addendum 10.

## Section C — Vibration and shaft monitoring

### Why a hydro unit needs different instruments

A gas turbine runs at 3,000 or 3,600 rpm — 50 or 60 Hz of shaft rotation —
and a large hydro unit runs at 88 rpm, which is 1.5 Hz. Everything follows
from that single fact.

**The first harmonic is below where general-purpose instruments start.**
A standard industrial accelerometer sold for rotating machinery is usually
specified from 10 Hz upward. On an 88 rpm machine, 10 Hz is the seventh
harmonic. Once-per-revolution unbalance, the strongest and most diagnostic
component on a hydro unit, is simply not in the instrument's range. The
vibration transducers specified on a machine of this kind measure **absolute
vibration displacement at low level, over 0.2 to 400 Hz** — the bottom of
that band is what makes it a hydro instrument.

**Displacement, not acceleration.** At 1.5 Hz, acceleration amplitudes are
tiny even when the shaft is moving a great deal: acceleration scales with the
square of frequency. Displacement in micrometres is the quantity that carries
the information, which is why the trip limits on a hydro unit read as microns
on the brackets rather than mm/s on the bearing housings.

**Three different measurements, not one.** On a steam turbine the question is
usually "how much is the casing shaking". On a hydro unit, three separate
things are measured, and they say different things:

| Measurement | Instrument | Range | What it tells you |
|---|---|---|---|
| Absolute vibration of the bearing brackets | Low-frequency absolute vibration transducer, 4–20 mA | 0.2–400 Hz | Structural response, unbalance, hydraulic roughness |
| Shaft runout relative to the bearing | Inductive distance transducer, 4–20 mA | 0–100 Hz | Where the shaft actually is in its bearing clearance |
| Rotor-to-stator air gap | Flat inductive distance transducer, 4–20 mA | 0–100 Hz | Rotor roundness, stator ovality, magnetic pull asymmetry |

The air gap measurement has no equivalent on a thermal machine at all. On a
large hydro generator the rotor rim is tens of metres in circumference and
the gap is millimetres; a rim that has gone slightly out of round, or a
stator core that has settled, shows up there long before it shows up anywhere
else.

**Small machines are measured in velocity, large ones in displacement.** On a
sub-megawatt unit a velocity trip around 11 mm/s RMS on the highest-reading
transducer is a reasonable protection setting. On a large vertical machine the
protection reads bracket displacement, with alarm around 90 µm and trip around
100 µm, and shaft runout alarmed separately in millimetres. Applying one
machine's thresholds to the other is a common and expensive mistake.

**Settings are useless without failure handling.** On a unit we maintain,
the vibration and runout channels were deliberately held out of the trip
scheme until the vibration system itself had been commissioned and proved.
Writing that down in the setting schedule, rather than leaving the trips
nominally in service and quietly disabled, is the difference between an
honest protection scheme and a dangerous one.

### What the signals are processed with

Raw thresholds are the floor, not the ceiling. Doing anything more needs the
sampling to support it:

**Acquisition.** Vibration channels are brought into a dedicated controller
running a fast cycle — a 1 ms task — with input modules sampling to around
16 kHz, separate from the controller that regulates the machine. Protection
trips from that controller are hard-wired across to the unit controller as
discrete signals as well as being passed over the network, so that a network
problem cannot swallow a protection action.

**Shaft orbit.** Two displacement transducers at 90° in the same plane give
the path the shaft centre traces per revolution. The shape of that orbit says
what is wrong: a circle is unbalance, an ellipse is stiffness asymmetry or
misalignment, an inner loop is rub, and a drifting centre is a bearing
clearance changing. A single probe and an RMS number cannot distinguish any
of these.

**Spectrum.** A Fourier transform of the vibration record, with the harmonics
referred to running speed, separates the mechanical causes from the hydraulic
ones. On a hydro unit the components worth naming are the once-per-revolution
component, the blade- or vane-passing frequency, the draft tube vortex rope at
roughly a quarter to a third of running speed at part load, and the electrical
components at twice line frequency that come from the generator rather than
the turbine. Each has a different owner and a different fix, and on a 1.5 Hz
machine they are only a few hertz apart — which is why the transducer's
low-frequency limit and the record length both matter.

**Trend, not snapshot.** Vibration data goes to the same archive as the
process data, so that a change can be read against load, head, gate opening
and temperature. A vibration level that is only a problem at a particular
load is a hydraulic problem; one that tracks temperature is a bearing or
alignment problem. The distinction is invisible in an isolated measurement.

### What we have done

On a vertical machine we added speed transducers with their trip relays set
at 160 % of rated speed into the existing protection scheme, brought a fourth
speed sensor that had been installed but never wired into service, added
vibration transducers collected by a separate controller whose analogue
outputs feed the unit control system, and changed the protection logic to use
them.

On a Pelton unit we installed shaft runout measurement between turbine and
generator, axial shaft displacement at the generator bearing, new mountings
for the position, runout, displacement and speed transducers, and brought
vibration into the trip scheme at an RMS velocity limit.

## Section D — Governor structure and head variation

### A hydro governor is several controllers, not one

What a hydro unit should be controlling depends on what it is connected to
and what the water is doing. The control system has to hold all of these and
move between them cleanly:

**Speed control, no-load.** From the first movement of the machine to
synchronising — holding rated speed with no electrical load to stabilise it,
which is the least stable condition the governor ever sees.

**Frequency and power control, synchronised.** Load setpoint with permanent
droop, so the machine shares load correctly with the rest of the system.
Droop typically 4 %, settable from 0 to 6 %.

**Isochronous control in an island.** Droop out, frequency held absolutely —
the only mode in which a hydro unit sets the frequency rather than following
it, and the mode that the penstock constrains hardest.

**Daily load schedule.** A load curve loaded into the controller and followed
without an operator, which is how an unattended plant participates in a
dispatch programme at all.

**Headwater level control.** The controller that matters most on a run-of-
river or small-pond plant: the unit's load is moved to hold the level in the
forebay or settling basin, so the machine follows the inflow. Set the level
too low and the intake draws air; too high and water spills past the plant
unused. Level is measured by radar in the basin, brought back over fibre, and
the loop writes to the load setpoint rather than directly to the gates.

**Opening control, manual.** Gate or nozzle position held directly, with no
outer loop — needed for testing and for conditions the outer loops cannot
handle.

### Moving between them without a bump

A plant spends its life changing which of these is in charge: synchronising,
losing the grid, inflow rising, dispatch taking over, a test starting. Each
transfer is a place where the machine can be kicked.

Transfer has to be bumpless in both directions and has to happen on two kinds
of trigger — an operator command, and an automatic safety criterion when the
plant's state no longer suits the active mode. The standing controllers track
the active one so that whichever takes over starts from the current output,
not from its own stale integral. Done badly, this is the single most common
source of load swings on a small plant, and it is invisible in a factory test
because the condition that triggers it only happens on the river.

### Wide head range means the controller cannot be a fixed set of numbers

On low-head machines the operating head is not a constant. Where the gross
head varies between about 17.5 and 24.5 metres over the year, the hydraulics
of the machine change underneath a fixed controller:

- **Output for a given opening changes.** The gate-to-power relationship is
  not linear even at constant head — on one unit, 86 % of cylinder travel
  gave 130 kW and 95 % gave 950 kW — and the whole curve shifts with head.
  A controller tuned at high head is sluggish at low head and twitchy at high.
- **Water starting time changes**, and with it the fastest closure the
  penstock will tolerate and the achievable frequency response.
- **The combinator relationship changes** on a double-regulated machine. The
  blade angle that is optimal for a given gate opening is a function of head,
  which is why the combinator is a surface, not a curve.
- **Cavitation and rough-running zones move**, so the load bands the machine
  should not sit in are not fixed either.

The answer is that the controller is parameterised by head rather than tuned
once: measured head drives the gain set, the combinator relationship and the
limits, updated online as the head changes, with the characteristics taken
from measurement on the machine rather than from the manufacturer's curves
alone. We take load characteristics and rejection records at commissioning
precisely so that there is a measured basis for that, instead of a single set
of numbers that is right on one day of the year.

---

# Where else this belongs

**`/service/maintenance.html`** — one line in the test programme section:
vibration and runout channels proved against the protection logic, not merely
read.

**`/plant-performance.html`** — the archive argument: vibration trended
against load, head and gate opening in the same historian as the process
data is what turns a monitoring system into a diagnosis.

**`/references.html`** — no change needed; the vibration work is already
inside the two hydro rows from addendum 9.

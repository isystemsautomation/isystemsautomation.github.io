# Addendum 12 — hardware, speed thresholds and head-dependent governing

Fourth and last of the hydro files, after addenda 9, 10 and 11. This one adds
the material that was still missing when addendum 11 was written: the actual
instrument and controller hardware of a vibration retrofit, the full ladder of
speed thresholds a hydro unit runs on, and documentary proof that head is a
governing input rather than a commissioning constant.

Same rules as the other three: no client names, no country names, cities only,
no prices, no contract numbers, no personnel names.

Where addendum 11 said "the sensor set specified on a machine of this kind",
this file lets several of those statements become "this is what we quoted,
installed and commissioned". Prefer the stronger wording wherever the two
files overlap.

---

# PAGE — /hydro-turbine-control.html

## Edit 1 — strengthen the vibration section from addendum 11

Add this after "What we have done".

### What a vibration retrofit is made of

A vibration and speed monitoring retrofit on an operating hydro unit is a
small, dense project. The scope we quote and build for one machine:

**Instruments.** Six absolute vibration transducers on the machine structure.
Six shaft runout transducers in the bearing areas. Four air-gap transducers
around the generator. An inductive speed sensor reading a toothed wheel on the
shaft, with a tachometer channel alongside it. Purpose-made mounting
brackets for every one of them — on a machine built in the 1950s nothing has
a transducer boss, and fabricating the mountings is a real part of the work.

**Signal conditioning.** A 200 V to 4–20 mA measuring transducer for the speed
channel taken from the governor tachogenerator, and existing speed monitors
and high-speed trip modules reused where they are sound rather than replaced
for the sake of it.

**Controller.** A fail-safe S7-1500 CPU per unit, with high-speed analogue
input modules for vibration and runout, dedicated counter modules for the
speed channels, local power supplies and a 4 MB memory card. Around 160
signals per unit, six regulating loops, and roughly 600 m of screened
instrument cable.

**Where it lands.** A vibration monitoring workstation in the main control
room, an extension of the SCADA licence for the added signal count, and —
the part most often forgotten in a retrofit — the new system wired into the
plant's existing central alarm system, so that a vibration alarm reaches the
operator the same way every other alarm does instead of living on a screen
nobody watches.

**Commissioning.** Insulation resistance on every new line, software
installation and configuration, functional configuration of around sixty
functions, standalone commissioning, integrated commissioning and acceptance
testing of the system as a whole.

## Edit 2 — new subsection inside "Governor structure and head variation"

Place after "A hydro governor is several controllers, not one".

### The speed ladder

A hydro unit's start, stop and protection sequences hang off a ladder of
speed thresholds, each with a different consequence. On a large machine it
reads like this:

| Speed | What happens |
|---|---|
| 0 % | Zero-speed confirmed; mechanical brake release, stopped-state interlocks |
| 20 % | Mechanical braking applied during run-down |
| 85 % | Field suppression |
| 95 % | Excitation switched in during a normal start |
| 96 % | Excitation switched in on an emergency start, self-synchronising |
| 100–105 % | Normal-shutdown sequence armed when the hydromechanical emergency protections operate |
| 115 % | Runaway, stage I — gates closed by the emergency closing valve with the generator breaker open and the governing subsystem failed |
| 160 % | Runaway, stage II |

The design judgement sits in the two runaway stages. Stage I is conditional:
it fires only if the breaker is already open and the governor has failed, so
it cannot trip a machine that is simply swinging. Stage II is
unconditional. One protection setting would have to be either too eager or
too slow; two, with different qualifying conditions, are neither.

For the same reason the speed measurement itself is built in three
independent ways: inductive sensors on a toothed wheel on the rotor shaft,
mutually redundant, with a further reserve channel derived from the unit
voltage transformers. The reserve channel uses a completely different
physical principle, which is what makes it a reserve rather than a third
copy of the same failure.

### Head is an input to the governor, not a commissioning constant

The point from the section above is not a design opinion; it is how a hydro
governing subsystem is specified. The frequency and power control subsystem
takes four primary measurements:

- shaft speed,
- active power,
- wicket gate opening,
- **head.**

And among the gate position signals it must produce is an explicit **gate
opening limit as a function of head**. At high head the machine would exceed
its rating, cavitate or overload the generator long before the gates are
fully open, so the usable travel is not a fixed number — it is a curve.

Manual control is scaled accordingly: speed setpoint adjustable between 45
and 55 Hz in frequency control, gate opening 0 to 100 % in power control, and
a separate operator setpoint for the technological limit on maximum opening.
Alarm accuracy is specified at ±1 % on gate position, speed, pressures and
levels, ±1 °C on temperatures and ±1.5 % on flows — tolerances a plant with a
seasonal head range cannot meet with a single calibration.

### Failure behaviour of the governing subsystem

Three requirements that are easy to write and hard to satisfy together:

**Failure of the electronics must stop the machine.** The action of the
frequency and power subsystem on the hydromechanical part of the governor is
arranged so that losing the electronic part produces an emergency shutdown,
not a frozen output.

**A one- to two-second supply interruption must not produce a load step.**
Which means the controller has to ride through it rather than restart, and
the actuator has to hold position without a command.

**Re-entry must be bumpless in any operating state.** After a long loss of
supply or a repaired fault, the subsystem has to come back into service
without kicking the machine, whatever the unit is doing at the time.

To that we would add the requirement that survives all of the above: a manual
positioning path for the gates and runner blades from a local station, not
passing through the controller at all. A governor that cannot be operated
when its PLC is dead is a governor that defines its own worst case.

### What else the water is telling you

Three hydraulic measurements belong in the control system and are often left
out:

- **Headwater and tailwater level**, from which net head is computed
  continuously — the input the governor needs above.
- **Differential pressure across the trash racks.** A rising differential is
  debris, and it costs head directly; without the measurement it shows up
  only as an unexplained loss of output.
- **Frazil ice** at the intake on cold-climate plants, which no other
  instrument will warn you about.

---

# Cross-references

**`/plant-performance.html`** — net head computed from headwater and
tailwater, and trash rack differential, are what make a hydro efficiency
calculation meaningful rather than a plot of output against gate position.
Worth one sentence there.

**`/service/maintenance.html`** — the speed ladder is a test list: each
threshold is a function that can be proved by injection, and most of them are
never exercised in normal running.

**`/cybersecurity.html`** — no change.

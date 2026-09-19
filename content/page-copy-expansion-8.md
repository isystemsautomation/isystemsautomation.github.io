# Addendum 8 — hydro, protection design, telecontrol, risk-based testing

Second half of the project-record pass. Apply together with
`page-copy-expansion-7.md`, which covers island mode, automatic boiler
start-up and the virtual power plant.

Sourced from a 2021 risk-assessment test programme for a micro-hydro unit, a
2015 functional test protocol reviewed as an outside expert, and the client
management presentation.

Client naming convention unchanged: plants are described by type, never by
brand. No individual engineers are named.

Vocabulary deliberately introduced because it is absent from the whole site
and is what the target queries use: **islanding**, **islanded operation**,
**isolated load**, **turbogenerator** / **TG**, **df/dt**, **load rejection**,
**house load**, **heat rate**.

---

# PAGE: /island-mode.html — ADD two sections, after "Proven, then maintained"

## Islanding a hydro unit is a different problem

On a steam turbine the constraint is the machine. On a hydro unit the
constraint is the water column.

We carried out the risk assessment for islanding a micro-hydro unit onto
isolated load, and the finding was that it could not be done as the plant
stood. The nozzle valves take 30 to 45 seconds for full travel — deliberately
slowed, because closing them faster raises pressure in the penstock beyond
what the derivation would take. A governor that cannot act in seconds cannot
hold frequency in an island.

That is a real answer, and it is the one the plant needed. What followed from
it:

**Detect the separation by rate of change of frequency.** Where the control
system has no breaker position signal to tell it the line has opened, df/dt
detects the separation from the electrical behaviour itself, and trips the
unit before the frequency excursion damages anything.

**Then ask how much load.** Tripping is right when the island would be 5 MW
and the machine is small. It is wrong when the island is comparable to the
unit's own no-load and auxiliary demand, because then the machine can hold it
and the penstock never sees a sharp flow reduction. The control logic can
distinguish the two: below a defined rejected load, transfer to isolated
operation on frequency control; above it, trip.

**Which case applies is not an engineering decision alone.** It depends on
what the network operator leaves connected when their infeed drops, and that
has to be agreed with them before the logic is written.

Islanding is worth doing where it is possible and worth refusing where it is
not. Knowing which is which is the part that takes a process engineer.

## What islanding detection can be built on

| Criterion | What it is good for | What it misses |
|---|---|---|
| Breaker position, hard-wired into the DCS | Unambiguous, immediate, tells you *which* island formed | Only the breakers you have wired; needs an enable key per criterion for maintenance |
| Rate of change of frequency, df/dt | Works when no position signal exists | Can be fooled by disturbances that are not separations |
| Frequency deviation alone | Simple | Slow and ambiguous; by the time it is certain, the excursion has happened |
| Power flow direction at the connection point | Confirms the others | Not sufficient on its own |

We use breaker position as the primary criterion where the signals can be
brought in, and df/dt where they cannot.

---

# PAGE: /hydro-turbine-control.html — NEW PAGE

## Hydro turbine control and protection

A hydro unit is a control problem with a water column attached. The governor
can only move as fast as the penstock will tolerate, and every decision about
speed of response is really a decision about pressure surge.

We have worked on hydro units with Siemens S7-300, S7-1500 and S7-1200 under
TIA Portal, and with Yokogawa Centum VP, on Pelton machines with nozzle and
deflector control.

## Unit control

Nozzle control with staged cut-in — the second nozzle brought in at a defined
opening of the first — hydraulic cylinder positioning through the governor
block and actuator, oil pressure unit management, and the pre-turbine and
bypass valve sequence that equalises pressure before the machine is opened.

Start-up is not instantaneous and should not pretend to be: the regulating
oil system is warmed by heating the drain tank hours in advance and then
cycling the hydraulic cylinder through full travel with holds at each end,
because a governor working on cold oil is a governor with a different
response than the one that was commissioned.

## Protection design and voting

Protection is a set of decisions about what a single failed sensor should be
allowed to do. On the unit above:

| Protection | Setting | Voting |
|---|---|---|
| Overspeed | 600 rpm | 2 sensors, 1 out of 2 |
| Bearing oil bath temperature | 65 °C | 2 sensors, 1 out of 2 |
| Generator stator copper temperature | 95 °C | 3 sensors, 1 out of 3 |
| Generator stator iron temperature | 95 °C | 3 sensors, 1 out of 3 |
| Oil pressure unit accumulator pressure, low | 16.3 kgf/cm² | single |
| Oil pressure unit accumulator pressure, high | 29 kgf/cm² | single |
| Drain tank oil level, low | 150 mm below normal | single |
| Drain tank oil level, high | 115 mm above normal | single |
| Nozzle cylinder spool position mismatch | — | comparison |
| Speed sensor mismatch | — | comparison |

Plus generator electrical protection, outgoing 6.3 kV line protection,
generator breaker failure, and excitation system failure.

Two-out-of-three on stator temperature and one-out-of-two on overspeed are
not arbitrary. They are a judgement about which way to fail: a spurious trip
on a generator winding is cheap, a missed overspeed is not.

## Failure modes we test for

A protection scheme is only as good as the failures it has actually been
exercised against. On a unit shutdown condition we test, one at a time:

- failure of the governor block, including loss of its action on the actuator
- failure of the actuator itself
- sharp loss of oil pressure in the oil pressure unit
- loss of the 0.4 kV auxiliary supply downstream of its automatic transfer
- failure of the DC supply unit
- failure of the unit controller or of its I/O subsystem

Each is applied deliberately, with personnel stationed at the governor stop
coil and at the pre-turbine valve to close them by hand if the auxiliary
supply goes with it.

## Telecontrol and remote operation

Unattended hydro plants are operated over telecontrol links, and the link is
part of the plant. We test it as such: channels disconnected one at a time,
then two at a time in different orders, then three, checking each time that
the unit stays stable and that remote monitoring survives. Transfer between
primary and backup channels has to be bumpless, and the only way to know it
is is to break the primary while the machine is running.

The harder question is what the plant does when it loses the link to the head
node entirely and runs blind until a process setpoint stops it. That
behaviour should be a designed decision, not a discovered one.

## Related

Island mode and load rejection are covered under Island Mode Operation.
Test programmes and acceptance are under Factory and Site Acceptance Testing.

---

# PAGE: /acceptance-testing.html — ADD one h2 section, before "Platforms we
# have tested on"

## Risk-based test programmes

A commissioning test programme written from the specification tests what the
system is supposed to do. A test programme written from the risks tests what
happens when it does not.

We write and run the second kind. The structure is the same each time:

**Name the failures worth testing.** Not every component, but the ones whose
failure changes the outcome: the governor block, the actuator, the oil
pressure supply, the auxiliary power feed, the controller and its I/O
subsystem, the communication channels.

**Apply them one at a time, deliberately, on the running plant.** With the
protections verified and in service beforehand, with a permit to work, with
personnel briefed on how to stop the test, and with people stationed at the
manual means of shutting the machine down if the automatic ones are the thing
being tested.

**State in advance what a pass looks like** for each, and record what
actually happened rather than whether it felt acceptable.

**Say when a test cannot be run.** On one unit the islanding test could not
be performed at all, because the governor had been deliberately slowed to
protect the penstock and no valid result was obtainable. Recording that, with
the reason, is a result — and it prevented a test that would have damaged the
plant to produce a number nobody could use.

## Reviewing someone else's protocol

We are also asked to review completed test protocols as an outside expert. On
a turbogenerator protocol covering load rejection at 5 and 15 MW, transfer
from load control to speed control on leaving the grid, automatic change of
control law from proportional to proportional-integral on entering the
island, overspeed protection, automatic synchronisation and 6.3 kV automatic
transfer switching, the questions we were asked to answer were which of the
stated conclusions the recorded measurements actually supported, and what had
not been demonstrated at all.

A test report is evidence only if the tests behind it prove what the report
claims. Reading one properly is a separate skill from running one.

---

# PAGE: /cybersecurity.html — ADD one h2 section, after "What we do"

## Telecontrol links are part of the plant

A remotely operated plant is operated over somebody else's network. The VPN
tunnel provided by a telecom operator is, from the plant's point of view, a
piece of the control system that nobody on site can inspect.

We treat the telecontrol subsystem as testable:

**Redundancy proved by failure.** Channels disconnected one at a time, then
in combinations, with the unit running, checking that transfer is bumpless
and that remote monitoring survives each case.

**Behaviour on total loss.** What the plant does when the link to the
dispatching centre is gone entirely, and for how long it is allowed to
continue without one.

**Resistance to interference.** Testing the telecontrol subsystem against
deliberate attack is a specialist exercise and is normally outside the
competence of the commissioning team, our own included. Where it is needed we
say so and specify what has to be brought in, rather than leaving it out of
the programme because nobody present can do it.

---

# PAGE: /industries/power-generation.html — extend "Equipment we automate"

Add hydro explicitly to the equipment list, with a link to
/hydro-turbine-control.html:

  Hydro turbines — Pelton units with nozzle and deflector control, governor
  and oil pressure unit management, protection design and unattended
  operation over telecontrol links.

---

# NAV AND LINKING

Add "Hydro Turbine Control" to the Expertise group in the top menu, after
Automatic Boiler Start-up, and to the footer and sitemap.

Link in body text:
  hydro-turbine-control → /island-mode/, /acceptance-testing.html,
    /cybersecurity.html
  island-mode → /hydro-turbine-control.html in the new hydro section
  acceptance-testing → /hydro-turbine-control.html in the risk-based section
  cybersecurity → /hydro-turbine-control.html
  power-generation → /hydro-turbine-control.html
  references table: both hydro rows → /hydro-turbine-control.html

# Addendum 7 — island mode, automatic boiler start, VPP composition

Sourced from a client management presentation, a signed technical solution for
TG-4 islanding, a 2015 commissioning exchange with the DCS vendor, and an
Ovation historical trend captured during an islanding event in February 2025.

Client naming convention unchanged: the site is described as "a refinery CHP
plant", never by brand. Individual engineers are not named.

The target queries this addresses, all of which currently rank between
position 20 and 90: island mode, island mode generator, tg island automation
control system, power plant efficiency calculation, virtual power plant,
plant automation system integrator.

Two synonyms are deliberately introduced because they are absent from the
whole site and are what English-language engineering actually uses:
**islanding** / **islanded operation** alongside "island mode", and
**turbogenerator** / **TG** alongside "turbine".

---

# PAGE: /island-mode.html — REPLACE the whole page

## Island mode operation and load rejection

A refinery loses its grid connection. Its combined heat and power plant now
has a few seconds to decide whether the refinery keeps running or goes dark.
Getting it wrong means an uncontrolled shutdown: units tripped, product to
the flare, a day of lost production and a mechanical inspection before
restart.

We have implemented islanding on an operating refinery CHP plant, proved it
on the running plant, and maintained it since.

## The measurable result

The plant this was built for recorded twelve electrical supply incidents in
2010, four of them caused by operator action. By 2016 it recorded two, none
of them caused by operator action.

| Year | Incidents | Of which caused by operator action |
|---|---|---|
| 2010 | 12 | 4 |
| 2011 | 10 | 3 |
| 2012 | 8 | 3 |
| 2013 | 4 | 0 |
| 2014 | 4 | 1 |
| 2015 | 3 | 1 |
| 2016 | 2 | 0 |

Islanding was one part of that programme. The rest was differential
protection with single-phase auto-reclosing on four 110 kV overhead lines,
breaker replacement at both ends of each line, and an optical ground wire.
The automation is what removed the operator from the critical seconds.

## What has to happen, and in what order

**Detect the separation.** Not "notice the frequency moving" — establish that
the connection to the grid is gone, fast enough that the next steps still
have time to act. Frequency deviation alone is a slow and ambiguous
criterion. We extended the detection to include the position of the breakers
that actually define the island: the 110 kV breaker on the three-winding
transformer and the 11 kV breaker, brought into the DCS as hard signals, each
with an enable key so the criterion can be taken out of service for
maintenance without disabling the whole function.

**Transfer the governor.** The turbine governor runs in droop while
synchronised to a grid that sets the frequency. In an island there is no grid
to follow: the machine itself sets the frequency, and the governor has to
move to isochronous control. That transfer happens once, under load, and
cannot be rehearsed on the running plant.

**Know the load before it arrives.** The island the machine finds itself in
depends on which breaker opened, and so does the load it must pick up. The
control system keeps a running snapshot — refreshed every ten seconds — of
the generation and consumption balance on the 6 kV busbars, together with the
operating state of the turbines and the circulating fluidized bed boiler. From
that snapshot it continuously computes the setpoints the boiler and turbine
controllers will need for each possible separation, and holds them ready. When
the breaker opens, the setpoint is already calculated for that specific case
rather than being derived while the frequency is falling.

**Take the turbogenerator off plant load control.** In grid-parallel
operation the TG follows a plant load target. In the island that target is
meaningless; the machine moves to holding its own inlet pressure and the
island frequency instead.

**Shed load by priority.** Generation left in the island is smaller than the
load that was being served. Non-critical consumers go, in a sequence worked
out in advance, fast enough that the frequency excursion stays inside what the
turbine will tolerate. Which consumer is non-critical is a process question,
not an electrical one, and getting the list wrong shuts down the refinery just
as effectively as losing the plant.

**Hold frequency and voltage.** In the island the plant is the grid.
Frequency and voltage control that were someone else's problem are now the
control system's problem.

**Resynchronise.** The control system matches frequency and voltage at the
breaker chosen for resynchronisation — which one depends on how the island
formed, and may be the 110 kV breaker, the 11 kV breaker, the 6 kV bus
coupler or the generator breaker. Closing is on the dispatcher's command.

## Proven, then maintained

The algorithm was implemented in the DCS and tested on the running plant with
the incoming lines to the refinery deliberately opened, so that the
turbogenerator carried the refinery's own consumers. Two trials were run,
before and after a plant overhaul, holding 13–14 MW in the island. Both were
agreed in advance with the transmission and distribution system operators,
because a deliberate separation affects the network on the other side of the
breaker too.

It is still in service. A historical trend recorded during an islanding event
in February 2025 shows the turbogenerator at 10.4 MW and 49.9 Hz with the
island mode flag set, speed dipping below 2,980 rpm and recovered by the
governor, and 100 bar steam flow to the turbine re-established — the whole
transient inside seventy seconds.

Turbine acceptance testing on the same units included disconnection of the
generator from the grid, with the machine held on house load: the same event
under controlled conditions.

## Why it is rare

An automation contractor can write the logic. Running it on a plant that a
refinery depends on requires someone the plant owner will let near the
turbine, agreement from two network operators, a load shedding list somebody
has to be confident about, and the willingness to be on site when the breaker
opens.

We also review this work for others. A completed functional test protocol for
a turbogenerator — governor behaviour under load rejection at 5 and 15 MW,
transfer from load control to speed control on leaving the grid, automatic
change of control law from P to PI on entering the island, overspeed
protection, automatic synchronisation and 6.3 kV automatic transfer switching
— was given to us for expert review, to establish what had not been
demonstrated and where the conclusions did not follow from the measurements.

## Related

Plant coordinated control, grid code compliance and turbine acceptance
testing are covered under Power Generation. Keeping steam available to the
refinery when a boiler trips is covered under Automatic Boiler Start-up.

---

# PAGE: /automatic-boiler-start.html — NEW PAGE

## Automatic boiler start-up and hot standby

When the main boiler trips, the clock that matters is not the one on the
boiler. It is the one on the refinery, which needs 16 bar steam back before
its units start shutting themselves down.

Starting a boiler by hand ties up an operator for hours and produces a
different result every time, because the sequence depends on who is running
it. Under emergency conditions, with the main boiler already down, it also
depends on how that operator is doing.

## The target

Start the standby gas and fuel-oil boiler within twenty minutes of the
circulating fluidized bed boiler tripping, and have 16 bar steam back to
consumers within forty-five.

## What that took

**One control system for both boilers.** The CFB boiler and the standby gas
boiler run under a single Emerson Ovation ACS, so the standby boiler's start
can be triggered by the fact of the CFB boiler stopping, without a hand-off
between systems.

**An automatic safe light-off sequence**, designed with the national boiler
engineering institute: draft fans started and the furnace and gas passes
purged; the gas line filled and automatically sampled for analysis; the
tightness of the shut-off gas valve train verified; igniter burners lit; the
remaining burners lit and parameters raised along the defined start-up and
loading curve.

**Continuous insulation resistance monitoring** on the draft fan motors, so
the machines that the start depends on are known to be startable before the
start is called for, not discovered otherwise during it.

**Periodic automatic nitrogen tightness testing** of the boiler's protective
gas valve train. A leak check that happens on a schedule without an operator
is a leak check that actually happens.

**Automatic gas sampling** from the gas line as part of the sequence.

## Hot standby, and the heat that was being thrown away

A twenty-minute start is only possible from a warm boiler. The standby boiler
is held in hot standby using heat that the CFB boiler was already rejecting:
continuous blowdown and soot-blower drains.

A 100/16 bar reducing and desuperheating station was installed with emergency
automation that starts it when the CFB boiler trips, holds pressure in the
steam headers and runs the tripped boiler's cooldown regime.

Together these brought the time to restore 16 bar steam to consumers down to
one hour, from a cold-start figure measured in hours.

## Why this is process engineering, not sequencing

The ramp is limited by the thermal stress the drum will take, not by how fast
the valves can move. The blowdown heat is only usable if the standby boiler's
water chemistry allows it. The decision to hold one boiler warm at all follows
from the plant's own technical and economic indicators — running on a single
CFB boiler is the efficient case, and hot standby is what makes it safe.

## Related

Boiler load control, fuel allocation and combustion optimisation are covered
under Process Optimisation. The efficiency calculations that decide how the
plant is run are under Plant Performance.

---

# PAGE: /projects/virtual-power-plant.html — REPLACE the body, keep the URL

## Virtual power plant

Six generating sites and a refinery, dispatched as one.

A virtual power plant is usually sold as a software layer over other people's
assets. This one was built the other way round: from the control system of a
conventional plant outward, with the steam turbine as the machine that
absorbs what the renewables do not deliver.

## What is in it

| Asset | Rating |
|---|---|
| CHP plant, petroleum coke, coal and gas fired | 61 MW electrical, 300 Gcal/h thermal |
| Photovoltaic plant on the refinery site | 9 MW |
| Photovoltaic plant | 0.999 MW |
| Photovoltaic plant | 0.979 MW |
| Photovoltaic plant | 0.972 MW |
| Photovoltaic plant | 0.972 MW |
| Photovoltaic plant | 0.972 MW |
| Micro-hydro plant | 0.269 MW |

The dominant consumer is the refinery itself at 28.6 MW, with eight smaller
industrial consumers behind the same connection.

## Three zones of control

**Inside the fence.** The CHP plant supplies the refinery with steam at 35, 16
and 6 bar and with electricity, and takes refinery gas back as fuel. This is
the loop with the shortest time constants and the one the plant controls
directly.

**The site.** The refinery and the 9 MW photovoltaic plant on its territory.
Solar output moves on cloud cover; the steam turbine moves to match it,
because the refinery's demand does not care where the electricity came from.

**The national grid.** Remote photovoltaic plants and the micro-hydro,
dispatched together with the CHP plant against a schedule, with the balance
settled at the connection point.

## What the control system does

Output from each remote site is telemetered to the CHP plant's control system.
The combined position of the group is compared with the schedule, and the
steam turbine's load target is adjusted so the group as a whole meets it. The
turbine is the only machine in the set whose output can be commanded rather
than merely forecast, which is what makes the arrangement work.

Reporting to the transmission system operator goes over IEC 60870-5-101 and
to the market operator over IEC 60870-5-104.

## What this is not

It is not a trading platform and it is not an aggregator's portfolio. It is a
balancing group whose assets happen to belong to one owner, controlled from
one DCS, with a thermal machine doing the regulating. That is a narrower
thing than the term usually implies, and it is what was actually built.

## Related

The islanding behaviour of the same plant is under Island Mode Operation.
The fuel and efficiency calculations behind the dispatch decisions are under
Plant Performance.

---

# PAGE: /industries/power-generation.html — add one h2 section

## Power supply reliability for industrial sites

An industrial site connected to a weak grid loses production to events that
are nobody's fault on site. The work of reducing that is part automation and
part primary plant.

On a refinery CHP plant we have been part of a programme that took electrical
supply incidents from twelve a year to two over six years, and incidents
caused by operator action from four a year to none. Our part was the control
system: islanding detection and transfer, automatic load setpoint computation
for each possible island, emergency automation for the steam headers, and
automatic start of the standby boiler.

The rest — differential protection with single-phase auto-reclosing on the
110 kV lines, breaker replacement, optical ground wire, fast automatic
transfer switching on the 6 kV switchgear — is primary plant, and we have
worked alongside it rather than on it.

See Island Mode Operation and Automatic Boiler Start-up.

---

# NAV AND LINKING

Add "Automatic Boiler Start-up" to the Expertise group in the top menu,
after Island Mode, and to the footer and sitemap.

Link, in body text rather than as a block:
  island-mode → automatic-boiler-start, plant-performance, power-generation
  automatic-boiler-start → island-mode, process optimisation, plant-performance
  virtual-power-plant → island-mode, plant-performance
  power-generation → island-mode, automatic-boiler-start
  references table: the islanding row → island-mode; the boiler auto-start
    row → automatic-boiler-start

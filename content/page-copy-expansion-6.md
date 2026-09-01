# Addendum 6 — the differentiators, moved to where they can be seen

The site's rarest competences currently sit two clicks deep: island mode is
the eighth heading on an industry page, and the CHP performance indicator work
is a section inside a project page. Meanwhile the home page opens with four
"Why Choose Us" items, three of which any automation contractor in Europe
could write about themselves.

This addendum fixes that. Two new top-level pages for the two rarest
competences, and a home page that opens with what nobody else has.

The through-line, which must survive editing: **an automation contractor makes
the control loop stable; ISYSTEMS makes the plant cheaper to run, and can show
it in units of fuel.** Every claim below is process engineering, not
programming — that is the point.

---

# PAGE: /index.html — replace the hero and the "Why Choose Us" section

## Hero

Heading: Control systems written by process engineers

Subheading: We design, commission and maintain control systems for power
plants and refineries. The difference between us and an automation contractor
shows up in the fuel bill.

Buttons: References · Combined Cycle Power Plants

## Replace the "Why Choose Us" section with this, headed "What we do that
## others do not"

Intro line: Six DCS platforms and SIL 3 certification are table stakes. These
are not.

**Island mode, proven on a running plant**
When a refinery loses the grid, its CHP plant has seconds to decide whether
the refinery keeps running. We implemented that transition and proved it on a
live plant in two trials, holding 13–14 MW in the island, agreed in advance
with the transmission and distribution system operators. It is the most
dangerous test in power plant commissioning and most contractors are never
asked to run it.
→ Island mode operation

**Fuel accounting inside the control system**
A CHP plant makes two products from one fuel stream, and no measurement
separates them. We implement the allocation, the boiler efficiency by direct
and indirect method, and the turbine heat balance as live calculations in the
DCS, archived, with the cost of every deviation from design attached. Most
plants get this as a spreadsheet at month end, if at all.
→ Plant performance and fuel accounting

**Combustion that follows the fuel**
On a CFB boiler firing petroleum coke, the fuel changes constantly. We
calculate its calorific value automatically from the combustion result and
distribute solid fuel across the feeders by heat value. That loop cannot be
written without understanding what is happening in the furnace.
→ Advanced controllers for CFB boilers

**Eleven years on one plant, then back again**
Three boilers of 120 t/h, a 260 t/h CFB boiler, three 12 MW turbines and one
of 30 MW, five steam headers, a refinery on the other end. Designed,
commissioned and maintained continuously from 2007 to 2018, and under
maintenance again since 2022. Process knowledge of a plant is not bought; it
accumulates.
→ References

---

# PAGE: /island-mode.html — NEW PAGE

## Island mode operation and load rejection

A refinery loses its grid connection. Its combined heat and power plant now
has a few seconds to decide whether the refinery keeps running or goes dark.
Getting it wrong means an uncontrolled shutdown: units tripped, product to
the flare, a day of lost production and a mechanical inspection before
restart.

We have implemented this transition and proved it on an operating plant.

## What has to happen, and in what order

**Detect the separation.** Not "notice the frequency moving" — establish that
the connection to the grid is gone, fast enough that the next steps still have
time to act.

**Transfer the governor.** The turbine governor runs in droop while
synchronised to a grid that sets the frequency. In an island there is no grid
to follow: the machine itself sets the frequency, and the governor has to move
to isochronous control. That transfer happens once, under load, and cannot be
rehearsed on the running plant.

**Shed load by priority.** Generation left in the island is smaller than the
load that was being served. Non-critical consumers go, in a sequence worked
out in advance, fast enough that the frequency excursion stays inside what the
turbine will tolerate. Which consumer is non-critical is a process question,
not an electrical one, and getting the list wrong shuts down the refinery just
as effectively as losing the plant.

**Hold frequency and voltage.** In the island the plant is the grid.
Frequency and voltage control that were someone else's problem are now the
control system's problem.

**Resynchronise.** When the grid returns, back onto it without a second
disturbance.

## Proven, not simulated

The algorithm was implemented in the DCS and tested on the running plant in
two trials, before and after a plant overhaul, holding 13–14 MW in the
island. Both trials were agreed in advance with the transmission system
operator and the distribution system operator, because a deliberate
separation affects the network on the other side of the breaker too.

Turbine acceptance testing on the same units included disconnection of the
generator from the grid — the same event, under controlled conditions, with
the machine held on house load.

## Why it is rare

An automation contractor can write the logic. Running it on a plant that a
refinery depends on requires someone the plant owner will let near the
turbine, agreement from two network operators, and a load shedding list that
someone has to be confident about. Most of that is not automation work.

## Related

Primary and secondary frequency control, plant coordinated control and grid
code compliance are covered under Power Generation. The plant's fuel and
efficiency calculations are covered under Plant Performance.

---

# PAGE: /plant-performance.html — NEW PAGE

## Plant performance and fuel accounting

A combined heat and power plant produces two products — electricity and heat
— from one fuel stream. No instrument separates them. To know what a
kilowatt-hour costs and what a tonne of steam costs, the fuel has to be
allocated between them by a chosen method, and no method is physically
neutral. The choice is a methodological decision with commercial
consequences: it sets the internal transfer price of steam, and through that
the apparent profitability of everything downstream.

We implement that calculation inside the control system, live, archived, and
against the method the plant is required to report under.

## What we calculate

**Specific reference fuel consumption** for electricity supplied and for heat
supplied.

**Boiler efficiency, gross and net, by direct and indirect method.** The
indirect method means accounting for the losses individually — flue gas,
chemical incomplete combustion, mechanical incomplete combustion, radiation
to the surroundings, and ash. For gas firing and for petroleum coke firing on
a circulating fluidized bed boiler, where the fuel itself varies.

**Steam turbine heat balance,** efficiency and losses against the factory
characteristic, with the deviation costed.

**Auxiliary power consumption** as a share of generation.

**Fuel heat utilisation factor.**

**Balances** for water, steam, gas and electricity, technical and commercial.

## Allocation method

Under the physical method used in Romanian and post-Soviet practice, heat
supplied from a CHP plant is charged at the specific fuel consumption an
equivalent boiler house would have, and the remaining fuel is charged to
electricity. Exergy-based and market-based allocation produce different
answers from the same measurements.

We implement whichever the plant reports under, and can run two in parallel
where a plant answers to more than one regulator or has to reconcile a
regulatory figure with an internal one.

## Fuel that changes while you burn it

Petroleum coke is not a specification, it is a delivery. Its calorific value
moves, and an efficiency figure computed against an assumed value is
decorative.

On a 260 t/h CFB boiler we calculate the calorific value of the coke
automatically from the combustion result and feed it back into two places: the
efficiency calculation, so the number stays true, and the fuel allocation
across the feeders, so each feeder delivers heat rather than mass.

## Where the numbers go

Not into a monthly report. Onto the operator's screen, into the historian, and
into the reports that the people who can act on them actually read — unit
efficiency to the process engineer, emissions to the environmental engineer,
cost and consumption to finance.

Data is taken from DCS ABB Industrial IT and DCS Emerson Ovation over OPC, and
from SCADA and commercial metering over Modbus, with central long-term
archiving. Calculations follow ASME and the applicable industry standards.

## Why an automation contractor does not do this

Writing the loop is the easy half. Knowing where each boiler loss comes from,
what a turbine heat balance is made of, and why the allocation method changes
the answer is process engineering. It is normally done by a consultant, in a
spreadsheet, months after the fact. We do it in the control system, while the
operator can still change something.

## Related

Advanced controllers for CFB boilers, plant coordinated control and the
optimiser set are covered under Process Optimization. The full project record
is under References.

---

# PAGE: /projects/power-plant-performance-calculation.html — after the move

The "Technical and economic performance indicators for CHP plants" section now
lives on /plant-performance.html. Replace that section on the project page
with a two-sentence summary and a link, so the material exists in one place:

  The plant performance monitoring system implements the technical and
  economic performance indicators the plant reports under, including fuel
  allocation between heat and power, boiler efficiency by direct and indirect
  method, and turbine heat balance against the factory characteristic. See
  Plant Performance and Fuel Accounting.

---

# PAGE: /industries/power-generation.html — after the move

The "Island mode operation and load rejection" section now lives on
/island-mode.html. Replace that section with a short summary and a link:

  Where a plant has to keep supplying its site after separation from the grid,
  we implement the governor transfer, load shedding and frequency control that
  make it possible — proven on a running refinery CHP plant. See Island Mode
  Operation.

Keep "Grid code compliance and system operator interface", "Automatic boiler
start-up", "Plant-wide protection", "Turbine acceptance testing" and
"Combined cycle power plants" on this page unchanged.

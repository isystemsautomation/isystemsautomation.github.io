# New and expanded copy, by target page

Source text for a content pass across the site. Each `# PAGE` block below names
the file it belongs to and where in that page it goes. Use it verbatim.

Written to replace generic industry description with what ISYSTEMS AUTOMATION
has actually done. No marketing adjectives — if a sentence would fit on any
competitor's site unchanged, it does not belong here.

---

# PAGE: /industries/power-generation.html — add two new h2 sections after
# "Turbine acceptance testing"

## Island mode operation and load rejection

A refinery loses its grid connection and the plant it depends on has seconds
to decide whether the refinery keeps running or goes dark. Restart after an
uncontrolled shutdown costs a day of production, a flare event and a
mechanical inspection.

We have configured and commissioned the control algorithms that keep a
refinery CHP plant supplying its refinery after separation from the grid:

- Detection of grid separation and transfer of the turbine governor from
  droop to isochronous control
- Fast load rejection to house load, with the machine held on its own
  auxiliaries
- Load shedding of non-critical consumers by priority, sequenced so that
  the frequency excursion stays inside the turbine's tolerance
- Frequency and voltage control in the islanded network
- Resynchronisation to the grid once it returns

The algorithms were tested on the running plant, not only in simulation.
Turbine acceptance testing on the same units included disconnection of the
generator from the grid, which is the same event under controlled conditions.

## Automatic boiler start-up

Starting a boiler by hand ties up an operator for hours and produces a
different result every time, because the sequence depends on who is running
it. We implement automatic start-up from a hot state as a sequence in the
DCS: purge, burner light-off through the burner management system, ramp to
minimum stable load against the drum thermal stress limits, and hand-over to
load control.

The value is repeatability. The same ramp, the same stress on the drum, the
same fuel consumed, whoever is on shift.

---

# PAGE: /power-plant-performance-calculation.html — add a new h2 section
# after "Comprehensive Performance Monitoring Solutions"

## Technical and economic performance indicators for CHP plants

A combined heat and power plant makes two products from one fuel stream, and
there is no physical measurement that separates them. The fuel has to be
allocated between electricity and heat by a chosen method, and that choice
determines the cost of steam against the cost of a kilowatt-hour — which is
to say it determines tariffs, internal transfer prices and what the plant
appears to be worth.

We implement the calculation as part of the control system, with the
allocation method the plant is required to report under:

- Specific reference fuel consumption for electricity supplied
- Specific reference fuel consumption for heat supplied
- Boiler efficiency, gross and net, by direct and indirect method, for gas
  and for petroleum coke fired circulating fluidized bed boilers
- Steam turbine efficiency, heat rate and losses against the factory
  characteristic
- Auxiliary power consumption as a share of generation
- Fuel heat utilisation factor
- Thermal balances and electrical energy balances
- Balances for water, steam, gas and electricity, technical and commercial

Under the physical method used in Romanian and post-Soviet practice, heat
supplied from a CHP plant is charged at the specific fuel consumption of an
equivalent boiler house and the remainder of the fuel is charged to
electricity. Exergy-based and market-based allocation give different answers
from the same measurements. We implement whichever the plant reports under,
and can run two in parallel where the plant answers to more than one
regulator.

The output is not a report someone assembles at month end. It is a live
figure on the operator's screen, archived, with the cost of each deviation
from design attached to it.

---

# PAGE: /industries/oil-and-gas.html — replace the whole body

## Automation for refineries and gas facilities

We have worked on refinery and gas infrastructure since 2007, from the
combined heat and power plant that supplies a refinery to the gas
distribution station that feeds it.

## Hazardous area instrumentation

Refinery process areas are classified, and the control system has to cross
that boundary without carrying energy into it. We design intrinsically safe
circuits and specify the equipment that terminates them: isolating barriers
and interface modules rated for Zone 2, cable and gland selection,
segregation of intrinsically safe and non-intrinsically safe wiring inside
the cabinet, and the loop calculations that prove the circuit stays within
the ignition limits.

## Burner management and safety instrumented systems

Burner management for fired equipment, and safety instrumented functions
specified, implemented and verified under the functional safety lifecycle of
IEC 61511. We have taken part in the certification of SIL 2 and SIL 3
applications, on HIMA HIQuad, Foxboro Triconex and ABB AC800 logic solvers.

## Combined heat and power for refineries

A refinery CHP plant is a refinery utility before it is a power plant. Our
work on one has covered gas-fired boilers, a 260 t/h circulating fluidized
bed boiler firing petroleum coke, steam turbines, coordinated plant load
control, and island mode operation that keeps the refinery running when the
grid connection is lost.

## Emissions and particulate control

Electrostatic precipitators and baghouse filters: design, P&ID, cabling,
panel design, specifications and the control that runs them, integrated into
the plant control system rather than left as an island.

## Data to the people who need it

Process data collected from control systems and from commercial metering,
archived, and delivered to the departments that act on it — unit efficiency
to the process engineer, emissions to the environmental engineer, cost and
consumption to the finance department.

## Platforms

Emerson Ovation · ABB Industrial IT 800xA · ABB Symphony · Siemens PCS7 ·
Yokogawa Centum VP · HIMA HIQuad · Foxboro Triconex · Honeywell PHD ·
OSIsoft PI System

---

# PAGE: /industries/cement-and-coal.html — replace the whole body

## Automation for cement and coal processes

Cement production runs in batches; coal handling runs continuously at
capacity. The two make opposite demands on a control system, and both punish
imprecision in the same way — through the fuel bill.

In cement, the ratios of aggregates, cement, water and additives determine
whether the concrete meets its specification. In coal, humidity, dosing and
granulation determine whether the fuel burns completely. Incomplete
combustion shows up as reduced calorific yield and higher consumption for the
same output.

## What we have built

Dosing and ratio control for batch processes, with correction for material
moisture.

Solid fuel handling and allocation across feeders by calorific value, for a
260 t/h circulating fluidized bed boiler firing petroleum coke, coal, gas and
fuel oil, with automatic calculation of the coke calorific value from the
combustion result.

Combustion air control, primary and secondary, and an oxygen cascade
controller referenced to the boiler operating mode and the fuel in use.

SO2 and NOx control through furnace temperature and lime dosing.

Emissions and particulate handling: a fifth electrostatic precipitator, and a
baghouse filter — design, P&ID, cabling, panels and specifications.

Boiler hall HVAC and smoke extraction for the CFB boiler, engineered with the
plant designer, the equipment supplier and the boiler manufacturer.

## Fuel accounting

Where fuel quality varies — and with petroleum coke it varies constantly —
the boiler efficiency calculation has to follow it. We implement the
efficiency calculation by direct and indirect method inside the control
system, so that a change in fuel shows up as a number rather than as a
surprise at month end.

---

# PAGE: /industries/control-centers.html — replace the whole body

## Control room design

ISYSTEMS AUTOMATION designs, manufactures and supplies control room equipment
and operator furniture. Clients include LUKOIL Energy and Gas, Dalkia Termo
Prahova and Nuclearelectrica.

A control room is a workplace that runs continuously for twenty years. What
matters is not the furniture catalogue but whether an operator on the eleventh
hour of a night shift can still read the screen, hear the alarm and reach the
control.

## What the design covers

**Acoustics.** Reverberation and background noise controlled so that speech
between operators and an audible alarm both work in the same room.

**Layout.** Sightlines to the overview display from every console position,
circulation that does not cross behind a working operator, and access for
maintenance without entering the operating area.

**Lighting and microclimate.** Illuminance and glare control for screen work,
temperature and air distribution for a room full of continuously running
equipment and continuously present people.

**Power supply.** Distribution, backup and changeover for consoles, displays
and the control system, so that a supply fault does not blind the operator.

**Auxiliary equipment.** Overview displays, video walls, communications and
the cable routes that serve them.

**Materials and maintenance.** Surfaces and construction chosen for a
twenty-year service life, and for repair without rebuilding the room.

**Operator interface.** The console itself, the arrangement of screens and
controls on it, and the relationship between what the operator sees and what
the process is doing.

## Together with the control system

We design control rooms for plants whose control systems we also work on. The
console arrangement, the overview display content and the alarm philosophy
are decided together, not handed over separately to be reconciled on site.

---

# PAGE: /cybersecurity.html — NEW PAGE

## Control system cyber security

A distributed control system is not an IT system. It cannot be patched on
Tuesday, it cannot be rebooted for an update, and the vendor's supported
release may be years behind what the IT department considers current. The
consequence is that plant control systems drift out of support and stay there.

We treat this as part of the maintenance scope, not as a project.

## What we do

**Keep assets at a supported release level.** Vendor lifecycle tracking for
the installed DCS, ESD and historian software, with an upgrade path planned
against the plant's outage schedule rather than against a calendar.

**Patch and release management.** What can be applied online, what requires a
shutdown, what the vendor has validated, and what has to wait. Recorded, so
that the answer to "what version is running" does not depend on who is on
shift.

**Backup and recovery.** A backup regime for every control system asset that
allows a system to be restored quickly enough to keep the plant running after
a failure. Tested by restoring, not by checking that the job completed.

**Separation.** Segregation between the control network and the business
network, and control of the paths that necessarily cross it — engineering
workstations, historian data flows, remote access for support.

**Remote access.** Where we provide remote support, the access path is part of
what we secure, not an exception to it.

## Products with digital elements

Regulation (EU) 2024/2847, the Cyber Resilience Act, obliges manufacturers of
products with digital elements to report an actively exploited vulnerability
within 24 hours of becoming aware of it, and to file a full notification
within 72. The reporting obligations apply from 11 September 2026.

We built and operate that procedure for our own product line: reporting
roles, the awareness timestamp that starts the clock, an incident register,
CycloneDX SBOM generation in the build pipeline, monthly reconciliation
against published vulnerability sources, and a coordinated disclosure policy.
This is described in more detail under Compliance and Testing.

---

# PAGE: /service/manufacturing-execution-system.html — replace the whole body

## Manufacturing execution systems

An MES earns its place when a number that used to arrive at month end arrives
during the shift that can still act on it.

## What we implement

**Real-time production visibility.** Unit and plant output, against plan and
against capability, on the screen of the person responsible for it.

**Equipment condition and maintenance planning.** Running hours per item,
condition indications from the control system, and maintenance planned
against them rather than against the calendar.

**Cost and profit in real time.** Production cost and margin under current
operating conditions, so that a change in fuel price or product mix is
visible while the operating decision is still open.

**Production forecasting.** Expected output and profit under current
conditions, for planning.

**Loss and downtime analysis.** Uncontrolled and emergency stops recorded,
classified and analysed, with the cost attached.

**Energy accounting.** Technical and commercial accounting for electricity,
water, air, steam and gas.

**Reporting to the department that acts on it.** Unit efficiency to the head
of installation, economic reports to finance, shift efficiency to the shift
head, raw material requirements to supply. The same data, different questions.

**Operator performance across shifts.** Comparison by shift, day, week, month
and year, which is a management tool and, handled badly, a way to lose the
control room. We implement it as process analysis, not as surveillance.

## Platforms and integration

Honeywell PHD and OSIsoft PI System, taking data from DCS Emerson Ovation and
DCS ABB Industrial IT over OPC and from SCADA and commercial metering over
Modbus, with central long-term archiving.

---

# PAGE: /service/process-optimization-advanced-process-control.html —
# replace the "Introducing: Advanced Process Optimization Solutions" section

## What we actually control

Advanced process control is a specific set of loops, not a philosophy. On
power plant and refinery utilities we have implemented and commissioned:

**Coordinated plant load control.** Boiler and turbine controlled as one unit
against a load target rather than separately against local setpoints.

**Primary and secondary frequency control.** Response to grid frequency
deviation, and to dispatch, with the response measured at acceptance rather
than assumed.

**Solid fuel allocation by calorific value.** Distribution of fuel across
feeders according to heat value, with automatic calculation of the calorific
value of petroleum coke from the combustion result.

**Steam temperature control.** Cascade regulators working against a
superheater model, rather than a single loop chasing an outlet measurement.

**Combustion air and oxygen.** Primary and secondary air control, with an
oxygen cascade controller referenced to boiler mode and fuel.

**Emissions.** SO2 and NOx regulation through furnace temperature and lime
dosing, held against the permit limit rather than against a comfortable
margin.

**Automatic boiler start-up from a hot state.** As a DCS sequence, with the
same ramp and the same drum stress every time.

**Island mode and load rejection.** Governor transfer, load shedding by
priority, and frequency control in the islanded network.

## Continuous performance work

After commissioning, control loop performance is monitored, loops are
retuned, and alternative control strategies are implemented where the
existing one limits the unit. Deviations that indicate a developing problem
are reported with the corrective measure, not only the alarm.

---

# PAGE: /service/process-automation.html — replace the "Industrial Automation
# Services" opening and the "Consulting Services" / "Customized Design
# Solutions" / "Turnkey Project Execution" sections

## Engineering

**Control system architecture.** Conceptual architecture for DCS, and for ESD
and burner management systems, including the redundancy and segregation
decisions that are expensive to change later.

**I/O database and control logic.** Signal database, control logic, control
narratives, HMI design and alarm schemes, developed as documents the plant
can maintain rather than as configuration only the integrator can read.

**Design verification.** Verification of I&C design documentation against
local and international standards, whether we produced it or someone else did.

**Documentation.** P&ID, cable schedules, panel design, hook-up drawings, and
as-built documentation updated to site reality during commissioning rather
than reconstructed afterwards.

**Procurement.** Specification and procurement of control and instrumentation
equipment.

## Testing and commissioning

**Factory acceptance testing.** Test procedures written against the
specification, and FAT witnessed at the vendor — we have run FAT with Emerson
and ABB on systems we specified.

**Site work.** Supervision of installation and inspection of DCS, ESD and
field instrumentation. Loop testing, functional testing and loop tuning.

**Handover.** Operator training on the control schemes as built, and support
through check-out and start-up.

---

# PAGE: /company.html — replace the opening and add sections

## What we do

ISYSTEMS AUTOMATION is an engineering company founded in 2007 in Ploiești,
Romania. We develop control systems and optimise technological processes in
power generation, chemistry and oil refining.

Work covers the full cycle: pre-project survey, design and working
documentation, installation or installation supervision, and commissioning.

We design, manufacture and commission automatic control systems, emergency
automation and incident recorders, dispatch systems, and automated systems for
technical and commercial accounting of electricity, water, air and steam.

The team brings together industrial automation specialists, programmers and
test engineers.

## Platforms

ABB Industrial IT 800xA · ABB Symphony · Emerson Ovation · Siemens PCS7 ·
Siemens TIA Portal · Yokogawa Centum VP · HIMA HIQuad · Foxboro Triconex ·
Allen-Bradley ControlLogix · Honeywell PHD · OSIsoft PI System

## Quality management

Certified to ISO 9001 since 2009.

## Our own products

ISYSTEMS AUTOMATION manufactures a line of eleven DIN-rail automation modules
under the HomeMaster brand, taken through EU conformity assessment for EMC,
LVD, RED and RoHS, with Declarations of Conformity issued for every product.
The test capability built for that work is described under Compliance and
Testing.

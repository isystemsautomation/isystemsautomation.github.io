# Addendum 3 — project record from the client recommendation letter

Sourced from a signed recommendation letter by the General Manager of the
refinery CHP operator, plus the plant scheme annexed to it. Everything below
is evidence-backed and can be substantiated on request.

Client naming convention: sites operated by sanctioned entities are described
by plant type and location, not by brand. The recommendation letter itself is
supplied on request, not published. Named clients elsewhere on the site
(Dalkia Termo Prahova, Nuclearelectrica, Azomureș, TIAB) stay named.

Apply with `page-copy-expansion.md` and `page-copy-expansion-2.md`.

---

# PAGE: /references.html — replace the "Project list" section entirely

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

## Project list

Newest first. Years are as recorded by the client.

2022–present · Control system maintenance, refinery CHP plant, Ploiești ·
Emerson Ovation, ABB Industrial IT 800xA, HIMA HIQuad, Honeywell PHD

2019–2021 · Combined cycle power plant, Pančevo, Serbia · owner's engineer:
review of I&C design documentation, signal databases, HMI and control
algorithms; FAT and SAT; supervision of installation and commissioning ·
Emerson Ovation, ABB Symphony Plus, Foxboro Triconex, ABB AC800

2019–2021 · HMI architecture for the same plant: two gas turbines and a steam
turbine, fuel gas systems, SIL 3 integration, unit load control, and the DCS
grounding scheme

2020–2021 · Hydroelectric power plant, Krasnaya Polyana, Russia · hydro
turbine control · Siemens S7-300 / S7-1500 / S7-1200, TIA Portal

2019 · Hydroelectric power plant, Belorechensk, Russia · hydro turbine
control · Yokogawa Centum VP

2018–2019 · Sludge dosing, CFB boiler · pump, variable speed drive, valves,
sequences, historian and MES integration · Emerson Ovation 3.5.1 with HIMA

2017–2018 · Automatic boiler start-up, boiler No. 3, 100 kgf/cm² at 540 °C,
nine burners · purge, light-off through the burner management system, ramp
against drum thermal stress limits, hand-over to load control · to SR EN
12952

2017 · Flue gas desulphurisation and dedusting, CFB boiler · dedusting and
lime blower algorithms · Emerson Ovation 3.2

2017 · Electrical retrofit for DCS interfacing at the refinery flare · motor
feeder cells, oil pump, protection relays and 4–20 mA interfacing

2016–2017 · Manufacturing execution system, refinery CHP plant · central
archive of production data, boiler, turbine and auxiliary equipment
efficiency, plant balance and losses, plant fuel efficiency · approximately
9,150 tags over OPC from the CHP plant, the photovoltaic park and commercial
metering

2015 · Central control room, design and construction

2015 · Island mode operation · algorithm implemented in the DCS and proven on
the running plant in two trials, holding 13–14 MW in the island, agreed with
the transmission and distribution system operators

2014 · Photovoltaic park SCADA · GE D400 and National Instruments CompactRIO,
inverter communication over Modbus, P and Q setpoint control, reporting to
the transmission system operator over IEC 60870-5-101 and to the market
operator over IEC 60870-5-104; cabinets, HMI, delivered in 32 days

2014 · Plant-wide protection algorithms · four turbines, four boilers and
auxiliary equipment

2013–2016 · Plant coordinated control · four turbines, four boilers and
auxiliaries controlled as one unit against a load target, with real-time
optimisation

2013–2015 · Turbine 4 · primary frequency control, secondary load control and
island mode algorithms

2011–2018 · Multi-plant coordinated control · the CHP plant, a photovoltaic
station and a wind farm dispatched as a single balancing group, with the
steam turbine as the regulating machine

2015 · Advanced control on all four boilers · performance monitoring system,
combustion optimiser, steam temperature and pressure optimiser, fuel
optimiser, SOx and NOx emission optimiser

2013 · Fifth electrostatic precipitator · design, P&ID, cabling, panels,
specifications

2013 · Baghouse filter · documentation, schematics, specifications

2012 · Boiler hall HVAC and smoke extraction for the 260 t/h CFB boiler, with
the plant designer, the equipment supplier and the boiler manufacturer

2012 · Turbine TA5, Dalkia CHP plant, Ploiești · I&C and DCS: P&ID, panels,
cable schedules, turbine interfaces, HMI

2011 · Steam turbine, Dalkia CHP plant, Ploiești · Siemens PCS7, S7-400 /
S7-300

2011 · Control room, design and construction

2010–2012 · Boiler 4 · DCS hardware and software, design, project management,
engineering for power-up, commissioning, testing, tuning and training

2010 · Boiler 3 instrumentation and control, CHP plant, Teleajen ·
schematics, signal databases, ISA drawings, as-built documentation

2010 · Operator console panels for control rooms

2010 · Plant automation, Kazakhstan · Allen-Bradley ControlLogix

2008–2009 · Boiler 3 · DCS hardware and software, design, project management,
engineering for power-up, commissioning, testing, tuning and training

2008–2009 · Gas distribution station, Atyrau, Kazakhstan · ABB SCADA

2007–2008 · Turbine 4 · DCS hardware and software, design, project
management, engineering for start-up, commissioning, testing, tuning and
training

2007–2018 · Control system maintenance, refinery CHP plant, continuous

Client names and a signed client recommendation are available on request
under NDA.

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

# Addendum 4 — Combined cycle power plants

Sourced from the subcontractor agreement, the rendered service reports and the
2021 offer for the Pančevo CCPP project. The scope items below are the actual
terms of reference lines from that contract, not a description written after
the fact.

Client naming: the site operator is described by plant type and location, not
by brand, in line with the convention used elsewhere. Contract references and
signed service reports are supplied on request.

This page exists to be found. The vocabulary a buyer or a search engine uses
for this work — combined cycle power plant, CCPP, ACS, DCS, gas turbine, HRSG,
steam turbine, owner's engineer — is used deliberately and repeatedly. Do not
paraphrase it away.

---

# PAGE: /combined-cycle-power-plants.html — NEW PAGE

## Control systems for combined cycle power plants

A combined cycle power plant is three machines that have to behave as one: a
gas turbine, a heat recovery steam generator and a steam turbine, each with
its own dynamics, tied together by a control system that has to hold the unit
on load while any one of them is changing state.

ISYSTEMS AUTOMATION has worked on CCPP automatic control systems as the
investor's representative — the engineer who checks that what the design
organisation and the DCS supplier deliver is what the plant will actually be
able to operate.

## CCPP project experience

**Combined cycle power plant, Pančevo, Serbia, 2019–2021.** Two gas turbines
and one steam turbine. Automatic process control system on Emerson Ovation
and ABB Symphony Plus, with safety instrumented systems on Foxboro Triconex
and ABB AC800 at SIL 3.

Our scope covered the ACS from design review through to trained operators:
HMI architecture for both gas turbines and the steam turbine, fuel gas
systems, unit load control, and the DCS grounding scheme. Contracted work
over the final year alone ran to 1,980 engineering hours.

## Owner's engineer scope for a CCPP control system

This is the full scope we contracted for and delivered. It is also, in
practice, the checklist an investor needs when someone else is building their
control system.

**Design documentation**
- Verification of compliance of the design for execution documentation
- Review of the completeness and quality of the developed control algorithms,
  representing the interests of the client within the design organisation
- Review of the completeness and quality of the signal database
- Participation in the review and approval of video frames and mnemonic
  schemes

**Schedule**
- Participation in the development of time schedules for the execution of
  works on instrumentation and control equipment, ACS and DCS
- Monitoring of execution against those schedules
- Where deviations occur, informing the client of the causes and of the ways
  to eliminate them

**Equipment**
- Participation in the inspection of instrumentation and control equipment,
  ACS and DCS at the manufacturers, in accordance with the quality control
  programmes
- Participation in taking over instrumentation and control equipment, ACS and
  DCS at site, including entrance control

**Erection and commissioning**
- Quality control of erection works and commissioning execution on
  instrumentation and control equipment, ACS and DCS
- Review of test and commissioning programmes, with recommendations
- Participation in commissioning, including the performance test

**Operators**
- Development of training programmes and training of CCPP operating personnel

**Throughout**
- Participation in technical meetings representing the interests of the
  investor

## Why the investor needs their own engineer

On a CCPP the design organisation, the DCS supplier and the erection
contractor each have a defensible reading of the specification, and the
readings do not agree. Every disagreement that is not resolved on paper is
resolved during commissioning, at the point where it costs the most and where
the investor has the least leverage.

The work is unglamorous: reading algorithm sheets against the functional
specification, checking that the signal database matches the P&IDs, sitting
through a factory inspection and asking what was not demonstrated. It is also
where the money is, because a control system accepted with defects becomes a
plant that runs below specification for twenty years.

We do this because we have also been on the other side of it. The same
engineers have designed, commissioned and maintained DCS on operating plant
for two decades — four turbines and four boilers of an industrial CHP plant,
continuously from 2007. Reviewing someone else's algorithms is a different
job from writing your own, and it is much easier if you have written your own.

## HMI architecture for CCPP

An operator on a combined cycle unit has to see three machines and one unit
at the same time. We developed the HMI architecture for a CCPP covering:

- Unit overview: gas turbines, HRSG, steam turbine and the electrical
  connection on one picture
- Per-machine displays for gas turbine 1 and gas turbine 2, including fuel
  gas systems
- Steam system displays across the pressure levels
- Unit load control
- SIL 3 safety system status integrated into the operator picture rather than
  left on a separate panel
- The DCS grounding scheme, to the supplier's requirements

## Platforms

Emerson Ovation · ABB Symphony Plus · ABB Industrial IT 800xA ·
Foxboro Triconex · ABB AC800 · Siemens PCS7 · Yokogawa Centum VP ·
HIMA HIQuad

## Related

Gas and steam turbine control, island mode operation and plant coordinated
control are covered under Power Generation. Factory and site acceptance
testing is covered under Acceptance Testing.

---

# PAGE: /industries/power-generation.html — add a short h2 section linking out

## Combined cycle power plants

Two gas turbines, a heat recovery steam generator and a steam turbine
controlled as one unit, with SIL 3 safety systems. We have acted as the
investor's representative on a CCPP automatic control system from design
review through commissioning and operator training — see Combined Cycle
Power Plants.

---

# PAGE: /acceptance-testing.html — add to the "Independent verification"
# section

We have carried out this role at scale: on a combined cycle power plant,
verification of design for execution documentation, review of control
algorithms and signal databases, inspection of instrumentation and control
equipment at the manufacturers under their quality control programmes, entrance
control at site, quality control of erection and commissioning, and review of
test and commissioning programmes — all as the investor's representative.

---

# PAGE: /references.html — add to the project list, replacing the two
# existing Pančevo lines

2019–2021 · Combined cycle power plant, Pančevo, Serbia · investor's
representative for the automatic process control system: verification of
design for execution documentation, review of control algorithms and signal
databases, mnemonic scheme approval, schedule monitoring, equipment inspection
at the manufacturers, site entrance control, quality control of erection and
commissioning, review of test and commissioning programmes, participation in
the performance test, and training of operating personnel · two gas turbines
and one steam turbine · Emerson Ovation, ABB Symphony Plus, Foxboro Triconex,
ABB AC800 at SIL 3

2019–2021 · HMI architecture for the same plant: unit overview, gas turbine 1
and 2 including fuel gas systems, steam systems, unit load control, SIL 3
status integration, and the DCS grounding scheme

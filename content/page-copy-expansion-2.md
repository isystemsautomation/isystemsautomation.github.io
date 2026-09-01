# Addendum to page-copy-expansion.md

Two competences confirmed after the first pass. Apply together with
`content/page-copy-expansion.md`, same rules: verbatim, no marketing
adjectives added.

---

# PAGE: /acceptance-testing.html — NEW PAGE

## Factory and site acceptance testing

When a plant buys a control system, the vendor writes the test procedure, the
vendor runs the test, and the vendor decides what counts as a pass. The buyer
signs. That arrangement works until something in the specification was never
actually tested, and by then the system is installed.

We act for the buyer. We have written test procedures, witnessed factory
acceptance tests at Emerson and at ABB, and run site testing on DCS, ESD and
burner management systems on plants in operation.

## Factory acceptance testing

**Test procedures written against the specification.** Not against the
vendor's standard checklist. Every requirement in the functional specification
becomes a test with a defined pass criterion, including the ones the vendor
would rather demonstrate than test.

**Simulation of the field.** I/O forced and simulated across the full signal
range, not only at the values that behave. Failure modes exercised:
open circuit, out of range, communication loss, power loss to a segment.

**Redundancy proved by failure.** Controller changeover, network changeover
and power supply changeover tested by removing the primary, under load, with
the process simulation running — not by reading a status indication.

**Safety system logic against the cause-and-effect matrix.** Every input
combination that the matrix defines, and the ones it does not, to establish
what happens outside the specified envelope.

**Punch list with severity.** What blocks shipment, what can be closed on
site, and what is a specification defect rather than a build defect. Recorded
so that the same item cannot quietly change category later.

## Site acceptance testing

**Loop checking.** Field device to control system to operator display,
end to end, per loop, against the loop drawing.

**Functional testing.** Interlocks, sequences and permissives exercised
against the control narrative, with the process in a defined state.

**Loop tuning.** Controllers tuned on the running process rather than left at
the values that survived the factory test.

**Safety system proof testing.** Trip functions demonstrated from the sensor
through the logic solver to the final element, with response times measured.

**Documentation reconciled to reality.** As-built drawings and signal
database updated to what was actually installed, which is never exactly what
was designed.

## Independent verification

We also verify I&C design documentation against local and international
standards on behalf of a buyer, whether or not we take part in the testing —
before construction, when a finding still costs a drawing revision rather than
a shutdown.

## Platforms we have tested on

Emerson Ovation · ABB Industrial IT 800xA · ABB Symphony · Siemens PCS7 ·
Yokogawa Centum VP · HIMA HIQuad · Foxboro Triconex · ABB AC800

---

# PAGE: /industries/control-centers.html — replace the section heading
# "What the design covers" and its introduction, keep the seven bullet
# subsections that follow it unchanged

## Designed to ISO 11064

Control room design is a standard, not a matter of taste. ISO 11064,
*Ergonomic design of control centres*, covers the arrangement of the control
suite, the layout of the workstation, displays and controls, and the working
environment. We design to it.

The standard exists because control rooms fail in predictable ways: an
operator who cannot see the overview display from the position where the
alarm arrives, a room where two operators cannot hold a conversation over the
ventilation, a console that forces a reach the operator will stop making by
the third month. These are design faults, not operator faults, and they are
avoidable at the drawing stage.

What the design covers:

---

# PAGE: /service.html — add two teaser cards, matching the existing ones

  Factory and Site Acceptance Testing
    Test procedures, FAT witnessing at the vendor, site loop and functional
    testing, and independent verification of I&C design documentation.
    -> /acceptance-testing.html

  Control System Cyber Security
    Lifecycle and patch management, backup and recovery, network separation
    and secure remote access for DCS, ESD and historian systems.
    -> /cybersecurity.html

---

# PAGE: /service/process-automation.html — the "Testing and commissioning"
# section from page-copy-expansion.md stays, but shorten it to three lines
# and link out, since the detail now lives on its own page

## Testing and commissioning

Test procedures written against the specification, factory acceptance testing
witnessed at the vendor, site loop and functional testing, loop tuning, and
operator training on the control schemes as built.

We also carry out acceptance testing and design verification for buyers of
systems we did not supply — see Factory and Site Acceptance Testing.

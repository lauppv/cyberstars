No new theory, just a challenge that uses a template, a form with labels, a required box and a list to pick from.

---

## Mission: Report a starship

The crew sometimes sees a starship before the tracker knows about it. They want to report it from the tracker page, and see their reports in a list under the form.

**Example**: under the list of starships, a part with a heading such as "Report a starship", a box for the starship's name, a list to pick its class from, and a button that sends the form. Under the form, an empty list, and a template for one report in it. A report later shows something like `Comet Runner Explorer`.

- Under the list `ships`, a form with the id `sighting-form`. In it, a box for the starship's name (id and name `sighting-name`) that can't be left empty, and a list to pick its class (id and name `sighting-class`) with the options `Cargo`, `Shuttle` and `Explorer`. Each has a label that takes you to it.
- A button in the form sends it. A form without a name isn't sent, and a form with one sends it.
- Under the form, an empty list with the id `reports`, and a template with the id `report-template` that holds one list item with the class `report`. Inside it, the name (class `report-name`) and the class (class `report-class`), each with some text that shows where the real one goes.

Psst, a button in a form sends it unless its `type` says otherwise :)

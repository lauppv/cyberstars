No new theory, just a challenge that uses modules, `export` and `export default`, `import`, a class with a constructor and a method, and destructuring.

---

## Mission: Tidy reports

The report form is the last part of the tracker that still does everything in `tracker.js`: it sends the starship, then builds the report item itself. Give each job its place.

**Example**: the report form works exactly as before: type `Comet Runner`, pick `Explorer`, press the button, and `Comet Runner Explorer` shows in the reports. Rest the mouse on it, and a box says `Report 6`, with the id the API gave it.

- `reportShip` moves from `tracker.js` to `api.js`, which exports it, and `tracker.js` imports it from there.
- A new file, `report.js`, exports by default a class `Report`. Its constructor takes a starship as the API answers it, and keeps its `id`, its `name` and its class as `kind`. Its method `toItem()` returns a copy of the template `report-template` with the name and the class filled in, and `Report ` and the id as the item's `title`.
- When the form is sent, `tracker.js` makes a `Report` from the API's answer and puts what `toItem()` returns in the list `reports`. It doesn't fill in the template itself any more.
- A report that fails still says why in `#report-status`, and the rest of the tracker works as before.

Psst, the report is made from the API's answer, not from the form's boxes :)

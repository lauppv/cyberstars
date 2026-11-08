Your schedule's script reads the board into objects, decides with `if` and `else if`, loops, filters, sorts and switches classes. The last mission of the station site puts them all on one question every traveller asks: what leaves next?

Worth keeping in mind:

- **`===`, never `==`.**
- **The first true condition wins** in an `else if` chain; put the specific cases first.
- **`while`** when you know when to stop, not how many rounds.
- **`filter` builds a new array**; **`sort` changes the one it's called on**, so sort a copy.
- **A comparator returns negative, zero or positive**; `localeCompare` does it for strings.
- **Classes for the look, set from the script with `classList`.**

---

## Mission: Next Departure

- Over the flights table, add `<p>Station time: <span id="station-time">09:00</span></p>` and an empty paragraph with the id `next-departure`.
- The next departure is the earliest flight that isn't cancelled and leaves after the station time. Write `Next departure: SL-102 to Mars Relay at 09:45`. If no flight is left, `No more departures today`.
- Give the next departure's row the class `next`, and make the text of its cells `#ffd166`.

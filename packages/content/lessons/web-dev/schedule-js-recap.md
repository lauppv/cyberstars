Your schedule's script reads the board into objects, decides with `if` and `else if`, loops, filters, sorts and switches classes. The last mission of the station site puts all of that to work on the question every traveller asks: what leaves next?

There are no steps to follow. Before you write anything, work out on paper which flight should be the answer for a few different station times, including a time when every flight has left. Then make your script give the same answers.

---

## Mission: Next Departure

- Over the flights table, add a sentence with the station's current time: **Station time: 09:00**, with the time in an element with the id `station-time`. Under it, an empty paragraph with the id `next-departure`.
- The next departure is the earliest flight that isn't cancelled and leaves after the station time. The paragraph names it: `Next departure: SL-102 to Mars Relay at 09:45`. When no flight is left, it says `No more departures today`. It follows the station time and the table.
- The next departure's row gets the class `next`, and its cells stand out from every other row, still easy to read.

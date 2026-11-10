No new theory, just a challenge that uses this part's JavaScript: comparisons, `if`, loops, objects, `filter` and `sort`, and the page.

This time nobody tells you which lines to write. Read what the passengers need, and put it together yourself. If the answer is wrong, log your `flights` and your sorted list: the console shows exactly what they hold.

---

## Mission: The next departure

Passengers want one line that says which flight leaves next.

**Example**: under the introduction, a line says the station's time, and under the flight table a paragraph says:

```text
Station time: 09:00
Next departure: SL-102 to Mars Relay at 09:45
```

- A paragraph `Station time: ` with the time in a `span` with the id `station-time`.
- A paragraph with the id `next-departure` says `Next departure: `, then the code, `to`, the destination, `at` and the time of the earliest flight that leaves after the station time and isn't cancelled.
- If there is none, it says `No more departures today`.
- It follows the page: change the station time, and the next departure changes too.

Psst, `filter` first, then `sort` a copy :)

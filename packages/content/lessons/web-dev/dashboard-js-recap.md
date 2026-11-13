No new theory, just a challenge that uses this part's JavaScript: `includes`, `indexOf`, `slice`, `join` and `split` on arrays, `map`, `filter`, `reduce`, `find`, `some` and `every`, objects with `for...in`, `Object.keys`, `Object.values` and `Object.entries`, dates, timers, and videos and sounds from a script.

Every morning, the commander reads a short report to the crew. It takes the numbers from all over the dashboard. The dashboard could write it.

---

## Mission: The morning report

**Example**: after the supplies, a part such as "Morning report" with a button. On Wednesday 14 May 2031, a click on it writes:

```text
- Report for Wednesday, May 14, 2031
- On duty: 6, led by Vega and Orion
- Lowest supply: Oxygen at 18%
```

- After the supplies, a new part with a heading, a button with the id `morning-report`, and a list with the id `report`, empty until the button is pressed.
- A click writes three lines in the list, one item each:
  - `Report for `, then today's date as on the dashboard: the day of the week, the month in words, the day and the year.
  - `On duty: `, how many names the duty list has, `, led by `, then the first two names with ` and ` between them.
  - `Lowest supply: `, the name of the supply with the lowest level in the whole table, ` at `, its level, then `%`.
- Another click writes the report again: the list never holds more than its three lines.

Psst, the lowest supply isn't always the first one under 25 :)

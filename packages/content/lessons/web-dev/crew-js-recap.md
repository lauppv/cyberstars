No new theory, just a challenge that uses this part's JavaScript: loops, functions, `createElement` and `append`, and reading the page.

This time nobody tells you which lines to write. Read what the crew needs, and put it together yourself.

If nothing happens, open the console. If a list doesn't keep up, look for an old snapshot.

---

## Mission: Roll call

Every morning, the commander presses a button to call the roll.

**Example**: under the welcome list, a button says `Roll call`. A click fills a numbered list under it with every name of the crew list, each followed by ` - present`, and a paragraph under that says how many answered:

```text
1. Mara Vega - present
2. Tomas Okafor - present
3. Ines Lindqvist - present
4. Kenji Arano - present

4 crew members answered
```

- A button with the id `roll-call-button`, an empty numbered list with the id `roll-call`, and an empty paragraph with the id `roll-summary`.
- A click fills `#roll-call` with an item for every name of the crew list at that moment, in order: the name followed by ` - present`.
- `#roll-summary` then says how many items `#roll-call` has, followed by ` crew members answered`.
- A second click doesn't add the names twice: the list starts again from empty.

Psst, `textContent = ""` empties an element :)

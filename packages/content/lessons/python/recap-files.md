Put together writing and reading files, `with`, reading line by line, and JSON

---

## Mission: Station Logbook

Every event on the station goes into a log, one line each: a time and what happened, like `08:15 dock opened`. At the end of the day the computer counts the events of each hour and keeps that summary as JSON, for the weekly report

1. Start your program with a variable **events**, a list of strings, each a time `HH:MM`, a space and a text. For example `events = ["08:15 dock opened", "08:40 crew lunch", "13:05 dock closed"]`
2. Write the events to `events.txt`, one on each line, with a `with` block
3. Read `events.txt` line by line and count the events of each hour: the hour is the two digits before the colon. Keep the hours in the order they first appear
4. Save the counts to `summary.json` with `json.dump()`, then load them back with `json.load()`
5. From the loaded data, print one line for each hour: the hour, `: ` and its number of events. Then print `Busiest: ` and the hour with the most events, the first one if several have as many. Then print `Bytes: ` and how many characters the text of `summary.json` has

**events** has from 1 to 20 events, already in time order

**Example** for the events above

```text
08: 2
13: 1
Busiest: 08
Bytes: 18
```

The text of `summary.json` is `{"08": 2, "13": 1}`, which has 18 characters

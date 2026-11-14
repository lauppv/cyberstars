Yesterday afternoon, for about twenty minutes, nobody could pay on an online bookshop's website. The checkout page showed an error, payments failed, and the shop got forty angry emails. Now the team wants a post-mortem: a report that says what broke first, what followed, and when it was over. Three services were part of it (the website, the payment service and the database), and each one kept its own log. You will put the logs together into one timeline and find the cause.

**What you start with.** Three logs in `~/incident`: `web.log`, `payments.log` and `db.log`. Every line starts the same way: the date, the time, and a level:

```text
2026-11-05 13:40:28 INFO GET /checkout 200
```

**What you make.**

| File             | What it holds                                                                     |
| ---------------- | --------------------------------------------------------------------------------- |
| `timeline.txt`   | the lines of all three logs, in time order, each one with the name of its service |
| `window.txt`     | only the lines from 14:00 to 14:30                                                |
| `cause.txt`      | the first error, the one that started it all                                      |
| `postmortem.txt` | the report, in six lines                                                          |

Some words you will meet:

| Word        | What it means                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------- |
| service     | one program of the shop: the website, the payments, the database                                        |
| log         | a file where a service writes a line each time something happens                                        |
| level       | how serious a line is: `INFO` (all is well), `WARN` (something looks wrong), `ERROR` (something failed) |
| outage      | the time when something doesn't work                                                                    |
| post-mortem | a report written after an outage: what happened, and how to stop it next time                           |

**How you work.** You do everything in the terminal on the right, one step at a time. Tick a step when you have its answer, or when its file holds what the step asks. When every step is done, press **Run Tests**: it checks the files in this terminal. Passing it finishes the project.

The terminal starts again from the first files every time you open the page or press Reset. So do the steps in one go, and after a reset, do the earlier steps again (each one is a command or two).

## Look at the logs

How many lines does each log have? Look at a few lines of each one.

## Errors per service

How many `ERROR` lines does each log have? The service with the most errors is not always the cause: you need the order things happened in.

## Say where each line came from

When the three logs are mixed, you won't know which service wrote a line. So add the service's name at the end of every line, after a space, in square brackets. A line of `web.log` ends in ` [web]`, one of `payments.log` in ` [payments]`, and one of `db.log` in ` [db]`.

A new idea: in a `sed` pattern, `$` matches the end of a line, as it does in `grep`.

## One timeline

Every line starts with its date and time, written so that an earlier time also comes first from A to Z. Put the three logs with their service names together, in time order, in `timeline.txt`.

Keep the folder tidy: at the end, `incident` holds the three logs and the files the steps ask for, and no files you made only to help you.

## The half hour that matters

The trouble was between 14:00 and 14:30. Save the lines of the timeline from `14:00:00` up to `14:30:00`, without that last time, to `window.txt`. A time written like `14:03:12` can be compared like text.

## What broke first

Hide the lines about normal work and look at the first lines that are left. Which service gave a warning first, and about what? Save the first `ERROR` line of the window, the one that started it all, to `cause.txt`.

## How far it spread

How many `ERROR` lines does the window have for each service? The service is now the last field of every line.

A new idea: in `awk`, `$NF` is the last field of a line, however many fields the line has.

## When it was over

When did the outage start, and when did it end? The first and the last `ERROR` of the window tell you. Then find what fixed it: look in the window for something that was removed or that started again.

Write the post-mortem to `postmortem.txt`, with what you found, one line each:

```text
Start: <time>, <what failed>
Spread: <which services failed next, and from when>
Fix: <time>, <what fixed it>
End: <time>, <the last error>
Errors: <how many ERROR lines the window has>
Next time: <what would have warned the team in time>
```

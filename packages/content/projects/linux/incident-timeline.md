Yesterday afternoon, for about twenty minutes, nobody could pay on an online bookshop's website. The checkout page showed an error, payments failed, and support got forty angry emails. Now the team wants a post-mortem: what broke first, what followed, and when it was over. Three services were involved (the website, the payment service and the database) and each kept its own log. You'll put them together into one timeline and find the cause.

You do it one step at a time, in the terminal on the right. Tick a step off once you get its answer, or its file holds what the step asks; you can always come back and untick it.

When every step is done, press **Run Tests**: it checks the files in this terminal, so do the steps in one go. The terminal starts fresh every time you open the page or press Reset, with the starting files back, so after a reset run the earlier steps again (each is a command or two). Passing the tests finishes the project.

## Look at the logs

You start in `~/incident`, next to `web.log`, `payments.log` and `db.log`. How many lines does each have? Every line starts the same way, with the date, the time and a level, `INFO`, `WARN` or `ERROR`:

```text
2026-11-05 13:40:28 INFO GET /checkout 200
```

## Errors per service

How many `ERROR` lines does each log have? The services with the most errors aren't necessarily the cause: you'll need the order things happened in.

## Say where each line came from

Once the three logs are mixed, you won't know which service wrote a line. Add the service's name at the end of every line, after a space and in square brackets, so a line of `web.log` ends in ` [web]`, one of `payments.log` in ` [payments]` and one of `db.log` in ` [db]`.

New idea: in a `sed` pattern, `$` matches the end of a line, as it does in `grep`.

## One timeline

Every line starts with its date and time, written so that earlier sorts first. Put the three tagged logs together in time order in `timeline.txt`.

Keep the folder tidy: when you're done, `incident` holds the three logs and the files the steps ask for, and no helper files.

## The half hour that matters

The trouble was between 14:00 and 14:30. Save the lines of the timeline from `14:00:00` up to, but not including, `14:30:00` to `window.txt`. A time written as `14:03:12` compares like text.

## What broke first

Hide the routine lines and look at the first ones left. Which service warned first, and about what? Save the first `ERROR` line of the window, the one that started it all, to `cause.txt`.

## How far it spread

How many `ERROR` lines does the window have for each service? The service is the last field of every line now.

New idea: `awk` calls the last field of a line `$NF`, however many fields the line has.

## When it was over

When did the outage start and end? The first and the last `ERROR` of the window tell you. Then find what fixed it: search the window for something being removed or resumed.

Write the post-mortem to `postmortem.txt`, one line each, with what you found:

```text
Start: <time>, <what failed>
Spread: <which services failed next, and from when>
Fix: <time>, <what fixed it>
End: <time>, <the last error>
Errors: <how many ERROR lines the window has>
Next time: <what would have warned the team in time>
```

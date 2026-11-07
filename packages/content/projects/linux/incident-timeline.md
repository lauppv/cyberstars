Yesterday afternoon, for about twenty minutes, nobody could pay on an online bookshop's website. The checkout page showed an error, payments failed, and support got forty angry emails. Now the team wants a post-mortem: what broke first, what followed, and when it was over. Three services were involved (the website, the payment service and the database) and each kept its own log. You'll put them together into one timeline and find the cause.

You do it one step at a time, in the terminal on the right. Tick a step off once you get its answer, or its file holds what the step asks; you can always come back and untick it.

When every step is done, press **Run Tests**: it checks the files in this terminal, so do the steps in one go. The terminal starts fresh every time you open the page or press Reset, with the starting files back, so after a reset run the earlier steps again (each is a command or two). Passing the tests finishes the project.

## Look at the logs

You start in `~/incident`, next to `web.log`, `payments.log` and `db.log`. Count their lines with one `wc -l`:

```text
  20 db.log
  26 payments.log
  32 web.log
  78 total
```

Every line starts the same way, with the date, the time and a level (`INFO`, `WARN` or `ERROR`):

```text
2026-11-05 13:40:28 INFO GET /checkout 200
```

## Errors per service

Count the `ERROR` lines in each log with one `grep -c`:

```text
db.log:6
payments.log:9
web.log:9
```

The website and payments have the most, but that doesn't make them the cause. You need to see the order things happened in.

## Say where each line came from

Once the three logs are mixed, you won't know which service wrote a line. Add the service's name at the end of every line, with `sed` and the pattern `$`, which matches the end of a line:

```bash
sed 's/$/ [web]/' web.log > web.tagged
```

Do the same for `payments.log` and `db.log`, with `[payments]` and `[db]`. `head -2 db.tagged` shows:

```text
2026-11-05 13:40:05 INFO checkpoint done, disk 91% used [db]
2026-11-05 13:44:05 INFO checkpoint done, disk 91% used [db]
```

## One timeline

Every line starts with its date and time, written so that earlier sorts first. So `sort` on the three tagged files together puts them in time order. Save the result as `timeline.txt` (78 lines, the three logs together), then remove the `.tagged` files.

## The half hour that matters

The trouble was between 14:00 and 14:30. The time is field 2, and written as `14:03:12` it compares like text, so `awk` can keep the lines between two times:

```bash
awk '$2 >= "14:00:00" && $2 < "14:30:00"' timeline.txt > window.txt
```

`window.txt` has 42 lines. Its first lines already look different from the rest:

```text
2026-11-05 14:00:20 INFO GET /checkout 200 [web]
2026-11-05 14:00:30 WARN disk 96% used [db]
2026-11-05 14:00:50 INFO payment accepted [payments]
```

## What broke first

Hide the routine lines, `grep -v INFO`, and look at the first few that are left:

```text
2026-11-05 14:00:30 WARN disk 96% used [db]
2026-11-05 14:01:30 WARN disk 97% used [db]
2026-11-05 14:02:30 WARN disk 98% used [db]
2026-11-05 14:03:12 ERROR disk full, cannot write to orders table [db]
2026-11-05 14:04:15 ERROR payment not saved: database error [payments]
2026-11-05 14:05:40 ERROR write failed: no space left on device [db]
```

The database warned three times that its disk was filling up, and at 14:03:12 the disk was full. A minute later payments started failing, and right after that the checkout page. `grep -m 1 ERROR` prints only the first match, the line that started it all. Save it to `cause.txt`.

## How far it spread

Take the `ERROR` lines of the window and count them per service. The service is the last field of every line now, and `awk` calls the last field `$NF`:

```text
      6 [db]
      9 [payments]
      9 [web]
```

24 errors, all from one full disk.

## When it was over

The first `ERROR` of the window and its last (`head -1` and `tail -1`) give the outage's start and end:

```text
2026-11-05 14:03:12 ERROR disk full, cannot write to orders table [db]
2026-11-05 14:21:40 ERROR GET /checkout 500 [web]
```

Search the window for `removed` or `resumed` (`grep -n "removed\|resumed"`) to find the fix:

```text
32:2026-11-05 14:19:02 INFO old backups removed, disk 64% used [db]
33:2026-11-05 14:19:30 INFO writes resumed [db]
```

Someone removed old backups at 14:19, and two minutes later the website had caught up. Write the post-mortem to `postmortem.txt` with `echo` and `>>`, one line each:

```text
Start: 14:03:12, database disk full
Spread: payments from 14:04, checkout page from 14:06
Fix: 14:19:02, old backups removed
End: 14:21:40, last checkout error
Errors: 24
Next time: alert when the database disk passes 90%
```

Luca runs a small pizzeria with a website for its menu and online orders. Since yesterday the site feels slow, customers say some pages are missing, and Luca wonders whether someone is trying to break in. The web server writes down every request it answers, so the answers are in its log. You'll read it with the tools you know and leave Luca a report.

You do it one step at a time, in the terminal on the right. Each step saves what it finds to a file in `~/report`. Tick a step off once its file holds what the step asks; you can always come back and untick it.

When every step is done, press **Run Tests**: it checks the files in this terminal, so do the steps in one go. The terminal starts fresh every time you open the page or press Reset, with the starting files back, so after a reset run the earlier steps again (each is a command or two). Passing the tests finishes the project.

## Meet the log

The log is `~/logs/access.log`, one request per line. Look at its first lines with `head` and its last with `tail`:

```text
45.9.148.3 - - [06/Nov/2026:03:12:00] "POST /login HTTP/1.1" 401 120
```

Each line holds, separated by spaces: the visitor's IP address, two dashes, the time in brackets, the request in quotes (the method, the page and the protocol), the status code the server answered and how many bytes it sent. `200` means the page was there, `404` that it wasn't, `401` that a login was refused.

Count the requests with `wc -l`:

```text
343 logs/access.log
```

## Pages that weren't there

Save every line whose status is `404` to `~/report/not-found.txt`, with `grep`. Searching for `404` alone would also catch a time like `14:04:04`, so search for the quote that closes the request, a space, then `404`:

```bash
grep '" 404 ' logs/access.log > report/not-found.txt
```

Count them: there are 35.

## The most frequent visitors

Which addresses ask the most? Cut the first field out of every line (`cut` with a space as the delimiter), then sort, count the repeats with `uniq -c`, sort the counts from the largest and keep the first five. Save them to `~/report/top-visitors.txt`:

```text
     97 81.12.40.7
     75 92.85.3.114
     41 45.9.148.3
     34 5.2.199.20
     33 188.24.66.1
```

`uniq` only folds lines that sit next to each other, which is why the first `sort` is needed.

## Broken links

The 404 lines tell you which pages customers expected and didn't find. Use `awk`: with spaces between fields, the status is field 8 and the page field 6. Print the page of every line whose status is 404, count each page and sort from the most asked. Save it to `~/report/broken-pages.txt`:

```text
     15 /menu/desserts
     10 /opening-hours
     10 /gift-cards
```

Luca now knows which three pages to add back.

## The busiest hours

The time looks like `[06/Nov/2026:12:41:07]`. Cut on `:` instead of a space, and the second field is the hour. Count the requests in each hour and save them to `~/report/per-hour.txt`, in the order of the hours:

```text
     41 03
     20 09
     20 10
     20 11
     46 12
     34 13
     20 14
     20 15
     20 16
     20 17
     20 18
     22 19
     20 20
     20 21
```

The lunch rush at 12 and 13 is expected. But 41 requests at 3 in the morning, while the pizzeria is closed?

## The night visitor

Find out who it was. Take the lines that try to log in (`POST /login`), keep those refused with `401`, and count them per address with the same pipeline as before:

```text
     41 45.9.148.3
```

One address tried 41 passwords in under three minutes: look at its first and last line with `grep`, `head` and `tail`. Save its lines to `~/report/intruder.txt`, so Luca can send them to whoever hosts his site and have the address blocked. The two logins that went through, at 19:00, came from Luca's own addresses.

## How much was sent

The last field is the bytes sent. Add them up with `awk`, keeping a running sum and printing it in an `END` block:

```text
1936770
```

That is almost 2 MB for a day. Count the requests answered with `200` the same way: there are 267.

## The report

Write `~/report/summary.txt` with `echo`, one fact a line: the first line with `>`, every next one with `>>`, so they add up instead of replacing each other. Use the numbers you found:

```text
Requests: 343
Not found: 35
Busiest hour: 12
Intruder: 45.9.148.3 (41 failed logins)
Bytes sent: 1936770
```

`ls report` now lists the six files Luca will read.

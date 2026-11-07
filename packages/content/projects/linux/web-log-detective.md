Luca runs a small pizzeria with a website for its menu and online orders. Since yesterday the site feels slow, customers say some pages are missing, and Luca wonders whether someone is trying to break in. The web server writes down every request it answers, so the answers are in its log. You'll read it with the tools you know and leave Luca a report.

You do it one step at a time, in the terminal on the right. Each step saves what it finds to a file in `~/report`. Tick a step off once its file holds what the step asks; you can always come back and untick it.

When every step is done, press **Run Tests**: it checks the files in this terminal, so do the steps in one go. The terminal starts fresh every time you open the page or press Reset, with the starting files back, so after a reset run the earlier steps again (each is a command or two). Passing the tests finishes the project.

## Meet the log

The log is `~/logs/access.log`, one request per line. Before anything else, look at how it starts and how it ends, and count how many requests it holds: the report needs that number.

A line looks like this:

```text
45.9.148.3 - - [06/Nov/2026:03:12:00] "POST /login HTTP/1.1" 401 120
```

It holds, separated by spaces: the visitor's IP address, two dashes, the time in brackets, the request in quotes (the method, the page and the protocol), the status code the server answered and how many bytes it sent. `200` means the page was there, `404` that it wasn't, `401` that a login was refused.

## Pages that weren't there

Save every request the server answered with `404` to `~/report/not-found.txt`, whole lines, in the log's order. Careful: `404` can also turn up inside a time or a byte count, and those lines don't belong here. Count them too.

## The most frequent visitors

Which addresses ask the most? Save the five busiest to `~/report/top-visitors.txt`, the busiest first, each line a count and then the address, like this made-up one:

```text
     12 10.0.0.5
```

## Broken links

The 404 lines tell you which pages customers expected and didn't find. Save each missing page once to `~/report/broken-pages.txt`, with how many times it was asked for, the most asked first: a count, then the page.

Luca will know which pages to add back.

## The busiest hours

Count the requests in each hour of the day and save them to `~/report/per-hour.txt`, in the order of the hours: a count, then the hour, two digits as the log writes it.

The lunch rush is expected. Look for an hour that isn't.

## The night visitor

Somebody was busy while the pizzeria was closed. Look at the logins the server refused and count them per address: one address stands out. Save every line of that address to `~/report/intruder.txt`, so Luca can send them to whoever hosts his site and have it blocked.

Look at its first and last line too: how long did it take?

## How much was sent

The last field of each line is how many bytes the server sent. Add them all up: that is how much the site sent in a day.

## The report

Write `~/report/summary.txt` from the terminal, one fact a line, with the numbers you found:

```text
Requests: <how many requests the log holds>
Not found: <how many were answered with 404>
Busiest hour: <the hour with the most requests, two digits>
Intruder: <the address> (<how many logins it had refused> failed logins)
Bytes sent: <the total>
```

`ls report` now lists the six files Luca will read.

Noel has a small pizza place with a website for its menu and its online orders. Since yesterday the site feels slow, customers say some pages are missing, and Noel thinks someone may be trying to break in. The web server writes down every request it answers, so the answers are in its log. You will read it with the tools you know and leave Noel a report.

**What you start with.** Yesterday's log, `~/logs/access.log`, with one request on each line.

**What you make.** Each step saves what it finds to a file in `~/report`:

| File               | What it holds                                           |
| ------------------ | ------------------------------------------------------- |
| `not-found.txt`    | the requests for pages that were not there              |
| `top-visitors.txt` | the five addresses that asked the most                  |
| `broken-pages.txt` | each missing page, with how many times it was asked for |
| `per-hour.txt`     | how many requests came in each hour                     |
| `intruder.txt`     | every line of the visitor who tried to break in         |
| `summary.txt`      | the report, in five lines                               |

Some words you will meet:

| Word        | What it means                                                                              |
| ----------- | ------------------------------------------------------------------------------------------ |
| request     | a browser asking the server for a page                                                     |
| log         | a file where the server writes a line for each request                                     |
| IP address  | the number of the computer that sent a request, like `81.12.40.7`                          |
| status code | the server's answer: `200` the page was there, `404` it was not, `401` a login was refused |
| byte        | the smallest unit of data: a letter of text is about one byte                              |
| intruder    | someone who tries to get in without being allowed                                          |

**How you work.** You do everything in the terminal on the right, one step at a time. Tick a step when its file holds what the step asks. When every step is done, press **Run Tests**: it checks the files in this terminal. Passing it finishes the project.

The terminal starts again from the first files every time you open the page or press Reset. So do the steps in one go, and after a reset, do the earlier steps again (each one is a command or two).

## Look at the log

Before anything else, look at how the log starts and how it ends, and count how many requests it has: the report needs that number.

A line looks like this:

```text
81.12.40.7 - - [06/Nov/2026:09:37:25] "GET /menu HTTP/1.1" 200 8240
```

With spaces between them, it has: the visitor's IP address, two dashes, the time in square brackets, the request in quotes (the method, the page and the protocol), the status code, and how many bytes the server sent.

## Pages that weren't there

Save every request the server answered with `404` to `~/report/not-found.txt`: whole lines, in the log's order. Be careful: `404` can also be part of a time or of a number of bytes, and those lines don't belong here. Count them too.

## The most frequent visitors

Which addresses asked the most? Save the five busiest to `~/report/top-visitors.txt`, the busiest first. Each line is a count and then the address, like this one, made up:

```text
     12 10.0.0.5
```

## Broken links

The 404 lines tell you which pages customers wanted and didn't find. Save each missing page once to `~/report/broken-pages.txt`, with how many times it was asked for, the most asked first: a count, then the page.

Noel will know which pages to put back.

## The busiest hours

Count the requests in each hour of the day and save them to `~/report/per-hour.txt`, in the order of the hours: a count, then the hour, with two digits, as the log writes it.

Many requests at lunch time are normal. Look for an hour that is not normal.

## The night visitor

Someone was busy while the pizza place was closed. Look at the logins the server refused, and count them for each address: one address is very different from the others. Save every line of that address to `~/report/intruder.txt`, so Noel can send them to the company that runs his website and have that address blocked.

Look at its first and last line too: how long did it go on?

## How much was sent

The last field of each line is how many bytes the server sent. Add them all up: that is how much the site sent in one day.

## The report

Write `~/report/summary.txt` from the terminal, with the numbers you found, one on each line:

```text
Requests: <how many requests the log holds>
Not found: <how many were answered with 404>
Busiest hour: <the hour with the most requests, two digits>
Intruder: <the address> (<how many logins it had refused> failed logins)
Bytes sent: <the total>
```

Now `ls report` lists the six files Noel will read.

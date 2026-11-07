Chapter 5 was about where a command's output goes: into a file, onto the end of one, away from the screen, or straight into the next command.

With those you can build a whole report from raw data without typing a line of it yourself. Each command does one job; connecting them is your part.

---

## Mission: Telemetry Report

The engineering deck dumped raw telemetry into `telemetry.raw`: `OK`, `WARN` and `ERR` lines, all mixed up. The chief engineer wants `report.txt`, laid out exactly like this:

```text
TELEMETRY REPORT
(every WARN line, in alphabetical order)
(every ERR line, in alphabetical order)
-- end of report --
```

The heading and the closing line are yours to write; every other line comes straight from the telemetry, never typed by hand.

**Expected result**

`report.txt` starts with the heading, lists the warnings and then the errors, each group sorted, and ends with the closing line.

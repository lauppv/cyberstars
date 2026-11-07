Chapter 5 gave you the plumbing of the station. Here is your toolbox:

| Symbol | Purpose                             |
| ------ | ----------------------------------- |
| `>`    | Redirect output to file (overwrite) |
| `>>`   | Redirect output to file (append)    |
| `<`    | Feed file as input                  |
| `\|`   | Pipe output to next command         |
| `2>`   | Redirect errors only                |
| `2>&1` | Merge errors into stdout            |

Pipes and redirection let you build **data pipelines**: take raw data, filter it,
transform it, and save the result, all in one line.

The golden rule: **each command does one job**. Pipes connect the jobs into a workflow.

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

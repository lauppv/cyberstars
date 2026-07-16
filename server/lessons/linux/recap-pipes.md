Chapter 5 gave you the plumbing of the station. Here is your toolbox:

| Symbol | Purpose                             |
| ------ | ----------------------------------- |
| `>`    | Redirect output to file (overwrite) |
| `>>`   | Redirect output to file (append)    |
| `<`    | Feed file as input                  |
| `\|`   | Pipe output to next command         |
| `2>`   | Redirect errors only                |
| `2>&1` | Merge errors into stdout            |

Pipes and redirection let you build **data pipelines** — take raw data, filter it,
transform it, and save the result, all in one line.

The golden rule: **each command does one job**. Pipes connect the jobs into a workflow.

---

## Mission: Telemetry Report

The engineering deck just dumped raw telemetry into `telemetry.raw`. The chief engineer needs a clean, sorted list of all warnings filed away before the next systems review.

1. Build a pipeline that finds all lines containing `WARN` in `telemetry.raw`, sorts them alphabetically, and saves the result into a new file `warnings_sorted.txt`.
2. Add the line `-- end of report --` to the end of `warnings_sorted.txt`, without erasing what is already there.

**Expected result**

Running `cat warnings_sorted.txt` shows three sorted `WARN` lines followed by `-- end of report --`.

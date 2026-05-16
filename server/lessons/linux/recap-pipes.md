Chapter 5 gave you the plumbing of the station. Here is your toolbox:

| Symbol | Purpose |
|--------|---------|
| `>` | Redirect output to file (overwrite) |
| `>>` | Redirect output to file (append) |
| `<` | Feed file as input |
| `\|` | Pipe output to next command |
| `2>` | Redirect errors only |
| `2>&1` | Merge errors into stdout |

Pipes and redirection let you build **data pipelines** — take raw data, filter it,
transform it, and save the result, all in one line.

The golden rule: **each command does one job**. Pipes connect the jobs into a workflow.

---

The file `telemetry.raw` contains a mix of readings. Your mission:

1. Use a pipeline to find all lines containing `WARN`, sort them alphabetically, and
   save the result into `warnings_sorted.txt` (use `>` at the end of the pipe).
2. Then **append** a final line to `warnings_sorted.txt` with the text
   `-- end of report --` using `>>`.

Two commands total, cadet. Show mission control you can build a real data pipeline.

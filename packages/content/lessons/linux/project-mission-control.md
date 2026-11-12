Congratulations, cadet. You have learned navigation, file management, searching,
pipelines, text processing, permissions, and system tools. Now it is time to prove
yourself.

The station's Mission Control directory is a mess. A previous officer left files
scattered across the wrong folders, permissions broken, and no summary report. Your
commanding officer needs the directory organized and a final report generated
before the next shift starts.

---

## Mission: Mission Control Overhaul

A previous shift officer left Mission Control in chaos: everything dumped in `inbox/`, nothing sorted, the security settings open to anyone, and no report for command. The captain wants it fixed before the next crew rotation. Nobody will tell you how; you have the tools.

The captain's orders:

- Logs belong in `logs/` and configuration files in `config/`. The officer's personal notes stay in `inbox/`, alone.
- `reports/critical-issues.txt`: every `CRITICAL` line from all the logs, each with the log it came from.
- `reports/sorted-config.txt`: every setting from all the configuration files, in one alphabetical list.
- `config/security.conf` holds access credentials: only its owner may read or change it, and nobody else gets anything.
- `reports/mission-summary.txt`: the current date and time on the first line, `STATUS: COMPLETE` on the second.

Everything in the reports comes straight from the files and the system, not typed by hand, except the status line.

**Expected result**

`inbox/` holds only the notes, every log and configuration file is in its folder, `security.conf` is locked to its owner, and the three reports say what the captain asked for. The station is counting on you, cadet.

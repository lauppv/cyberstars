Congratulations, cadet. You have learned navigation, file management, searching,
pipelines, text processing, permissions, and system tools. Now it is time to prove
yourself.

The station's **Mission Control** directory is a mess. A previous officer left files
scattered across the wrong folders, permissions broken, and no summary report. Your
commanding officer needs the directory organized and a final report generated
**before the next shift starts**.

---

## Mission: Mission Control Overhaul

A previous shift officer left the Mission Control directory in chaos — incoming files dumped in `inbox/`, nothing sorted, permissions wide open, and no status report for command. The captain wants this fixed before the next crew rotation. You have the tools. Get it done.

1. **Sort the inbox.** Move all `.log` files from `inbox/` into `logs/`. Move all `.conf` files from `inbox/` into `config/`.

2. **Hunt for critical issues.** Use `grep -r` to search the entire `logs/` directory for the word `CRITICAL`. Redirect the matching lines into `reports/critical-issues.txt`.

3. **Build a configuration manifest.** Use `cat` to combine all `.conf` files in `config/` and pipe through `sort` into `reports/sorted-config.txt`.

4. **Lock down security.** The file `config/security.conf` contains sensitive access credentials. Set its permissions so only the owner can read and write it — no group or other access. Use `chmod 600`.

5. **File the final report.** Create `reports/mission-summary.txt` containing the current date on the first line (use `date >`) and the text `STATUS: COMPLETE` on the second line (use `echo >>` to append).

6. **Verify your work.** Run `ls reports/` to confirm all three report files are in place.

**Expected result**

The `inbox/` should contain only `old-notes.txt`. The `logs/` directory holds the three `.log` files, `config/` holds the three `.conf` files (with `security.conf` locked to `600`), and `reports/` contains `critical-issues.txt`, `sorted-config.txt`, and `mission-summary.txt`. The station is counting on you, cadet.

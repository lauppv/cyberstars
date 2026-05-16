Congratulations, cadet. You have learned navigation, file management, searching,
pipelines, text processing, permissions, and system tools. Now it is time to prove
yourself.

The station's **Mission Control** directory is a mess. A previous officer left files
scattered across the wrong folders, permissions broken, and no summary report. Your
commanding officer needs the directory organized and a final report generated
**before the next shift starts**.

---

Here is your mission briefing:

1. **Organize files:** Move all `.log` files from `inbox/` into `logs/`. Move all
   `.conf` files from `inbox/` into `config/`.

2. **Find the secret:** Use `grep` to search the entire `logs/` directory
   (recursively) for the word `CRITICAL`. Redirect the matching lines into
   `reports/critical-issues.txt`.

3. **Build a sorted manifest:** Use `cat` to combine all `.conf` files in `config/`
   and pipe through `sort` into `reports/sorted-config.txt`.

4. **Fix permissions:** The file `config/security.conf` must be readable only by its
   owner (no group or other access). Use `chmod 600` on it.

5. **Create the final report:** Write a file `reports/mission-summary.txt` that
   contains the current date (use command substitution or redirection) followed by
   the text `STATUS: COMPLETE` on the next line.

6. **Verify:** Run `ls reports/` to confirm all three report files exist.

Good luck, cadet. The station is counting on you.

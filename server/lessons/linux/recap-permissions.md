Chapter 7 taught you the security layer of the station's file system:

| Command     | Purpose                               |
| ----------- | ------------------------------------- |
| `ls -l`     | View permissions and ownership        |
| `chmod u+x` | Add/remove permissions (symbolic)     |
| `chmod 755` | Set all permissions at once (numeric) |
| `whoami`    | Show your username                    |
| `id`        | Show uid, gid, and groups             |

Remember the permission triad: **user → group → others**, each with `r`, `w`, `x`.
Numeric: r=4, w=2, x=1 — add them up per group.

---

## Mission: Lockdown Protocol

A security breach was detected on deck 3. The captain has issued a lockdown order — three files in your directory need their permissions tightened immediately.

1. `launch_codes.txt` — Top secret. Only the owner may read and write. No group or other access. Set to `600`.
2. `status_report.sh` — Operational script. Owner gets full access (rwx), group can read and execute, others get nothing. Set to `750`.
3. `public_bulletin.txt` — Station-wide bulletin. Everyone can read, but only the owner can write. Set to `644`.

Use `chmod` on each file, then run `ls -l` to verify.

**Expected result**

`ls -l` shows `-rw-------` for `launch_codes.txt`, `-rwxr-x---` for `status_report.sh`, and `-rw-r--r--` for `public_bulletin.txt`. Lockdown complete.

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

You have three files that need proper security settings. Lock them down:

1. `launch_codes.txt` — Only the owner should be able to read and write. No one else
   gets any access. (Hint: `600`)
2. `status_report.sh` — The owner needs full access (rwx). Group can read and execute.
   Others get nothing. (Hint: `750`)
3. `public_bulletin.txt` — Everyone can read, but only the owner can write. (Hint:
   `644`)

Set the correct permissions on each file using `chmod`, then run `ls -l` to confirm.

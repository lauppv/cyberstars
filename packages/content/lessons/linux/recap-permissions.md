Chapter 7 taught you the security layer of the station's file system:

| Command     | Purpose                               |
| ----------- | ------------------------------------- |
| `ls -l`     | View permissions and ownership        |
| `chmod u+x` | Add/remove permissions (symbolic)     |
| `chmod 755` | Set all permissions at once (numeric) |
| `whoami`    | Show your username                    |
| `id`        | Show uid, gid, and groups             |

Remember the permission triad: **user → group → others**, each with `r`, `w`, `x`.
Numeric: r=4, w=2, x=1. Add them up per group.

---

## Mission: Lockdown Protocol

A security breach was detected on deck 3, and the captain has ordered a lockdown of every file in your home directory. The protocol sorts files into four kinds:

- **Secret**: only the owner reads and writes it; nobody else gets anything.
- **Script**: the owner can do everything, the group can read and run it, others get nothing.
- **Internal**: the owner reads and writes it, the group can read it, others get nothing.
- **Public**: everyone can read it, only the owner can write it.

Look at each file, decide which kind it is, and give it that access.

**Expected result**

Every file in your home directory has exactly the access of its kind.

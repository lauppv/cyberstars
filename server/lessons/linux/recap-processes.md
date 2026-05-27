Chapter 8 gave you the tools to inspect and manage the station's operating system
itself:

| Command               | Purpose                            |
| --------------------- | ---------------------------------- |
| `ps aux`              | List all running processes         |
| `ps aux --sort=-%cpu` | Sort by CPU usage (heaviest first) |
| `kill PID`            | Politely stop a process            |
| `kill -9 PID`         | Force-kill a stubborn process      |
| `df -h`               | Show disk space per filesystem     |
| `du -sh DIR`          | Show total size of a directory     |
| `date`                | Print current date/time            |
| `history`             | Show past commands                 |

These are your system diagnostic toolkit. When something goes wrong, you start with
`ps aux` to check what is running, `df -h` to check disk space, and `date` to
timestamp the incident.

---

Time for a full system checkup, cadet:

1. Run `ps aux` to inspect all active processes.
2. Run `df -h` to check disk space.
3. Run `du -sh logs/` to see how large the logs directory is.
4. Run `date` to record the current time.
5. Run `history` to confirm everything is in the audit trail.

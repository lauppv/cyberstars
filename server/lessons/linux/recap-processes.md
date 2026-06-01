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

## Mission: System Health Inspection

The station is approaching a debris field and the captain wants a full systems check logged before entry. Run through the standard diagnostic sequence.

1. Run `ps aux` to inspect all active processes — confirm the reactor monitor and life support are running.
2. Run `df -h` to check available disk space on all filesystems.
3. Run `du -sh logs/` to measure how large the logs directory has grown.
4. Run `date` to timestamp this inspection.
5. Run `history` to confirm every diagnostic command is recorded in the audit trail.

**Expected result**

You should see the `reactor-monitor` and `life-support` processes active, disk usage stats for all mounts, the size of `logs/`, the current date, and your full command history.

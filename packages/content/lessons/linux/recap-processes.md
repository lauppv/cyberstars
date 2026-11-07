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

The station is approaching a debris field, and the captain wants a systems check on file before entry. Check how much disk space the station has left, then write `inspection.txt`:

1. the date and time of the inspection, on the first line;
2. the process lines of the reactor monitor and of life support, to prove both are running;
3. how much room the `logs` folder takes, in all and readable at a glance, on the last line.

Every line comes straight from the system, not typed by hand.

**Expected result**

`inspection.txt` opens with the timestamp, shows the reactor monitor and life support running, and ends with the size of `logs`.

Knowing **when** things happen matters on a space station. The `date` command prints
the current date and time:

```bash
date
```

```text
Mon Mar 17 14:32:01 UTC 2157
```

The `uptime` command tells you how long the system has been running since its last
boot:

```bash
uptime
```

```text
 14:32:01 up 42 days,  3:17,  1 user,  load average: 0.12, 0.08, 0.05
```

This station has been online for 42 days without a reboot. Impressive stability.

### Recalling past commands

The `history` command shows every command you have typed in the current session (and
often previous ones):

```bash
history
```

```text
    1  ls
    2  cd logs
    3  grep error system.log
    4  history
```

You can re-run a previous command by typing `!NUMBER`, for example `!3` would re-run
`grep error system.log`. This saves time when repeating complex commands.

---

## Mission: Log the Timestamp

Station protocol requires a written shift log at the start of every watch. Write `shift-records/shift-log.txt` with the current date and time on its first line and how long the station has been running on its second. Then review the numbered list of commands you typed this session.

**Expected result**

`shift-records/shift-log.txt` has two lines, the timestamp and then the station's uptime, and you have seen your numbered commands.

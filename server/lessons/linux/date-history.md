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

This station has been online for 42 days without a reboot — impressive stability.

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

Station protocol requires logging the current date and time at the start of every shift, then reviewing recent terminal activity.

1. Run `date` to record the current timestamp.
2. Run `history` to see a record of the commands you have typed in this session.

**Expected result**

You see today's date and time, followed by a numbered list of all commands from your session so far.

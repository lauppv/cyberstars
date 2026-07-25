Every program running on a Linux system is called a **process**. Each process has a
unique number — its **PID** (Process ID). The `ps` command shows you a snapshot of
processes running right now.

By itself, `ps` shows only processes attached to your current terminal session:

```bash
ps
```

```text
  PID TTY          TIME CMD
 1201 pts/0    00:00:00 bash
 1245 pts/0    00:00:00 ps
```

That is usually just your shell and `ps` itself. To see **all** processes on the
system, use `ps aux`:

```bash
ps aux
```

```text
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.1  16956  1024 ?        Ss   08:00   0:01 /sbin/init
student   1201  0.0  0.2  22340  2048 pts/0    S    09:12   0:00 bash
student   1245  0.0  0.1  18432   896 pts/0    R+   09:15   0:00 ps aux
```

The columns tell you: who owns the process, its PID, resource usage, and the
command that started it. When the station feels sluggish, `ps aux` is your first
diagnostic tool.

---

## Mission: Engineering Health Check

Engineering just radioed in — they need written proof that the reactor monitoring daemon is still running. Without it, temperature readings stop flowing to the bridge.

1. List all processes running on the station's computer.
2. Filter that listing down to only the lines mentioning the reactor and save them into a file called `reactor-status.txt`.
3. Create a folder called `health-check` and move `reactor-status.txt` into it.
4. Count how many reactor processes were found.

**Expected result**

`health-check/reactor-status.txt` contains the line for `/usr/bin/reactor-monitor`, confirming the daemon is alive.

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

The columns tell you: **who** owns the process, its PID, resource usage, and the
command that started it. When the station feels sluggish, `ps aux` is your first
diagnostic tool.

---

Run `ps aux` to see all processes currently active on the station's computer. Look
for any process whose command contains `reactor` — that is the one engineering
asked you to check on.

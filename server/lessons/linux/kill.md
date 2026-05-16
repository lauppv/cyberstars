Sometimes a process misbehaves — it freezes, consumes all the CPU, or simply needs
to be stopped. The `kill` command sends a **signal** to a process, asking (or
forcing) it to terminate.

The basic usage is: `kill PID`.

```bash
kill 510
```

This sends signal **15 (SIGTERM)** — a polite "please shut down." Most well-behaved
programs will clean up and exit.

### Forcing a stubborn process

If a process ignores SIGTERM, send signal **9 (SIGKILL)** — an immediate,
unconditional termination:

```bash
kill -9 510
```

The process gets no chance to clean up; the kernel destroys it instantly. Use `-9`
only when the polite signal fails.

### Background jobs with &

You can start a process in the background by appending `&`:

```bash
sleep 300 &
```

```text
[1] 1312
```

The shell gives you its PID (`1312`) so you can `kill` it later if needed.

---

The nav-computer process (PID **510**) has frozen and is not responding to commands.
Use `kill -9 510` to forcefully terminate it, then confirm it is gone by running
`ps aux`.

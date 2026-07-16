While `ps` gives you a one-time snapshot, the `top` command shows a **live,
continuously updating** view of processes — sorted by CPU or memory usage. It is the
station engineer's dashboard.

In a full terminal you would simply type:

```bash
top
```

It takes over your screen and refreshes every few seconds. Press `q` to quit.

Since our sandbox does not have an interactive screen, you can get similar results
with `ps aux --sort`:

```bash
ps aux --sort=-%cpu
```

```text
USER       PID %CPU %MEM  ...  COMMAND
root        42  8.2  1.4  ...  /usr/bin/reactor-monitor --port=7700
root       305  1.1  0.8  ...  /usr/sbin/life-support
student   1201  0.0  0.2  ...  bash
```

The `-%cpu` means "sort by CPU, descending" — the hungriest process appears first.
You can also sort by memory: `--sort=-%mem`.

On a real station you would use `top` or its friendlier cousin `htop` to watch
processes live. Here in the sandbox, `ps aux --sort` is your practical equivalent.

---

## Mission: Runaway Process Hunt

The station's main computer is running hot and the bridge wants a written report on the culprit before the thermal alarms trigger.

1. List all processes sorted by CPU usage, highest first.
2. Capture the top of that sorted list — the header line plus the single hungriest process — into a file called `top-offender.txt`.
3. Create a folder called `cpu-report` and move `top-offender.txt` into it.
4. Display the saved file to confirm which program is the offender.

**Expected result**

`cpu-report/top-offender.txt` names `/usr/bin/reactor-monitor` as the biggest CPU consumer.

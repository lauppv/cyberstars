So far, every command has printed its output to the screen. But what if you need to
save that output? The **`>`** operator sends (redirects) a command's output **into a
file** instead of displaying it.

The pattern is: `COMMAND > FILE`.

```bash
echo "Reactor online" > status.txt
```

```text
```

Nothing appeared on screen — the text went into `status.txt` instead. You can verify
with `cat`:

```bash
cat status.txt
```

```text
Reactor online
```

### Warning: `>` overwrites!

If the file already exists, `>` **replaces** its contents entirely. Think of it as
"create or overwrite."

```bash
echo "Reactor offline" > status.txt
cat status.txt
```

```text
Reactor offline
```

The old content is gone. When you need to keep existing content, you will use `>>`
(next lesson).

Any command that produces output can be redirected — `ls`, `grep`, `cat`, `date`,
anything.

---

The file `sensors.log` has several readings. Use `grep` to find lines containing
`critical` and redirect **only those lines** into a new file called `alerts.txt`.

So far, every command has printed its output to the screen. But what if you need to
save that output? The **`>`** operator sends (redirects) a command's output **into a
file** instead of displaying it.

The pattern is: `COMMAND > FILE`.

```bash
echo "Reactor online" > status.txt
```

```text

```

Nothing appeared on screen: the text went into `status.txt` instead. You can verify
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

Any command that produces output can be redirected: `ls`, `grep`, `cat`, `date`,
anything.

---

## Mission: Critical Alert Extraction

The sensor array logs its readings to `sensors.log`. The chief engineer wants them split into a `report` folder: `alerts.txt` with every `critical` reading for the repair crew, and `healthy.txt` with every `ok` one. Both files come straight from the log, not typed by hand.

**Expected result**

`report/alerts.txt` holds only the critical readings and `report/healthy.txt` only the healthy ones, in the log's order.

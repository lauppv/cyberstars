Linux separates command output into two streams:

- **stdout** (stream 1) — normal output (what you usually see).
- **stderr** (stream 2) — error messages.

When you use `>`, only stdout is redirected. Errors still appear on screen:

```bash
ls real.txt fake.txt > output.txt
```

```text
ls: cannot access 'fake.txt': No such file or directory
```

The listing of `real.txt` went into `output.txt`, but the error stayed on screen.

### Redirecting errors with `2>`

```bash
ls real.txt fake.txt 2> errors.txt
```

Now errors go into `errors.txt`, and normal output prints to screen.

### Discarding errors with `/dev/null`

`/dev/null` is a black hole — anything sent there disappears:

```bash
ls real.txt fake.txt 2> /dev/null
```

Only the success output remains; errors vanish silently.

### Combining both streams with `2>&1`

```bash
ls real.txt fake.txt > all.txt 2>&1
```

This sends **both** stdout and stderr into `all.txt`. The `2>&1` means "send stream 2
wherever stream 1 is going."

---

Run `ls report.txt ghost.txt`. The file `ghost.txt` does not exist, so you will get an
error. Redirect **only the error** into a file called `errors.log` using `2>`.

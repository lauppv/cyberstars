Instead of letters, you can set permissions with a **three-digit octal number**. Each
digit represents one group (user, group, others) and is the **sum** of:

| Permission  | Value |
| ----------- | ----- |
| Read (r)    | 4     |
| Write (w)   | 2     |
| Execute (x) | 1     |
| None        | 0     |

### Common permission numbers

| Number | Meaning                             | String       |
| ------ | ----------------------------------- | ------------ |
| `755`  | owner: rwx, group: r-x, others: r-x | `-rwxr-xr-x` |
| `644`  | owner: rw-, group: r--, others: r-- | `-rw-r--r--` |
| `700`  | owner: rwx, group: ---, others: --- | `-rwx------` |
| `600`  | owner: rw-, group: ---, others: --- | `-rw-------` |

### Using chmod with numbers

```bash
chmod 755 script.sh
chmod 644 readme.txt
```

The numeric form sets **all** permissions at once — there is no "add" or "remove", you
replace the entire set.

### When to use which form?

- **Symbolic** (`u+x`) — when you want to change one thing without affecting the rest.
- **Numeric** (`755`) — when you know exactly what the final permissions should be.

---

Set the file `engine_control.sh` to permission `750` (owner: full access, group: read
and execute, others: nothing). Then verify with `ls -l`.

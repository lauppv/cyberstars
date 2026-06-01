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

## Mission: Lock Down the Thruster Script

The `engine_control.sh` script fires the main thruster — only authorised personnel should be able to access it. Station security policy requires permission `750` (owner: full access, group: read and execute, others: nothing).

1. Use `chmod 750` to set the correct permissions on `engine_control.sh`.
2. Run `ls -l engine_control.sh` to verify the change.

**Expected result**

`ls -l` shows `-rwxr-x---` for `engine_control.sh`.

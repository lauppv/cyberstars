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

The `engine_control.sh` script fires the main thruster and ships with a `readme.txt`. Station security policy sets strict access levels for both.

1. Set the permissions on `engine_control.sh` so the owner has full access, the group can read and run it, and others get nothing at all.
2. Set the permissions on `readme.txt` so the owner can read and write it, while the group and others can only read it.
3. Create a folder called `engine-bay` and move both files into it.
4. Display the detailed listing of the folder to confirm the permissions.

**Expected result**

Inside `engine-bay`, `engine_control.sh` is `-rwxr-x---` and `readme.txt` is `-rw-r--r--`.

Instead of letters, you can set permissions with a **three-digit octal number**. Each
digit represents one group (user, group, others) and is the sum of:

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

The numeric form sets all permissions at once: there is no "add" or "remove", you
replace the entire set.

### When to use which form?

- **Symbolic** (`u+x`): when you want to change one thing without affecting the rest.
- **Numeric** (`755`): when you know exactly what the final permissions should be.

---

## Mission: Lock Down the Thruster Script

`engine_control.sh` fires the main thruster and ships with `readme.txt`. Station security sets each file's access in a single step, all three groups at once:

- `engine_control.sh`: the owner can do everything, the group can read and run it, others get nothing.
- `readme.txt`: the owner can read and change it, the group can only read it, others get nothing.

Then move both into a new `engine-bay` folder.

**Expected result**

Both files sit in `engine-bay` with exactly the access above.

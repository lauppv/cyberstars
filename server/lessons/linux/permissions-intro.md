Every file on Linux has **permissions** that control who can read, write, or execute it.
Run `ls -l` and look at the first column:

```bash
ls -l
```

```text
-rwxr-xr-- 1 student crew  4096 Jan 10 08:00 launch.sh
-rw-r--r-- 1 student crew  2048 Jan 10 08:00 config.txt
drwxr-x--- 2 student crew  4096 Jan 10 08:00 logs
```

The permission string has 10 characters. The first is the type (`-` = file, `d` =
directory). The remaining 9 split into three groups of three:

| Positions | Who | Meaning |
|-----------|-----|---------|
| 2-4 | **u**ser (owner) | `rwx` = read, write, execute |
| 5-7 | **g**roup | `r-x` = read, no write, execute |
| 8-10 | **o**thers | `r--` = read only |

A dash (`-`) means that permission is **not** granted.

### What do r, w, x mean?

- **r** (read) — view the file's contents.
- **w** (write) — modify or delete the file.
- **x** (execute) — run the file as a program/script.

For directories: `r` = list contents, `w` = add/remove files, `x` = enter (`cd`).

---

Run `ls -l` to see the permissions of the files in your directory. Identify which file
is executable by the owner.

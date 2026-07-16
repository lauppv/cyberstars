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

| Positions | Who              | Meaning                         |
| --------- | ---------------- | ------------------------------- |
| 2-4       | **u**ser (owner) | `rwx` = read, write, execute    |
| 5-7       | **g**roup        | `r-x` = read, no write, execute |
| 8-10      | **o**thers       | `r--` = read only               |

A dash (`-`) means that permission is **not** granted.

### What do r, w, x mean?

- **r** (read) — view the file's contents.
- **w** (write) — modify or delete the file.
- **x** (execute) — run the file as a program/script.

For directories: `r` = list contents, `w` = add/remove files, `x` = enter (`cd`).

---

## Mission: Security Audit

The station commander has ordered a permissions audit on your workstation and wants a written record filed away.

1. Display the full permission details for every file in your home directory.
2. Save that detailed listing into a new file called `audit.txt`.
3. Create a folder called `audit-report` and move `audit.txt` into it.
4. Count how many lines the saved audit contains.

**Expected result**

`audit-report/audit.txt` holds the permission listing for every file in your home directory.

Before changing ownership, you need to know **who you are** on the system. Two commands
tell you:

### `whoami` — your username

```bash
whoami
```

```text
student
```

Simple and direct — prints just your login name.

### `id` — full identity details

```bash
id
```

```text
uid=1000(student) gid=1000(crew) groups=1000(crew),27(sudo)
```

This shows your **user ID** (uid), **primary group** (gid), and all groups you belong
to. Groups determine which "group" permissions apply to you.

### Ownership in `ls -l`

```bash
ls -l mission.txt
```

```text
-rw-r--r-- 1 student crew 512 Jan 10 08:00 mission.txt
```

The two names after the link count are the **owner** (`student`) and the **group**
(`crew`). The owner column determines who the "user" permissions apply to.

### Why this matters

If you are not the owner of a file and not in its group, the "others" permissions apply
to you. Understanding your identity helps you predict what you can and cannot do.

---

Run `whoami` to confirm your username, then run `id` to see your full identity and
groups. Finally, use `ls -l` to check who owns the file `classified.doc`.

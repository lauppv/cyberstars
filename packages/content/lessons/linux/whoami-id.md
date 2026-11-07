Before changing ownership, you need to know **who you are** on the system. Two commands
tell you:

### `whoami`: your username

```bash
whoami
```

```text
student
```

Simple and direct: prints just your login name.

### `id`: full identity details

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

## Mission: Identity Verification

A classified document turned up in your home directory. Station protocol: log who you are before you touch it, then lock it down.

1. Write the log `id-check/identity.txt`: your username alone on the first line, then your full identity with your groups.
2. Make `classified.doc` readable and writable by its owner only, with no access for anyone else.

**Expected result**

`id-check/identity.txt` starts with your username and goes on with your user and group ids, and only you can open `classified.doc`.

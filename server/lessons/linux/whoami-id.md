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

## Mission: Identity Verification

A classified document was found in your home directory. Before anyone can access it, station protocol requires you to log your identity and lock the file down.

1. Confirm your username.
2. Save your full identity details, including your groups, into a file called `identity.txt`.
3. Lock down `classified.doc` so only the owner can read and write it, and no one else has any access.
4. Create a folder called `id-check` and move `identity.txt` into it.

**Expected result**

`id-check/identity.txt` holds your identity details, and `classified.doc` is `-rw-------`.

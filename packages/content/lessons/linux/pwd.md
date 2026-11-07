Every time you use the terminal, you are **inside a folder**. Linux calls it a
**directory**. This is your _current location_, also known as the
**working directory**.

Knowing where you are matters: commands like "list the files here" or "delete this
file" act on your current directory.

To find out where you are, use **pwd**. It stands for **print working directory**.

```bash
pwd
```

It prints the full path of the folder you are in, for example:

```text
/home/student
```

This path is read like a road: it starts at `/` (the **root** of the whole system)
and each `/` separates one folder from the next. So `/home/student` means:

- `/`: the root
- `home`: a folder inside root
- `student`: a folder inside home (this is _your_ folder)

When you start the terminal you usually begin in your **home directory**, the place
that belongs to you. For the user `student`, that home directory is `/home/student`.

`pwd` never changes anything. It only _reports_. It is completely safe to run as
often as you like.

---

## Mission: Locate Your Position

You have just arrived at the station and opened a fresh terminal. Before doing anything else, find out the full path of the folder you are standing in.

**Expected result**

The terminal shows a path that starts at the root `/` and ends with your own folder.

Now that you know **where** you are with `pwd`, the next question is: **what is
here?**

The **ls** command (short for **list**) shows you the files and folders inside your
current directory.

```bash
ls
```

If the folder contains a few items, it might print:

```text
mission.txt  reports  tools
```

Each name is either a **file** (like `mission.txt`) or a **folder / directory** (like
`reports` and `tools`). With the plain `ls` command they can look similar — in a later
lesson you will learn how to tell them apart at a glance.

You can also list the contents of a folder **without going into it** by giving its
name to `ls`:

```bash
ls reports
```

```text
january.log  february.log
```

This peeks inside `reports` while you stay where you are.

Like `pwd`, `ls` only _looks_ — it never changes or deletes anything. It is safe to
run any time you feel lost.

A useful habit: run `ls` whenever you arrive in a new directory, so you always know
what you are working with.

---

Your home directory contains some files and folders left by the previous crew. Run
**ls** to see what is here.

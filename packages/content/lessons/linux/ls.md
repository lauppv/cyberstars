Now that you know where you are with `pwd`, the next question is: **what is
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
`reports` and `tools`). With the plain `ls` command they can look similar. In a later
lesson you will learn how to tell them apart at a glance.

You can also list the contents of a folder without going into it by giving its
name to `ls`:

```bash
ls reports
```

```text
january.log  february.log
```

This peeks inside `reports` while you stay where you are.

Like `pwd`, `ls` only _looks_. It never changes or deletes anything. It is safe to
run any time you feel lost.

A useful habit: run `ls` whenever you arrive in a new directory, so you always know
what you are working with.

---

## Mission: Inventory Check

The previous crew left files and folders in your home directory, and one of the folders holds their old report logs. Before your shift starts, find out what they left behind and which months their reports cover. Stay in your home directory the whole time.

**Expected result**

You can name everything in your home directory and every report log, and you never left home.

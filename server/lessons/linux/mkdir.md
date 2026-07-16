You can move around the station — now it is time to **build**. The first building
block is a new **directory** (folder).

The **mkdir** command (**make directory**) creates a folder. Give it the name you
want:

```bash
mkdir reports
```

Nothing is printed when it succeeds — Linux stays quiet on success. Run `ls` to
confirm the folder appeared:

```bash
ls
```

```text
reports
```

### Making several folders at once

`mkdir` accepts more than one name:

```bash
mkdir logs data backups
```

That creates three folders in one go.

### Nested folders: `mkdir -p`

What if you want a folder _inside_ a folder that does not exist yet? This fails:

```bash
mkdir projects/website
```

```text
mkdir: cannot create directory 'projects/website': No such file or directory
```

The `-p` option (**parents**) tells `mkdir` to create every missing folder along the
path:

```bash
mkdir -p projects/website
```

Now both `projects` and `projects/website` exist.

---

## Mission: Build a Workspace

The station needs a new directory structure for the upcoming mission. You will set it up from scratch.

1. Create a folder called `mission`.
2. Inside it, create three sibling folders in a **single** command: `mission/logs`, `mission/data` and `mission/backups`.
3. In one command, create the nested path `mission/logs/day1` at once — including any parent folders that don't exist yet.
4. Verify the whole structure as a tree.

**Expected result**

The tree of `mission` shows `logs`, `data` and `backups`, with `day1` nested inside `logs`.

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

What if you want a folder *inside* a folder that does not exist yet? This fails:

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

In your home directory, build a small workspace:

1. Create a folder called `mission`.
2. Using a single `mkdir -p` command, create the nested path `mission/logs/day1`.

When you finish, the directory `mission/logs/day1` should exist.

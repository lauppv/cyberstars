A small company runs three web apps: a shop, a blog and an invoicing tool. Tonight their database moves to a new server, `db.internal`, which also listens on a new port, 6432 instead of 5432, and the old cache server is being switched off for good. Radu, who wrote the apps, is on holiday. Every app reads its settings from plain text files, so you'll make the change by hand, carefully, without breaking anything else.

You do it one step at a time, in the terminal on the right. Tick a step off once the files look like it asks; you can always come back and untick it.

The terminal starts fresh every time you open the page or press Reset, with the config files back as they were. Each step is a command or two, so redo the ones you had done.

`grep -r` and `find` list files in the order their folder keeps them, which isn't always alphabetical, so your lines may come in another order than here.

## Map the config files

Everything is under `~/apps`. Find every file whose name ends in `.conf` with `find` and `-name` (put the pattern in quotes, so the shell leaves the `*` to `find`):

```text
apps/invoices/config/mail.conf
apps/invoices/config/db.conf
apps/blog/config/db.conf
apps/blog/config/app.conf
apps/shop/config/db.conf
apps/shop/config/app.conf
```

Six files, two per app. Look at a few with `cat`: each line is a `name=value` setting.

## Find the old server

Search every file under `apps` for `db-old.lan`, the old database server, with `grep -r`, and `-n` for the line numbers:

```text
apps/invoices/NOTES.txt:1:2024-03: moved invoices from db-old.lan's first disk to its second.
apps/invoices/config/db.conf:1:db_host=db-old.lan
apps/blog/config/db.conf:1:db_host=db-old.lan
apps/blog/config/db.conf:4:replica_host=db-old.lan
apps/shop/config/db.conf:1:db_host=db-old.lan
```

Four settings in three files must change. The first line is Radu's note about the past: that one stays as it is.

## Back up first

Before you change a single file, copy the whole `apps` folder to `apps-backup` with `cp -r`. If anything goes wrong tonight, the company is one `cp` away from how it was. `ls` shows both folders.

## Try the change without making it

`sed` without `-i` prints the changed file and leaves the file itself alone, which makes it the safe way to check a replacement:

```bash
sed 's/db-old.lan/db.internal/' apps/blog/config/db.conf
```

```text
db_host=db.internal
db_port=5432
db_name=blog
replica_host=db.internal
```

`cat` the same file afterwards: it still says `db-old.lan`.

## Move to the new server

Now make the change for real, in every config file at once. `sed -i` writes the result back into the file, and it takes many files, so a wildcard path such as `apps/*/config/*.conf` hands it all six (and never the note, which isn't a `.conf`). Two details:

- in a pattern a `.` means any character, so write `db-old\.lan` to match only a real dot
- add `g` after the last `/`, so a line naming the server twice changes both times

Then search the whole of `apps` for `db-old.lan` again. Only the note is left:

```text
apps/invoices/NOTES.txt:2024-03: moved invoices from db-old.lan's first disk to its second.
```

## The new port

Search for `5432`:

```text
apps/invoices/config/db.conf:2:db_port=5432
apps/blog/config/app.conf:4:upload_port=5432
apps/blog/config/db.conf:2:db_port=5432
apps/shop/config/db.conf:2:db_port=5432
```

The blog's `upload_port` has nothing to do with the database: replacing every 5432 would break the blog's uploads. `sed` can pick the lines it works on: `/^db_port=/s/5432/6432/` replaces only on lines that start with `db_port=`. Apply it to all six files with `-i`, then search for both numbers (`grep -rn "5432\|6432" apps`): the three `db_port` lines say 6432 and `upload_port` still says 5432.

## Switch off the cache

The old cache server is gone tomorrow. Find the `cache_server` settings, then turn them off without deleting them, by putting `# ` in front: a line starting with `#` is a comment the apps skip, and Radu can still see what was there. Anchor the pattern with `^`, so it only matches at the start of a line:

```text
apps/invoices/config/mail.conf:3:# cache_server=cache-old.lan
apps/shop/config/app.conf:3:# cache_server=cache-old.lan
```

## Check the work

Compare an app before and after: `cat apps/shop/config/db.conf` and then `cat apps-backup/shop/config/db.conf`.

```text
db_host=db.internal
db_port=6432
db_name=shop
db_user=shop
```

```text
db_host=db-old.lan
db_port=5432
db_name=shop
db_user=shop
```

Count the old name in every backed-up config file, `grep -rc` with `--include="*.conf"`, and you get 1, 2 and 1 for the three `db.conf` files and 0 for the rest: the four settings you changed. Leave Radu a line in `apps/CHANGES.txt` saying what you did, with `echo` and `>>`, one line per change.

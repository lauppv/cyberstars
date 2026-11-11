A small company runs three web apps: a shop, a blog and an invoicing tool. Tonight their database moves to a new server, `db.internal`, which also listens on a new port, 6432 instead of 5432, and the old cache server is being switched off for good. Noah, who wrote the apps, is on holiday. Every app reads its settings from plain text files, so you'll make the change by hand, carefully, without breaking anything else.

You do it one step at a time, in the terminal on the right. Tick a step off once the files look like it asks; you can always come back and untick it.

When every step is done, press **Run Tests**: it checks the files in this terminal, so do the steps in one go. The terminal starts fresh every time you open the page or press Reset, with the starting files back, so after a reset run the earlier steps again (each is a command or two). Passing the tests finishes the project.

`grep -r` and `find` list files in the order their folder keeps them, which isn't always alphabetical, so your lines may come in another order than here.

## Map the config files

Everything is under `~/apps`. Find every configuration file, the ones whose name ends in `.conf`. How many are there, and how many per app? Look at a few: each line is a `name=value` setting.

## Find the old server

Find every line under `apps` that mentions `db-old.lan`, the old database server, with its file and its line number. Decide which of them are settings that must change: a note about the past stays as it is.

## Back up first

Before you change a single file, copy the whole `apps` folder to `apps-backup`. If anything goes wrong tonight, the company is one command away from how it was.

## Try the change without making it

Show what one of the `db.conf` files would look like with `db-old.lan` replaced by `db.internal`, without changing the file. Then check that the file itself still says `db-old.lan`.

## Move to the new server

Now make the change for real, in every configuration file at once, and in nothing else. Two traps:

- in a pattern a `.` means any character, so match only a real dot
- a line can name the server twice, and both must change

Then search the whole of `apps` for `db-old.lan` again: only the note should be left.

New idea: `sed` can write its result back into the file it read, instead of printing it. `sed --help` tells you how.

## The new port

The database moves to port `6432`. Find every `5432` under `apps` first: not all of them are the database's. Change only the `db_port` settings, in every configuration file, and leave every other `5432` as it is. Then search for both numbers to check.

New idea: a `sed` command can be limited to the lines that match a pattern, written between slashes in front of it.

## Switch off the cache

The old cache server is gone tomorrow. Find the `cache_server` settings and switch them off without deleting them: put `# ` (a hash and a space) at the start of each line. A line starting with `#` is a comment the apps skip, and Noah can still see what was there. Only a setting at the start of a line may change.

## Check the work

Compare an app before and after, its configuration against the backup's. Then count how many times the old server's name appears in each backed-up configuration file: the counts must add up to the settings you changed.

Leave Noah `apps/CHANGES.txt` saying what you did, one line per change.

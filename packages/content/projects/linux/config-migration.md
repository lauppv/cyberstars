A small company has three web apps: a shop, a blog and a tool for invoices. Tonight their database moves to a new server, `db.internal`. The new server also uses a new port, 6432 instead of 5432. And the old cache server will be switched off for good. Noah, who wrote the apps, is on holiday. Every app reads its settings from plain text files, so you will make the change by hand, carefully, without breaking anything else.

**What you start with.** Everything is in `~/apps`: one folder for each app, with its settings files in a `config` folder, and a notes file.

Some words you will meet:

| Word        | What it means                                                               |
| ----------- | --------------------------------------------------------------------------- |
| config file | a settings file. Here, every file whose name ends in `.conf`                |
| setting     | one line of a config file, written `name=value`, like `db_port=5432`        |
| server      | the computer an app talks to, named here like `db-old.lan`                  |
| port        | a number that says which program on a server to talk to                     |
| backup      | a copy of the files from before, to go back to if something goes wrong      |
| comment     | a line that starts with `#`: the apps skip it, but people can still read it |

**How you work.** You do everything in the terminal on the right, one step at a time. Tick a step when the files look the way it asks. When every step is done, press **Run Tests**: it checks the files in this terminal. Passing it finishes the project.

The terminal starts again from the first files every time you open the page or press Reset. So do the steps in one go, and after a reset, do the earlier steps again (each one is a command or two).

`grep -r` and `find` list files in the order their folder keeps them, which is not always from A to Z. So your lines can come in another order than here.

## Map the config files

Find every config file under `~/apps`. How many are there, and how many does each app have? Look inside a few of them: each line is a setting.

## Find the old server

Find every line under `apps` that has `db-old.lan`, the old database server, with its file and its line number.

Then decide which of these lines are settings that must change. A note about something in the past stays as it is.

## Back up first

Before you change any file, copy the whole `apps` folder to `apps-backup`. If anything goes wrong tonight, one command takes the company back to how it was.

## Try the change without making it

Show how one of the `db.conf` files would look with `db-old.lan` changed to `db.internal`, but don't change the file. Then check that the file itself still says `db-old.lan`.

## Move to the new server

Now make the change for real, in every config file at once, and in no other file. Be careful about two things:

- in a pattern, a `.` means any character, so make it match only a real dot
- a line can have the server's name twice, and both must change

Then look for `db-old.lan` in the whole `apps` folder again: only the note should still have it.

A new idea: `sed` can write its result back into the file it read, instead of printing it. `sed --help` tells you how.

## The new port

The database moves to port `6432`. First find every `5432` under `apps`: not all of them are the database's port. Change only the `db_port` settings, in every config file, and leave every other `5432` as it is. Then look for both numbers to check.

A new idea: a `sed` command can work only on the lines that match a pattern, written between slashes in front of it.

## Switch off the cache

The old cache server is gone tomorrow. Find the `cache_server` settings, and switch them off without deleting them: put `# ` (a hash and a space) at the start of each one. The line is then a comment, and Noah can still see what was there. Only a setting at the start of a line may change.

## Check the work

Compare an app's config files now with the ones in the backup. Then count how many times the old server's name is in each config file of the backup: the counts must add up to the number of settings you changed.

Last, leave Noah a file, `apps/CHANGES.txt`, that says what you did, one line for each change.

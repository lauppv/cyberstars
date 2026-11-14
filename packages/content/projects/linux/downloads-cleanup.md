Lucia's laptop is slow, and her Downloads folder is the reason: photos, bills, music, downloads that never finished and a copy of her CV, all mixed in one pile. She asked you to put it in order before she starts looking for a new job.

**What you start with.** Everything is in `~/downloads`, in one pile with no folders.

**What you leave at the end.**

- in `downloads`, five folders, the shelves: `images`, `documents`, `music`, `videos` and `archives`, with every file on its shelf, and nothing loose next to them
- no unfinished downloads, no cache file, no second copy of the CV
- three lists in your home folder: `before.txt`, `big-files.txt` and `after.txt`

Some words you will meet:

| Word          | What it means                                                                             |
| ------------- | ----------------------------------------------------------------------------------------- |
| extension     | the end of a file's name after the last dot, like `.jpg`: it says what kind of file it is |
| leftover      | a file Lucia doesn't need: a download that never finished, or a cache file a program made |
| kilobyte (KB) | a size: about a thousand bytes                                                            |
| path          | where a file is, with its folders, like `downloads/music/song.mp3`                        |

**How you work.** You do everything in the terminal on the right, one step at a time. Each step leaves something (a file, a folder, a smaller pile) that the next one builds on. Tick a step when the files look the way it asks. When every step is done, press **Run Tests**: it checks the files in this terminal. Passing it finishes the project.

The terminal starts again from the first files every time you open the page or press Reset. So do the steps in one go, and after a reset, do the earlier steps again (each one is a command or two).

## Take stock

Save the list of what is in `downloads` to `~/before.txt`, one name on each line, so you can compare at the end. How many files does Lucia have?

## Throw out the junk

Some of the files are leftovers: downloads that never finished, and a cache file. Their names tell you which ones they are. Remove all of them with one command, without writing any whole name.

## Make the shelves

Inside `downloads`, make five folders with one command: `images`, `documents`, `music`, `videos` and `archives`.

## Sort by type

Move every file to its shelf by its extension, with as few commands as you can:

| Extension                 | Shelf       |
| ------------------------- | ----------- |
| `.jpg`, `.png` (pictures) | `images`    |
| `.pdf`, `.docx`, `.txt`   | `documents` |
| `.mp3`                    | `music`     |
| `.mp4`                    | `videos`    |
| `.zip`                    | `archives`  |

When you are done, only the five folders are left in `downloads`.

## Remove the copy

Lucia saved her CV twice: one of the files has `-copy` in its name, somewhere on the shelves. Find it by its name.

Before you delete anything, make sure it really is the same CV as the first one: the same text and the same size. Then remove the copy and keep the first one.

## Find the space hogs

A few files take almost all the room. Save to `~/big-files.txt` every file in `downloads` bigger than 20 kilobytes, one path on each line, as seen from inside `downloads`, so each one starts with `./`. Lucia will decide herself if she keeps them, so leave them where they are.

## Before and after

Go back to your home folder. Save every file left in `downloads` to `~/after.txt`: one on each line, with its folders, starting with `downloads/`, in order from A to Z.

Then count both lists with one command: how many files were in the pile, and how many are on the shelves now?

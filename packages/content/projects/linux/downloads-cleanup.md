Maria's laptop is slow, and her Downloads folder is why: photos, invoices, music, half-finished downloads and a copy of her CV, all in one heap. She asked you to sort it out before she starts looking for a new job.

You do it one step at a time, in the terminal on the right. Each step leaves something behind (a file, a folder, a cleaner heap) that the next one builds on. Tick a step off once the files look like it asks; you can always come back and untick it.

The terminal starts fresh every time you open the page or press Reset, with Maria's files back the way they were. If you leave in the middle, run the steps you had done again; each one is a handful of commands.

## Take stock

Everything is in `~/downloads`. List it, then save the same list to `~/before.txt`, so you can compare once you are done:

```bash
ls downloads > before.txt
```

Count the lines of `before.txt` with `wc`. Maria has 16 files:

```text
16 before.txt
```

## Throw out the junk

Three files are leftovers, not things Maria wants: the two downloads that never finished end in `.part`, and `thumbs.tmp` is a cache. Go into `downloads` and remove all three with a single `rm` and wildcards, without typing a full name.

Then count what is left: `ls | wc -l` prints `13`.

## Make the shelves

Inside `downloads`, make five folders with one `mkdir`: `images`, `documents`, `music`, `videos` and `archives`.

`ls` now shows the five folders among the 13 files. `ls -d */` lists only the folders, each with a `/` after its name. The next step fills them.

## Sort by type

Move every file into its folder by its extension, with wildcards again:

- `.jpg` and `.png` go to `images`
- `.pdf`, `.docx` and `.txt` go to `documents`
- `.mp3` goes to `music`, `.mp4` to `videos`
- `.zip` goes to `archives`

`mv` takes several files and a folder last, so one command can move both kinds of pictures. When you are done, `ls` in `downloads` shows only the five folders:

```text
archives
documents
images
music
videos
```

## Remove the copy

Maria saved her CV twice. Find the copy with `find`, by a name that contains `-copy`:

```text
./documents/cv-final-copy.docx
```

Before you delete anything, make sure it really is the same CV: print both files with `cat`, and compare their sizes with `wc -c`. Both have 63 bytes and the same two lines. Then remove the copy, and keep `cv-final.docx`.

## Find the space hogs

Two files take up almost all the room. Find every file in `downloads` bigger than 20 kilobytes with `find`'s `-type f` and `-size`, and save the list to `~/big-files.txt`:

```text
./archives/old-photos.zip
./videos/holiday-video.mp4
```

(Run it from inside `downloads`, so the paths start with `./`.) `ls -lS archives videos` shows how big they are, the biggest first. Maria will decide herself whether to keep them, so leave them where they are.

## Before and after

Back in your home folder, save every file left in `downloads`, with its folder, sorted, to `~/after.txt`. `find` with `-type f` lists them; `sort` puts them in order:

```text
downloads/archives/old-photos.zip
downloads/archives/tax-forms.zip
downloads/documents/cv-final.docx
downloads/documents/invoice-april.pdf
downloads/documents/invoice-march.pdf
downloads/documents/recipe-pancakes.txt
downloads/images/beach-day.jpg
downloads/images/birthday-cake.jpg
downloads/images/screenshot-login.png
downloads/music/podcast-ep12.mp3
downloads/music/road-trip-mix.mp3
downloads/videos/holiday-video.mp4
```

Then count both lists with one `wc -l`. From 16 files in a heap to 12 on their shelves:

```text
 16 before.txt
 12 after.txt
 28 total
```

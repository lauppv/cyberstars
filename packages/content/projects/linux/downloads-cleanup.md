Maria's laptop is slow, and her Downloads folder is why: photos, invoices, music, half-finished downloads and a copy of her CV, all in one heap. She asked you to sort it out before she starts looking for a new job.

You do it one step at a time, in the terminal on the right. Each step leaves something behind (a file, a folder, a cleaner heap) that the next one builds on. Tick a step off once the files look like it asks; you can always come back and untick it.

When every step is done, press **Run Tests**: it checks the files in this terminal, so do the steps in one go. The terminal starts fresh every time you open the page or press Reset, with the starting files back, so after a reset run the earlier steps again (each is a command or two). Passing the tests finishes the project.

## Take stock

Everything is in `~/downloads`. Save the list of what is there to `~/before.txt`, one name per line, so you can compare once you are done. How many files does Maria have?

## Throw out the junk

Some of the files are leftovers, not things Maria wants: downloads that never finished, and a cache file. Their names tell you which they are. Remove them all with a single command that doesn't spell out any full name.

## Make the shelves

Inside `downloads`, make five folders with one command: `images`, `documents`, `music`, `videos` and `archives`.

## Sort by type

Move every file onto its shelf by its extension, with as few commands as you can:

- pictures, `.jpg` and `.png`, go to `images`
- `.pdf`, `.docx` and `.txt` go to `documents`
- `.mp3` goes to `music`, `.mp4` to `videos`
- `.zip` goes to `archives`

When you are done, nothing but the five folders is left loose in `downloads`.

## Remove the copy

Maria saved her CV twice: one of the files has `-copy` in its name, somewhere on the shelves. Find it by its name. Before you delete anything, make sure it really is the same CV as the original, in what it says and in its size. Then remove the copy and keep the original.

## Find the space hogs

A couple of files take up almost all the room. Save to `~/big-files.txt` every file in `downloads` bigger than 20 kilobytes, one path per line as seen from inside `downloads`, so each starts with `./`. Maria will decide herself whether to keep them, so leave them where they are.

## Before and after

Back in your home folder, save every file left in `downloads` to `~/after.txt`: one per line with its folders, starting with `downloads/`, in alphabetical order. Then count both lists with one command: how many files were in the heap, and how many are on their shelves?

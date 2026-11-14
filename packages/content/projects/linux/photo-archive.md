Grandma Sofia got a new phone. Before the old one goes in a drawer, she wants her photos safe: sorted by year, the summer at the sea in an album of its own, and nothing deleted by mistake. The photos are already copied off the phone, into one folder. You will turn that folder into an archive.

**What you start with.** All the photos are in `~/phone`, in one folder.

Every photo's name says when it was taken. `IMG_20230715_183040.jpg` is from the year 2023, month 07, day 15, at 18:30:40. That is all you need to sort them. The first three letters say which app made it: `IMG` the old camera app, `PXL` the camera app after an update, `Scr` a screenshot.

**What you leave at the end.**

- in `phone`, one folder for each year, with that year's photos, and nothing loose next to them
- `~/screenshots`, with every screenshot
- `~/albums/summer-2023`, with the photos of July and August 2023
- `~/index.txt`, a list of every photo in the archive
- the year folders locked, so nobody can change them by mistake

Some words you will meet:

| Word       | What it means                                                              |
| ---------- | -------------------------------------------------------------------------- |
| archive    | photos or files kept in order, to stay safe for a long time                |
| screenshot | a picture of what was on the phone's screen                                |
| album      | a folder of photos about one thing, like a holiday                         |
| permission | what a user may do with a file or folder: read it, write to it, or open it |

**How you work.** You do everything in the terminal on the right, one step at a time. Tick a step when the files look the way it asks. When every step is done, press **Run Tests**: it checks the files in this terminal. Passing it finishes the project.

The terminal starts again from the first files every time you open the page or press Reset. So do the steps in one go, and after a reset, do the earlier steps again (each one is a command or two).

## Look at what came off the phone

How many photos are there? Find out how many photos each app made, without counting by hand.

## Set the screenshots aside

Screenshots are not memories: they are bus tickets and recipes. Move all of them, with one command, to a folder `~/screenshots`, next to `phone`, not inside it.

## A folder per year

In `phone`, make a folder for every year of the photos, with the year as its name, and move each photo into its year. Nothing stays loose in `phone`.

## The summer album

Grandma wants the holiday at the sea, in July and August 2023, in an album of its own: `~/albums/summer-2023`. The `albums` folder doesn't exist yet. Put the photos of those two months in the album, and keep them in `2023` too.

## The index

Write a list of every photo in the archive to `~/index.txt`, so grandma can print it: one path on each line, as seen from inside `phone`, so each one starts with `./`, in order from A to Z.

Then check that nothing was lost on the way: the archive has every photo from the phone except the screenshots.

## Lock the archive

The year folders should never change again. Take away everyone's right to write to them and to everything inside them, and leave every other permission as it was. Then try to delete a photo, as if by mistake, and check that it is still there.

The album is not locked, so grandma can still add photos to it.

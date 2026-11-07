Grandma Elena got a new phone, and before the old one goes in a drawer she wants her photos safe: sorted by year, the summer at the seaside in an album of its own, and nothing deleted by accident. The photos are already copied off the phone, in one folder. You'll turn that folder into an archive.

You do it one step at a time, in the terminal on the right. Tick a step off once the files look like it asks; you can always come back and untick it.

When every step is done, press **Run Tests**: it checks the files in this terminal, so do the steps in one go. The terminal starts fresh every time you open the page or press Reset, with the starting files back, so after a reset run the earlier steps again (each is a command or two). Passing the tests finishes the project.

Every photo's name says when it was taken: `IMG_20230715_183040.jpg` is from 2023, month 07, day 15, at 18:30:40. That is all you need to sort them.

## Look at what came off the phone

The photos are in `~/phone`. How many are there? The first three letters of a name tell which app made it: `IMG` the old camera app, `PXL` the camera app after an update, `Scr` a screenshot. Find out how many photos each app made, without counting by hand.

## Set the screenshots aside

Screenshots aren't memories: they are bus tickets and recipes. Move all of them, in one command, to a folder `~/screenshots` next to `phone`, not inside it.

## A folder per year

The names also hold the date each photo was taken. In `phone`, make a folder for every year the photos cover, named after the year, and move each photo into its year. Nothing stays loose in `phone`.

## The summer album

Grandma wants the seaside holiday of July and August 2023 in an album of its own, `~/albums/summer-2023`; the `albums` folder doesn't exist yet. Put the photos of those two months in it, and keep them in `2023` as well.

## The index

Write a list of every photo in the archive to `~/index.txt`, so grandma can print it: one path per line as seen from inside `phone`, so each starts with `./`, in alphabetical order. Then check that nothing got lost on the way: the archive holds every photo from the phone except the screenshots.

## Lock the archive

The year folders should never change again. Take away everyone's right to write to them and to everything inside them, and leave every other permission as it was. Then try to delete a photo by mistake, and check that it is still there.

The album isn't locked, so grandma can still add to it.

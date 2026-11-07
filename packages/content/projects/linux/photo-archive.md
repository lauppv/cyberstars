Grandma Elena got a new phone, and before the old one goes in a drawer she wants her photos safe: sorted by year, the summer at the seaside in an album of its own, and nothing deleted by accident. The photos are already copied off the phone, in one folder. You'll turn that folder into an archive.

You do it one step at a time, in the terminal on the right. Tick a step off once the files look like it asks; you can always come back and untick it.

The terminal starts fresh every time you open the page or press Reset, with the photos back in one folder. Each step is a few commands, so redo the ones you had done.

Every photo's name says when it was taken: `IMG_20230715_183040.jpg` is from 2023, month 07, day 15, at 18:30:40. That is all you need to sort them.

## Look at what came off the phone

The photos are in `~/phone`. Go there and count them with `ls` and `wc -l`: there are 16.

The first three letters of a name tell which app made it: `IMG` the old camera app, `PXL` the camera app after an update, `Scr` a screenshot. Count how many of each with `cut -c1-3`, `sort` and `uniq -c`:

```text
      7 IMG
      6 PXL
      3 Scr
```

## Set the screenshots aside

Screenshots aren't memories: they are bus tickets and recipes. Make a folder `~/screenshots` next to `phone` (not inside it) and move all three there with one `mv` and a wildcard. `ls | wc -l` in `phone` now prints `13`.

## A folder per year

In `phone`, make the folders `2022`, `2023` and `2024` with one `mkdir`. Then move each photo into its year: a wildcard such as `*_2023*` matches every name with `_2023` in it, whatever the app. Three `mv` commands do it all.

`ls` shows only the three folders, and `ls 2023` the six photos of that year:

```text
IMG_20230402_121010.jpg
IMG_20230715_183040.jpg
IMG_20230716_101522.jpg
IMG_20230803_095847.jpg
PXL_20230806_160212.jpg
PXL_20231031_190455.jpg
```

## The summer album

Grandma wants the seaside holiday of July and August 2023 in an album of its own, to show her friends. Make `~/albums/summer-2023` with one `mkdir` (its `-p` makes `albums` too), then **copy** the photos of those two months into it, so they stay in `2023` as well. A wildcard such as `2023/*_202307*` picks July.

```text
IMG_20230715_183040.jpg
IMG_20230716_101522.jpg
IMG_20230803_095847.jpg
PXL_20230806_160212.jpg
```

## The index

Write a list of every photo in the archive to `~/index.txt`, so grandma can print it: `find` with `-type f` from inside `phone`, sorted.

```text
./2022/IMG_20220611_174402.jpg
./2022/IMG_20220612_090115.jpg
./2022/IMG_20221224_201933.jpg
./2023/IMG_20230402_121010.jpg
./2023/IMG_20230715_183040.jpg
./2023/IMG_20230716_101522.jpg
./2023/IMG_20230803_095847.jpg
./2023/PXL_20230806_160212.jpg
./2023/PXL_20231031_190455.jpg
./2024/PXL_20240101_000312.jpg
./2024/PXL_20240214_131700.jpg
./2024/PXL_20240722_082236.jpg
./2024/PXL_20240723_154410.jpg
```

Then check that nothing got lost on the way: `find . -type f | wc -l` counts 13, the 16 from the phone minus the 3 screenshots.

## Lock the archive

The year folders should never change again. Take away everyone's right to write to them and to everything inside, with `chmod` and its `-R` option: `a-w` takes write away from all three groups.

`ls -ld 2023` shows the folder without its `w`:

```text
dr-xr-xr-x 2 student student 4096 Nov  7 09:38 2023
```

Now try to delete a photo by mistake:

```text
rm: cannot remove '2023/IMG_20230402_121010.jpg': Permission denied
```

Without write permission on the folder, nothing can be removed from it, added to it or renamed in it. `ls 2023 | wc -l` still prints `6`. The album isn't locked, so grandma can still add to it.

The town museum is scanning its old black and white photos. The computer next to the scanner has no screen for pictures, only a terminal. The scans come out as PGM files, the simplest picture format there is: a list of numbers, one for each pixel. You will write, in C, the tool the museum needs on that computer. It reads a scan, shows a small preview made of characters, fixes the picture (turns it into its negative, makes it brighter, turns it around, cuts it, makes it softer) and saves it.

**How it works.** The program first reads a picture, then commands, and answers each command at once. Here is a session as you see it in the output box when you run a finished program. The picture and each command you type are followed by the program's answer:

```text
P2
8 6
255
0 0 0 0 0 0 0 0
0 60 60 60 200 200 200 0
0 60 255 60 200 255 200 0
0 60 60 60 200 200 200 0
0 120 120 120 120 120 120 0
0 0 0 0 0 0 0 0
Image 8x6, max 255
flip
Flipped
show
........
.###:::.
.#@#:@:.
.###:::.
.======.
........
flip
Flipped
rotate
Rotated, now 6x8
show
......
.=:::.
.=:@:.
.=:::.
.=###.
.=#@#.
.=###.
......
rotate
Rotated, now 8x6
rotate
Rotated, now 6x8
rotate
Rotated, now 8x6
crop 1 1 6 4
Cropped to 6x4
show
:::###
:@:#@#
:::###
======
blur
Blurred
show
--=+##
-:=+##
--=+**
---=++
save out.pgm
Saved out.pgm
cat out.pgm
P2
6 4
255
108 92 139 162 209 213
92 81 128 159 206 209
112 101 132 148 179 182
90 90 113 136 160 160
stats
Darkest 81, brightest 213, average 141
dark: 0
dim: 9
light: 11
bright: 4
quit
Bye
```

The commands:

| Command                         | What it does                                                 |
| ------------------------------- | ------------------------------------------------------------ |
| `show`                          | draws the picture with characters                            |
| `invert`                        | makes the negative: black becomes white                      |
| `brighten <amount>`             | makes the picture brighter, or darker with a negative amount |
| `flip`                          | mirrors the picture left to right                            |
| `rotate`                        | turns the picture a quarter to the right                     |
| `crop <x> <y> <width> <height>` | keeps only a rectangle of the picture                        |
| `blur`                          | makes the picture softer                                     |
| `stats`                         | gives numbers about the picture                              |
| `save <file>`                   | saves the picture in a file                                  |
| `cat <file>`                    | prints a file                                                |
| `quit`                          | ends the program                                             |

**To try your program**, press Run, paste the picture in the output box, then type the commands one by one. `quit` ends the program.

Build the program one step at a time, in one C file. Each step adds a command, and the commands from earlier steps keep working. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests give your program other scans. Passing them finishes the project.

## Read the image

The input starts with a picture in PGM's text form, `P2`:

1. the word `P2`
2. the width and the height
3. the biggest value a pixel can have, here 255 for white
4. how bright each pixel is, row by row from the top. 0 is black

```text
P2
8 6
255
0 0 0 0 0 0 0 0
0 60 60 60 200 200 200 0
0 60 255 60 200 255 200 0
0 60 60 60 200 200 200 0
0 120 120 120 120 120 120 0
0 0 0 0 0 0 0 0
```

Read everything with `scanf`. You don't know the size before you read it, so get the memory for the pixels with `malloc` after you know it: `width * height` ints, one row after another. The pixel at `(x, y)` is then at `y * width + x`. A small function that gives you its address saves a lot of typing.

Print `Image 8x6, max 255`. When the first word is not `P2`, print `Not a P2 image` and stop. When the pixels end too early, print `The image ends too soon` and stop.

Then read commands until `quit`, print `Bye`, and `free` the pixels before the program ends. For any other word, print `Unknown command: paint` and skip the rest of its line.

## A preview

`show` draws the picture with these characters, from dark to bright: `.,:-=+*#%@`. A pixel gets the character at place `brightness * 9 / max` of that string:

```text
show
........
.:::###.
.:@:#@#.
.:::###.
.======.
........
```

You can see two squares, the left one dark and the right one light, each with a bright pixel in the middle, over a grey line.

## Invert and brighten

- `invert` changes every pixel to `max - pixel`, so black becomes white. A scanned negative becomes a photo. Print `Inverted`
- `brighten <amount>` adds the amount to every pixel. A negative amount makes it darker. No pixel can go below 0 or above the biggest value, so a pixel that would go past stops there: we say it is clipped. Print how many pixels were clipped:

```text
brighten 100
Brightened by 100, 10 pixels clipped
show
--------
-+++@@@-
-+@+@@@-
-+++@@@-
-######-
--------
```

Clipping loses information. Brighten by 100 and then darken by 100, and the clipped pixels don't come back the same. That is why real tools keep the first picture.

## Flip and rotate

- `flip` mirrors the picture left to right: swap the pixels inside each row, in the same memory. Print `Flipped`
- `rotate` turns the picture a quarter to the right. The picture changes shape, from 8x6 to 6x8. So build the turned picture in new memory, then `free` the old pixels and keep the new ones. The pixel at `(x, y)` goes to `(height - 1 - y, x)` in the new picture

```text
rotate
Rotated, now 6x8
show
......
.=:::.
.=:@:.
.=:::.
.=###.
.=#@#.
.=###.
......
```

Four turns bring the picture back as it was.

## Crop

`crop <x> <y> <width> <height>` keeps only a rectangle of the picture. Its top left corner is at `(x, y)`. Build it in new memory too:

```text
crop 1 1 6 4
Cropped to 6x4
show
:::###
:@:#@#
:::###
======
```

When the rectangle doesn't fit inside the picture, print `That doesn't fit in 6x4` and change nothing.

## Soften

Old scans have small spots. `blur` changes every pixel to the average of itself and its neighbours: the square of 3 by 3 pixels around it. At the edges, count only the neighbours that are there. Every average must use the **old** values, so write the new pixels into new memory and swap at the end:

```text
blur
Blurred
show
--=+##
-:=+##
--=+**
---=++
```

The averages are whole numbers: the integer division rounds them down.

## Statistics

`stats` gives numbers about the picture: its darkest pixel, its brightest pixel, the average (rounded down), and how many pixels are in each quarter of the values. `pixel * 4 / (max + 1)` gives the quarter: 0 is `dark`, 1 `dim`, 2 `light`, 3 `bright`:

```text
stats
Darkest 81, brightest 213, average 141
dark: 0
dim: 9
light: 11
bright: 4
```

When almost all pixels are in one quarter, the scan needs to be brighter or darker.

## Save

`save <file>` writes the picture as a PGM file: `P2`, the size, the biggest value, then one line for each row, with its pixels separated by one space. Print `Saved out.pgm`, or `Cannot write ...` when the file can't be opened.

Add `cat <file>`, which prints a file line by line with `fgets`, so you can check it:

```text
cat out.pgm
P2
6 4
255
108 92 139 162 209 213
92 81 128 159 206 209
112 101 132 148 179 182
90 90 113 136 160 160
```

Your program can read the file it wrote, so the museum can fix a scan over several days.

Last, check the commands typed the wrong way: `brighten lots` prints `Usage: brighten <amount>`, and a `crop` without four numbers prints `Usage: crop <x> <y> <width> <height>`.

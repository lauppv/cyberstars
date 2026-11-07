The town museum is scanning its old black-and-white photographs, and the scanner's computer has no screen, only a terminal. The scans come out as PGM files, the simplest image format there is: plain numbers, one per pixel. You'll write the tool the museum needs on that computer: it reads a scan, shows a rough preview, fixes it (invert, brighten, flip, rotate, crop, soften) and saves the result.

You build it one step at a time, in one C file. Every step adds a command, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

The program reads the image and then the commands with `scanf`, and writes everything with `printf`. Run it, then type the lines of an example yourself to see what it answers (paste the image first).

## Read the image

The input starts with an image in PGM's text form, `P2`: the word `P2`, the width and height, the brightest value a pixel can have, then every pixel's brightness, row after row from the top, 0 being black:

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

You don't know the size until you've read it, so take the memory for the pixels with `malloc` once you have: `width * height` ints, one row after another. Pixel `(x, y)` is then at `y * width + x`; a small function that gives you its address saves a lot of typing.

Print `Image 8x6, max 255`. When the first word isn't `P2`, print `Not a P2 image` and stop; when the pixels run out early, `The image ends too soon`. Then read commands until `quit`, print `Bye`, and `free` the pixels before the program ends. Any other word prints `Unknown command: paint` and skips the rest of its line.

## A preview

`show` draws the image with characters, darker to brighter: `.,:-=+*#%@`. A pixel takes the character at position `brightness * 9 / max` of that string:

```text
show
........
.:::###.
.:@:#@#.
.:::###.
.======.
........
```

Two squares, the left one dim and the right one light, each with a bright pixel in the middle, over a grey bar.

## Invert and brighten

- `invert` turns every pixel into `max - pixel`, so black becomes white: a scanned negative turns into a photo. Print `Inverted`.
- `brighten <amount>` adds the amount to every pixel (a negative amount darkens). No pixel may go below 0 or above the maximum, so clip it there, and say how many pixels had to be clipped:

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

Clipping loses information: brighten by 100 and darken by 100, and the pixels that were clipped don't come back the same. That's why real tools keep the original.

## Flip and rotate

- `flip` mirrors the image left to right, swapping pixels in place within each row. Print `Flipped`.
- `rotate` turns it a quarter clockwise. The image changes shape, 8x6 becomes 6x8, so build the turned image in new memory, then `free` the old pixels and keep the new ones. The pixel at `(x, y)` goes to `(height - 1 - y, x)` in the new image.

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

Four rotations bring the image back as it was.

## Crop

`crop <x> <y> <width> <height>` keeps only a rectangle of the image, its top left corner at `(x, y)`, again in new memory:

```text
crop 1 1 6 4
Cropped to 6x4
show
:::###
:@:#@#
:::###
======
```

A rectangle that doesn't fit inside the image prints `That doesn't fit in 6x4` and changes nothing.

## Soften

Old scans are grainy. `blur` replaces every pixel with the average of itself and its neighbours, the 3 by 3 square around it; at the edges, only the neighbours that exist count. Every average must use the **old** values, so write the new pixels into new memory and swap at the end:

```text
blur
Blurred
show
--=+##
-:=+##
--=+**
---=++
```

The averages are whole numbers, rounded down by the integer division.

## Statistics

`stats` describes the image: its darkest and brightest pixel, the average (rounded down), and how many pixels fall in each quarter of the range, `pixel * 4 / (max + 1)` naming the quarter:

```text
stats
Darkest 81, brightest 213, average 141
dark: 0
dim: 9
light: 11
bright: 4
```

An image with almost everything in one quarter is a sign the scan needs brightening or darkening.

## Save

`save <file>` writes the image back as a PGM file: `P2`, the size, the maximum, then a line per row with its pixels separated by single spaces. Print `Saved out.pgm`, or `Cannot write ...` when the file can't be opened. Add `cat <file>`, which prints a file line by line with `fgets`, to check it:

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

Your program can read the file it wrote, so the museum can fix a scan in several sittings. Finally, check that `brighten lots` and a `crop` without four numbers print `Usage: brighten <amount>` and `Usage: crop <x> <y> <width> <height>`.

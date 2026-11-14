A school has an old weather station that sends its results as a file. Since last week, the program that reads the file stops with an error. Something in the file is wrong, but when you open it in a text editor it looks fine: the problem doesn't show as a letter. Programmers have a tool for this, the hex dump. It prints every byte of a file as a number. You will write one in C.

**The input** is the file itself. Here it has three lines of text, an empty line, and one more line. Between `two` and `ends` there is a tab, not a space:

```text
Hello, CyberStars!
Line two	ends here.

0123456789ABCDEFGHIJKLMNOPQRSTUV0123456789ABCDEFGHIJKLMNOPQRSTUV
```

**The output** for this input, when the program is finished:

```text
00000000  48 65 6c 6c 6f 2c 20 43  79 62 65 72 53 74 61 72  |Hello, CyberStar|
00000010  73 21 0a 4c 69 6e 65 20  74 77 6f 09 65 6e 64 73  |s!.Line two.ends|
00000020  20 68 65 72 65 2e 0a 0a  30 31 32 33 34 35 36 37  | here...01234567|
00000030  38 39 41 42 43 44 45 46  47 48 49 4a 4b 4c 4d 4e  |89ABCDEFGHIJKLMN|
00000040  4f 50 51 52 53 54 55 56  30 31 32 33 34 35 36 37  |OPQRSTUV01234567|
00000050  38 39 41 42 43 44 45 46  47 48 49 4a 4b 4c 4d 4e  |89ABCDEFGHIJKLMN|
00000060  4f 50 51 52 53 54 55 56  0a                       |OPQRSTUV.|
00000069

105 bytes: 74 letters, 20 digits, 3 spaces, 4 newlines, 4 other
Most common byte: 65 'e', 6 times
```

Each line of the dump has three parts:

| Part                   | What it is                                                                              |
| ---------------------- | --------------------------------------------------------------------------------------- |
| `00000010`             | the offset: where in the file this line starts, counted in bytes from 0, in hexadecimal |
| `73 21 0a 4c ...`      | the next 16 bytes, each one as two hexadecimal digits                                   |
| `\|s!.Line two.ends\|` | the same 16 bytes as text, with `.` for bytes that are not letters or signs             |

Hexadecimal is a way to write numbers with 16 digits: `0` to `9`, then `a` to `f` for 10 to 15. So `48` in hexadecimal is 4 × 16 + 8 = 72, the byte of the letter `H`. A newline is the byte 10, `0a`, and a tab is 9, `09`.

**To try your program**, press Run, click in the output box and paste the text. Then press **End input** under the output box (or Ctrl + D): the program reads the file until it ends, so it needs to know where the end is.

Build the program one step at a time, in one C file. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests give your program other files. Passing them finishes the project.

## Read every byte

`getchar()` reads one byte and gives it back as an `int`. When the input ends, it gives `EOF`, a value that is not any byte. Read every byte into an array of `unsigned char` (at most 65536 bytes), and count them:

```c
while (n < MAXB && (c = getchar()) != EOF) data[n++] = (unsigned char)c;
```

Use `unsigned char`: it keeps a byte as a number from 0 to 255. A normal `char` can be negative for bytes above 127, and then every next step goes wrong.

## Bytes as hex

Print the bytes 16 on each line. Print each byte as a space and then two hexadecimal digits, with `%02x`:

```text
 48 65 6c 6c 6f 2c 20 43 79 62 65 72 53 74 61 72
```

## Where each line starts

Before each line, print its offset as eight hexadecimal digits (`%08lx` for a `long`) and a space. After the last line, print the size of the file the same way, on its own line:

```text
00000000  48 65 6c 6c 6f 2c 20 43 79 62 65 72 53 74 61 72
...
00000069
```

An empty file prints only `00000000`.

## Easier to read

Two small changes make a line easier to read:

- one more space after the 8th byte, so the 16 bytes are in two groups of 8
- after the bytes, two spaces and the same bytes as text, between `|` and `|`

```text
00000000  48 65 6c 6c 6f 2c 20 43  79 62 65 72 53 74 61 72  |Hello, CyberStar|
00000010  73 21 0a 4c 69 6e 65 20  74 77 6f 09 65 6e 64 73  |s!.Line two.ends|
```

In the text, a byte below 32 or above 126 shows as `.`: these bytes are not letters or signs, like the newline `0a` and the tab `09`.

The last line can have fewer than 16 bytes. Put three spaces for each missing byte, so its text starts in the same place as on the other lines:

```text
00000060  4f 50 51 52 53 54 55 56  0a                       |OPQRSTUV.|
```

This is exactly what the real `hexdump -C` prints, so you can check your program with it on any computer that has it.

## The same line again

Files often repeat the same bytes: many zeros, or a row of the same letter. When a full line of 16 bytes is exactly the same as the line before it, print one `*` in its place, and nothing for the same lines right after it. The next line that is different prints as usual, with its own offset:

```text
00000000  61 61 61 61 61 61 61 61  61 61 61 61 61 61 61 61  |aaaaaaaaaaaaaaaa|
*
00000030  61 61 61 61 61 61 61 61  61 62 0a                 |aaaaaaaaab.|
0000003b
```

`memcmp` compares two pieces of memory, byte by byte. The last line always prints when it is shorter than 16 bytes.

## What's in the file

After the dump, print an empty line and a summary: the size, and how many bytes are letters, digits, spaces, newlines, and anything else. Then the byte that is there most often, in hexadecimal, with the character in quotes when it is a letter or a sign, and how many times it is there. If two bytes are there the same number of times, take the smaller one:

```text
105 bytes: 74 letters, 20 digits, 3 spaces, 4 newlines, 4 other
Most common byte: 65 'e', 6 times
```

An empty file has no most common byte, so it doesn't print that line. An array of 256 counters, one for each possible byte, counts all of them in one pass. And the weather station's file? It had a tab where a space should be.

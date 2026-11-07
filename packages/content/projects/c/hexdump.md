A school's old weather station sends its readings as a file, and since last week the program that reads them chokes on it. Something in the file is wrong, but opened in a text editor it looks perfectly fine: whatever broke it doesn't show as a letter. Programmers have a tool for this, the hex dump, which prints every single byte of a file as a number. You'll write one.

You build it one step at a time, in one C file. Tick a step off when your program does what it asks; you can always come back and untick it. When you think it's done, press **Run Tests**: the tests dump files your program has never seen. Passing them finishes the project.

The file comes in on the program's input, and the program asks nothing: it reads it all and prints the dump.

## Read every byte

`getchar()` reads one byte and returns it as an `int`, or `EOF` (a value that isn't any byte) when the input ends. Read every byte into an array of `unsigned char` (at most 65536), counting them:

```c
while (n < MAXB && (c = getchar()) != EOF) data[n++] = (unsigned char)c;
```

`unsigned char` holds a byte as a number from 0 to 255; a plain `char` may be negative for bytes above 127, which would spoil every step after this.

## Bytes as hex

Print the bytes 16 to a line, each as two hexadecimal digits (`%02x`) after a space. A byte is the same number written in base 16: `H` is 72, which is `48` in hexadecimal, and a newline is 10, `0a`.

## Where each line starts

In front of each line, print where in the file it starts, as eight hexadecimal digits (`%08lx` for a `long`), and a space. After the last line, print the size of the file the same way, on its own line:

```text
00000000  48 65 6c 6c 6f 2c 20 43  79 62 65 72 53 74 61 72
...
00000068
```

An empty file prints only `00000000`.

## Easier to read

Two touches that make a line easier on the eye: one extra space after the 8th byte, splitting the 16 into two groups, and, after the bytes, two spaces and the same bytes as text between `|` and `|`:

```text
00000000  48 65 6c 6c 6f 2c 20 43  79 62 65 72 53 74 61 72  |Hello, CyberStar|
00000010  73 21 0a 4c 69 6e 65 20  74 77 6f 09 65 6e 64 73  |s!.Line two.ends|
```

A byte that isn't a printable character (anything below 32 or above 126, like the newline `0a` and the tab `09`) shows as `.` in the text. The last line may have fewer than 16 bytes: pad the missing ones with three spaces each, so its text column starts where the others do.

```text
00000060  4f 50 51 52 53 54 55 56                           |OPQRSTUV|
```

That's exactly what the real `hexdump -C` prints, so you can check your program against it on any computer that has it.

## The same line again

Files often repeat: a run of zeros, a row of the same character. When a full line of 16 bytes is exactly the line before it, print a single `*` instead, and nothing more for the identical lines right after it; the next line that differs prints as usual, with its own offset:

```text
00000000  61 61 61 61 61 61 61 61  61 61 61 61 61 61 61 61  |aaaaaaaaaaaaaaaa|
*
00000030  61 61 61 61 61 61 61 61  61 62                    |aaaaaaaaab|
0000003a
```

`memcmp` compares two pieces of memory, byte for byte. The last line, if it's shorter than 16, always prints.

## What's in the file

After the dump, an empty line and a summary: the size, and how many bytes are letters, digits, spaces, newlines and anything else. Then the byte that appears most often (on a tie, the smallest), in hex, with the character itself in quotes when it's printable, and how many times:

```text
104 bytes: 74 letters, 20 digits, 3 spaces, 3 newlines, 4 other
Most common byte: 65 'e', 6 times
```

An empty file has no most common byte, so it skips that line. An array of 256 counters, one per possible byte, counts them all in one pass. The weather station's file had a tab where a space should have been.

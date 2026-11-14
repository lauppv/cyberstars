Felix drives his little sister to school every morning. The car has an old music player, and he wants to change it for a program of his own. He listens to songs, she wants her science podcast, and the two must never get mixed. Shuffle should be random, but give the same order again when they find one they like. In Java, this is a job for a generic class: one `Playlist`, written once, that keeps songs in one list and podcast episodes in another, and that a `for` loop can go through.

**How it works.** The program reads lines and answers each one at once. Here is a session as you see it in the output box when you run a finished program. Each line you type is followed by the answer:

```text
song|Blinding Lights|The Weeknd|3:20
Added to music: The Weeknd - Blinding Lights
song|Hips Don't Lie|Shakira|3:35
Added to music: Shakira - Hips Don't Lie
song|Bohemian Rhapsody|Queen|5:55
Added to music: Queen - Bohemian Rhapsody
song|Levitating|Dua Lipa|3:23
Added to music: Dua Lipa - Levitating
song|Yellow|Coldplay|4:29
Added to music: Coldplay - Yellow
episode|Why the sky is blue|Science Hour|12|28:40
Added to podcasts: Science Hour #12: Why the sky is blue
episode|Black holes|Science Hour|13|41:05
Added to podcasts: Science Hour #13: Black holes
play music
1. The Weeknd - Blinding Lights (3:20)
2. Shakira - Hips Don't Lie (3:35)
3. Queen - Bohemian Rhapsody (5:55)
4. Dua Lipa - Levitating (3:23)
5. Coldplay - Yellow (4:29)
Total 20:42
shuffle music 7
1. The Weeknd - Blinding Lights (3:20)
2. Queen - Bohemian Rhapsody (5:55)
3. Dua Lipa - Levitating (3:23)
4. Coldplay - Yellow (4:29)
5. Shakira - Hips Don't Lie (3:35)
Total 20:42
fit music 12:00
1. The Weeknd - Blinding Lights (3:20)
2. Shakira - Hips Don't Lie (3:35)
3. Dua Lipa - Levitating (3:23)
3 tracks, 10:18 of 12:00
stats
music: 5 tracks, 20:42, longest Queen - Bohemian Rhapsody
podcasts: 2 tracks, 1:09:45, longest Science Hour #13: Black holes
remove music 3
Removed Queen - Bohemian Rhapsody
play music
1. The Weeknd - Blinding Lights (3:20)
2. Shakira - Hips Don't Lie (3:35)
3. Dua Lipa - Levitating (3:23)
4. Coldplay - Yellow (4:29)
Total 14:47
quit
Bye
```

The commands:

| Command                              | What it does                                          |
| ------------------------------------ | ----------------------------------------------------- |
| `song\|title\|artist\|m:ss`          | adds a song to `music`                                |
| `episode\|title\|show\|number\|m:ss` | adds a podcast episode to `podcasts`                  |
| `play <playlist>`                    | plays a playlist in order                             |
| `shuffle <playlist> <seed>`          | plays it in a mixed order, the same for the same seed |
| `fit <playlist> <m:ss>`              | the tracks that fit in that much time                 |
| `stats`                              | numbers about both playlists                          |
| `remove <playlist> <number>`         | takes a track out                                     |
| `quit`                               | ends the program                                      |

Some words you will meet:

| Word          | What it means                                                                             |
| ------------- | ----------------------------------------------------------------------------------------- |
| track         | one song or one episode                                                                   |
| `m:ss`        | a length: minutes, a colon, and seconds below 60, like `3:20`                             |
| seed          | the number that decides a shuffled order. The same seed always gives the same order       |
| generic class | a class written once with a type parameter, like `Playlist<T>`, that works for many types |

**To try your program**, press Run, then type or paste the lines in the output box. `quit` ends the program.

Build the program one step at a time, in one `Main.java`. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests fill other playlists. Passing them finishes the project.

## Tracks

Read every line with a `Scanner` (`nextLine()`) until `quit`, and print `Bye` then.

Two kinds of track come in, one on each line, with `|` between their parts:

```text
song|Blinding Lights|The Weeknd|3:20
episode|Black holes|Science Hour|13|41:05
```

A song has a title, an artist and a length. An episode has a title, a show, a number and a length. Write an interface `Track` with what both have (the title, the length in seconds, and a label to print), and a class (or a `record`) for each kind:

```text
Added to music: The Weeknd - Blinding Lights
Added to podcasts: Science Hour #13: Black holes
```

- a line with a `|` that has none of these two shapes prints `Use song|title|artist|m:ss or episode|title|show|number|m:ss`
- a length that is not minutes, a colon and seconds below 60 prints `Not a length: 3:75`

## One class for both lists

Write `Playlist<T extends Track>`: a generic class that keeps a `List<T>`, with `add`, `remove` and `size`. Then make two of them:

```java
Playlist<Song> music = new Playlist<>("music");
Playlist<Episode> podcasts = new Playlist<>("podcasts");
```

Now the compiler won't let you put an episode in `music`: the type parameter keeps the two apart, and you don't have to check anything yourself.

A command with a playlist that is not `music` or `podcasts` prints `Playlists are music and podcasts`.

## Walk through it with for

Make `Playlist` implement `Iterable<T>`. Its `iterator()` method gives the tracks out in order, and then `for (T track : playlist)` works on it.

`play <playlist>` prints every track with a number, then the total length:

```text
play music
1. The Weeknd - Blinding Lights (3:20)
2. Shakira - Hips Don't Lie (3:35)
3. Queen - Bohemian Rhapsody (5:55)
Total 12:50
```

A length of one hour or more prints like `1:09:45`. An empty playlist prints `Nothing to play`.

## Shuffle that repeats

`shuffle <playlist> <seed>` plays the tracks in a mixed order. Only the seed decides the order (a whole number from 0 to 2147483647), so the same seed always gives the same order.

Give `Playlist` a method that gives back an `Iterator<T>` over a mixed copy of the list, made like this:

1. start with `state` equal to the seed, and copy the list
2. for each place `i`, from the last one down to 1: work out the next number, `state = (state * 1103515245 + 12345) % 2147483648`, take `j = state % (i + 1)`, and swap the tracks at `i` and `j`

Use `long` for the state, or the multiplication goes past what an `int` can hold. Then print the mixed tracks exactly like `play`.

This is how games give everyone the same "random" levels: the randomness comes from a formula and a seed.

## Will it fit the drive

The drive to school is 12 minutes. `fit <playlist> <m:ss>` goes through the tracks in order. It keeps every track that still fits in the time left, and skips the ones that don't:

```text
fit music 12:00
1. The Weeknd - Blinding Lights (3:20)
2. Shakira - Hips Don't Lie (3:35)
3. Dua Lipa - Levitating (3:23)
3 tracks, 10:18 of 12:00
```

When nothing fits, print `Nothing fits`.

## Generic methods

`stats` describes both playlists with the same two methods, written once for any kind of track:

```java
static <T extends Track> int total(Iterable<T> list)
static <T extends Track> T longest(Iterable<T> list)
```

```text
music: 5 tracks, 20:42, longest Queen - Bohemian Rhapsody
podcasts: 2 tracks, 1:09:45, longest Science Hour #13: Black holes
```

When two tracks are the longest, take the first one. For an empty playlist, leave out the `longest` part: `podcasts: 0 tracks, 0:00`. For one track, write `1 track`.

Last:

- `remove <playlist> <number>` takes a track out: `Removed Queen - Bohemian Rhapsody`. If there is no such track, print `No track 9 in music`
- a command with the wrong words prints how to use it: `Usage: play <playlist>`, `Usage: shuffle <playlist> <seed>`, `Usage: remove <playlist> <number>` or `Usage: fit <playlist> <m:ss>`
- a number that is not a number prints `Not a number: x`
- anything else prints `Unknown command: skip`

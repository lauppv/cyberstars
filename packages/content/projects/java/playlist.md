Tudor drives his little sister to school every morning, and the car has an old music player he wants to replace with a program of his own. He listens to songs, she wants her science podcast, and neither must end up in the other's list. Shuffle should be random, but the same "random" when they find an order they like. In Java, that's a job for a generic class: one `Playlist` written once that holds songs in one place and episodes in another, and that a `for` loop can walk through.

You build it one step at a time, in one `Main.java`. Tick a step off when your program does what it asks; you can always come back and untick it. When you think it's done, press **Run Tests**: the tests fill playlists your program has never seen. Passing them finishes the project.

The program reads every line with a `Scanner` (`nextLine()`) until `quit` (print `Bye`); everything it says goes through `System.out.println`.

## Tracks

Two kinds of track come in, one per line, their fields separated by `|`:

```text
song|Blinding Lights|The Weeknd|3:20
episode|Black holes|Science Hour|13|41:05
```

A song has a title, an artist and a length; an episode a title, a show, a number and a length. Write an interface `Track` with what both have, the title, the length in seconds and a label to print, and a class (or a `record`) for each kind:

```text
Added to music: The Weeknd - Blinding Lights
Added to podcasts: Science Hour #13: Black holes
```

A line with a `|` that isn't one of these shapes prints `Use song|title|artist|m:ss or episode|title|show|number|m:ss`, and a length that isn't minutes, a colon and seconds below 60 prints `Not a length: 3:75`.

## One class for both lists

Write `Playlist<T extends Track>`: a generic class that keeps a `List<T>`, with `add`, `remove` and `size`. Then make two:

```java
Playlist<Song> music = new Playlist<>("music");
Playlist<Episode> podcasts = new Playlist<>("podcasts");
```

The compiler now refuses to put an episode in `music`: the type parameter keeps the two apart without a single check of yours. Any command naming a playlist other than `music` or `podcasts` prints `Playlists are music and podcasts`.

## Walk through it with for

Make `Playlist` implement `Iterable<T>`: its `iterator()` method hands out the tracks in order, and from then on `for (T track : playlist)` works on it. `play <playlist>` numbers and prints every track, then the total length:

```text
play music
1. The Weeknd - Blinding Lights (3:20)
2. O-Zone - Dragostea din tei (3:35)
3. Queen - Bohemian Rhapsody (5:55)
Total 12:50
```

Lengths of an hour or more print as `1:09:45`. An empty playlist prints `Nothing to play`.

## Shuffle that repeats

`shuffle <playlist> <seed>` plays the tracks in a shuffled order that only the seed (a whole number from 0 to 2147483647) decides, so the same seed always gives the same order. Give `Playlist` a method that returns an `Iterator<T>` over a shuffled copy, made like this:

1. start from the seed, and copy the list
2. for each position `i` from the last down to 1: work out the next number, `state = (state * 1103515245 + 12345) % 2147483648`, take `j = state % (i + 1)`, and swap the tracks at `i` and `j`

Use `long` for the state, or the multiplication overflows. Then print the shuffled tracks exactly like `play`. That's how games keep "random" levels the same for everyone: the randomness comes from a formula and a seed.

## Will it fit the drive

The drive to school is 12 minutes. `fit <playlist> <m:ss>` goes through the tracks in order and keeps every one that still fits in the time left, skipping those that don't:

```text
fit music 12:00
1. The Weeknd - Blinding Lights (3:20)
2. O-Zone - Dragostea din tei (3:35)
3. Dua Lipa - Levitating (3:23)
3 tracks, 10:18 of 12:00
```

When nothing fits, `Nothing fits`.

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

On a tie, the longest is the first. An empty playlist leaves out the `longest` part. Finally, `remove <playlist> <number>` takes a track out, `Removed Queen - Bohemian Rhapsody`, or prints `No track 9 in music`; commands with the wrong words print their usage (`Usage: play <playlist>`, `Usage: shuffle <playlist> <seed>`, `Usage: remove <playlist> <number>`, `Usage: fit <playlist> <m:ss>`), a number that isn't one `Not a number: x`, and anything else `Unknown command: skip`.

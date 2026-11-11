On the bus to school, Julia and her friends play a word game on paper: one of them thinks of a five-letter word, the others guess, and after every guess the one who knows the word marks each letter. Right letter in the right place, right letter in the wrong place, or not in the word at all. The marking starts arguments, especially when a letter appears twice. You'll write the referee: it marks every guess by the rules, keeps the games, and keeps the score.

You build it one step at a time, in one file. Tick a step off when your program does what it asks; you can always come back and untick it. When you think it's done, press **Run Tests**: the tests referee games your program has never seen. Passing them finishes the project.

## The words and the games

The first line lists the words the friends allow. Every other line, until the input ends, is a game: the secret word, a colon, then the guesses in the order they were made:

```text
words: crane slate trace crate react apple paper llama alley level hello world speed abbey kebab
crate: crane slate crate
apple: paper alley llama level xyzzy appl apple
```

Capitals don't matter; the referee writes every word in capitals. Print how many words and games there are: `Words: 15, games: 4`.

## Mark a guess

Write a function that marks a guess against the secret word, one character per letter:

- `G` (green): the letter is in the word, in that place
- `Y` (yellow): the letter is in the word, but somewhere else
- `.`: the letter is not in the word

For the secret `CRATE`, the guess `SLATE` gets `..GGG`, and `CRANE` gets `GGG.G`.

## Letters that repeat

Here's where the arguments start. The secret `APPLE` has one `L`. The guess `LEVEL` has two: which one is yellow? The rule real games use:

1. first mark every green
2. then count the secret's letters that weren't matched green
3. then go through the guess from left to right: a letter that isn't green is yellow while that letter's count is above 0 (and takes one from it), and `.` once the count is used up

So `LEVEL` against `APPLE` is `YY...`: the first `L` takes the only `L`, the first `E` the only `E`, and the second `L` and `E` find nothing left. And `PAPER` against `APPLE` is `YYGY.`: the middle `P` is green, which leaves one `P` for the first one to be yellow. A dictionary of letter counts does it.

## A game

For each game, print an empty line and its number, then every guess with its marks, two spaces between them, until the word is found or six guesses are used. Then the result:

```text
Game 1
CRANE  GGG.G
SLATE  ..GGG
CRATE  GGGGG
Solved in 3
```

A game not found in six guesses ends with `Not solved, the word was HELLO`. Guesses written after the end don't count.

## Guesses that don't count

A guess that isn't five letters, or isn't in the list of allowed words, gets no marks and isn't one of the six:

```text
XYZZY  not a word
APPL   not a word
```

The guess is left-aligned in five characters, so the columns stay straight.

## Letters to forget

After each game, list the letters of its marked guesses that aren't anywhere in the secret word, in alphabetical order, each once:

```text
Never in the word: L, N, S
```

When there are none, print `Never in the word: nothing`. A set collects them without repeats.

## The score

After the last game, an empty line, then how many games were played, the share won (rounded with `round`), and how many games were won in each number of guesses, from 1 to 6, each with a `#` per game:

```text
Played: 4
Won: 75%
1: 0
2: # 1
3: # 1
4: 0
5: # 1
6: 0
```

A row with games has the number, a colon, a space, the `#`s, a space and the count; a row with none, only the number, a colon, a space and `0`. The arguments on the bus are over.

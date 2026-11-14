On the bus to school, Julia and her friends play a word game on paper. One of them thinks of a secret word of five letters, and the others try to guess it. After each guess, the one who knows the word marks every letter: the right letter in the right place, the right letter in the wrong place, or a letter that is not in the word. They often argue about the marks, most of all when a letter is in the word twice. You will write the referee: it marks every guess by the rules and keeps the score.

**The input** starts with one line of the words the friends allow. Every next line is one game: the secret word, a colon, then the guesses in the order they were made:

```text
words: crane slate trace crate react apple paper llama alley level hello world speed abbey kebab
crate: crane slate crate
apple: paper alley llama level xyzzy appl apple
hello: world speed crane slate trace react paper
abbey: kebab abbey
```

**The output** for this input, when the program is finished:

```text
Words: 15, games: 4

Game 1
CRANE  GGG.G
SLATE  ..GGG
CRATE  GGGGG
Solved in 3
Never in the word: L, N, S

Game 2
PAPER  YYGY.
ALLEY  GY.Y.
LLAMA  Y.Y..
LEVEL  YY...
XYZZY  not a word
APPL   not a word
APPLE  GGGGG
Solved in 5
Never in the word: M, R, V, Y

Game 3
WORLD  .Y.G.
SPEED  ..Y..
CRANE  ....Y
SLATE  .Y..Y
TRACE  ....Y
REACT  .G...
Not solved, the word was HELLO
Never in the word: A, C, D, N, P, R, S, T, W

Game 4
KEBAB  .YGYY
ABBEY  GGGGG
Solved in 2
Never in the word: K

Played: 4
Won: 75%
1: 0
2: # 1
3: # 1
4: 0
5: # 1
6: 0
```

The marks:

| Mark | What it means                                           |
| ---- | ------------------------------------------------------- |
| `G`  | green: the letter is in the word, in this place         |
| `Y`  | yellow: the letter is in the word, but in another place |
| `.`  | the letter is not in the word                           |

**To try your program**, press Run, click in the output box and paste the input. Then press **End input** under the output box (or Ctrl + D), so the program knows there are no more games.

Build the program one step at a time, in one file. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests give your program other games. Passing them finishes the project.

## The words and the games

Read the first line: the allowed words. Then read the games until the input ends: when there are no more lines, `input()` stops with an error called `EOFError`.

Small and capital letters don't matter: `Crane` and `crane` are the same word. The referee writes every word in capitals.

Print how many words and how many games there are:

```text
Words: 15, games: 4
```

## Mark a guess

Write a function that marks a guess against the secret word. It gives one character for each letter: `G`, `Y` or `.`.

For the secret word `CRATE`:

- the guess `SLATE` gets `..GGG`
- the guess `CRANE` gets `GGG.G`

## Letters that repeat

This is where the friends argue. The secret word `APPLE` has one `L`. The guess `LEVEL` has two. Which one is yellow? Real games use this rule:

1. first, mark every green letter
2. then count the letters of the secret word that are not green yet
3. then go through the guess from left to right. A letter that is not green is yellow if its count is above 0, and you take one from the count. When the count is 0, it gets `.`

So `LEVEL` against `APPLE` is `YY...`: the first `L` takes the only `L`, the first `E` takes the only `E`, and the second `L` and `E` find nothing left.

And `PAPER` against `APPLE` is `YYGY.`: the middle `P` is green, and that leaves one more `P` in `APPLE`, so the first `P` is yellow.

A dictionary that counts the letters helps here.

## A game

For each game, print an empty line and `Game` with its number. Then print every guess and its marks, with two spaces between them, until the word is found or six guesses are used. Then the result:

```text
Game 1
CRANE  GGG.G
SLATE  ..GGG
CRATE  GGGGG
Solved in 3
```

When the word is not found in six guesses, the game ends with `Not solved, the word was HELLO`. Guesses after the end of a game don't count.

## Guesses that don't count

A guess that doesn't have five letters, or that isn't in the list of allowed words, gets no marks and is not one of the six:

```text
XYZZY  not a word
APPL   not a word
```

The guess is left-aligned in five characters, so the columns stay straight.

## Letters to forget

After each game, list the letters of its marked guesses that are not in the secret word at all. Sort them from A to Z, and write each one only once:

```text
Never in the word: L, N, S
```

When there are none, print `Never in the word: nothing`. A set keeps each letter only once.

## The score

After the last game, print an empty line, then:

- `Played:` and how many games were played
- `Won:` and the percent of games won, rounded with `round`
- one line for each number of guesses, from 1 to 6, with how many games were won with that many guesses

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

A line with games has the number, a colon, a space, one `#` for each game, a space and the count: three games won in 4 guesses would be `4: ### 3`. A line with no games has only the number, a colon, a space and `0`. Now nobody argues on the bus.

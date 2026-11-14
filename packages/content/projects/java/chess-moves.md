The chess club at the town's culture house teaches kids on Saturday mornings, and the kids always ask the same thing: "Can my bishop go there?" The coach wants a small program where they can try moves. It must know how every piece moves, say no to a wrong move and tell why, say when a king is attacked, and know when the game is over. In Java, each kind of piece can be a class that knows its own moves.

**How it works.** The program first reads a board, then moves, and answers each move at once. Here is a session as you see it in the output box when you run a finished program. The lines you type are followed by the program's answers:

```text
rnbqkbnr
pppppppp
........
........
........
........
PPPPPPPP
RNBQKBNR
8 r n b q k b n r
7 p p p p p p p p
6 . . . . . . . .
5 . . . . . . . .
4 . . . . . . . .
3 . . . . . . . .
2 P P P P P P P P
1 R N B Q K B N R
  a b c d e f g h
e2 e4
1. White pawn e2-e4
e7 e5
1... Black pawn e7-e5
f1 c4
2. White bishop f1-c4
b8 c6
2... Black knight b8-c6
d1 h5
3. White queen d1-h5
g8 f6
3... Black knight g8-f6
h5 f7
4. White queen h5-f7, takes pawn, checkmate! White wins
8 r . b q k b . r
7 p p p p . Q p p
6 . . n . . n . .
5 . . . . p . . .
4 . . B . P . . .
3 . . . . . . . .
2 P P P P . P P P
1 R N B . K . N R
  a b c d e f g h
```

That is the mate in four moves that every beginner falls for once.

The letters of the board:

| Letter | Piece           | How it moves                                                                     |
| ------ | --------------- | -------------------------------------------------------------------------------- |
| `K`    | king            | one square in any direction                                                      |
| `Q`    | queen           | like a rook or a bishop                                                          |
| `R`    | rook            | any number of squares in a straight line: across, or up and down                 |
| `B`    | bishop          | any number of squares on a diagonal                                              |
| `N`    | knight          | in an L: two squares one way and one square the other way, jumping over anything |
| `P`    | pawn            | forward, with special rules (see the step Pawns)                                 |
| `.`    | an empty square |                                                                                  |

Capital letters are White's pieces, small letters are Black's.

Some words you will meet:

| Word      | What it means                                                                |
| --------- | ---------------------------------------------------------------------------- |
| rank      | a row of the board, numbered 1 to 8 from White's side                        |
| file      | a column of the board, from `a` to `h`                                       |
| check     | a king is attacked: a piece of the other side could take it on the next move |
| checkmate | the king is in check and its side has no move to save it: the game is lost   |
| stalemate | the side to move is not in check but has no move at all: the game is a draw  |

**To try your program**, press Run, paste the board in the output box, then type moves like `e2 e4`. The program stops by itself when the game ends, or when you type `quit`.

Build the program one step at a time, in one `Main.java`. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests play other games. Passing them finishes the project.

## The board

Read every line with a `Scanner` (`nextLine()`) and split it into words. The input starts with the board: 8 lines, from rank 8 (Black's side) down to rank 1, with one character for each square.

Print the board with the rank numbers on the left and the file letters under it, and a space between squares:

```text
8 r n b q k b n r
7 p p p p p p p p
6 . . . . . . . .
5 . . . . . . . .
4 . . . . . . . .
3 . . . . . . . .
2 P P P P P P P P
1 R N B Q K B N R
  a b c d e f g h
```

`board` prints it again at any time. A square's name is its file and its rank, like `e2`. In your array, rank 8 is row 0, and file `a` is column 0.

## Pieces are classes

Write an abstract class `Piece`. It knows its colour, its letter and its name, and has one abstract method: can the piece move from one square to another on this board? Then write a class for each kind of piece: `King`, `Queen`, `Rook`, `Bishop`, `Knight` and `Pawn`. Each one writes that method its own way, following the table above.

Keep the board as a `Piece[8][8]`, with `null` for an empty square, and make each piece from its letter.

## Moves and turns

Every next line, until `quit` (print `Bye`), is a move, like `e2 e4`. White moves first, then each side moves in turn. Print a move that works with its number, and with `...` after the number for Black's moves:

```text
1. White pawn e2-e4
1... Black pawn e7-e5
```

Say no to a move, and the same player moves again, when:

| Answer                              | When                                      |
| ----------------------------------- | ----------------------------------------- |
| `Not a square: e9`                  | a square is not on the board              |
| `No piece on e3`                    | there is no piece on the first square     |
| `It's White's turn`                 | the piece is the other side's             |
| `Can't take your own pawn`          | the second square has a piece of your own |
| `A bishop can't move from f1 to f3` | the piece doesn't move that way           |

Check them in this order. A line that is not two words prints `Usage: <from> <to>, like e2 e4`.

## Nothing in the way

Rooks, bishops and queens slide: every square between the start and the end must be empty. Write this only once: a helper that goes from one square towards the other one step at a time. Use it in the three classes.

Taking a piece on the end square is fine, and the line says it: `4. White queen h5-f7, takes pawn`.

`captured` lists what each side has taken so far, in order:

```text
White took: pawn
Black took: nothing
```

## Pawns

Pawns have their own rules:

- a pawn moves one square forward to an empty square. Forward is up the board for White and down for Black
- from its first rank (rank 2 for White, 7 for Black), it can also move two squares, when both are empty
- it takes a piece only on a diagonal, one square forward
- a pawn that gets to the last rank becomes a queen, and the line ends with `, becomes a queen`

## Check

A move must never leave your own king attacked. Make the move on the board, then look if any piece of the other side could move to your king's square. If one could, put everything back and say no: `That leaves your king in check`. A pawn attacks only on its diagonals, so for this question don't use its normal move.

When a move attacks the other side's king, the line ends with `, check!`.

## The end of the game

After every move, look if the other side has any legal move at all: any piece, to any square, that its class allows and that doesn't leave its king in check. If it has none, the game is over. The line says how, then the program prints the last board and stops:

- in check, with no move: `, checkmate! White wins`
- not in check, but with no move: `, stalemate! It's a draw`

```text
4. White queen h5-f7, takes pawn, checkmate! White wins
```

Now the kids at the club can see it on the board, square by square.

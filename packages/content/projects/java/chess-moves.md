The chess club at the culture house teaches kids on Saturday mornings, and the kids keep asking the same question: "can my bishop go there?" The coach wants a small program they can try moves on, one that knows how every piece moves, refuses an illegal move and says why, announces check, and knows when the game is over. In Java, each kind of piece can be a class that knows its own moves.

You build it one step at a time, in one `Main.java`. Tick a step off when your program does what it asks; you can always come back and untick it. When you think it's done, press **Run Tests**: the tests play games your program has never seen. Passing them finishes the project.

The program reads every line with a `Scanner` (`nextLine()`) and splits it into words; everything it says goes through `System.out.println`.

## The board

The input starts with the board, 8 lines from rank 8 (Black's side) down to rank 1, one character per square: `K` king, `Q` queen, `R` rook, `B` bishop, `N` knight, `P` pawn, capitals for White and small letters for Black, `.` for an empty square.

```text
rnbqkbnr
pppppppp
........
........
........
........
PPPPPPPP
RNBQKBNR
```

Print it with the ranks on the left and the files under it, squares separated by spaces:

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

`board` prints it again at any time. A square is named by its file and rank, `e2`; in the array, rank 8 is row 0 and file `a` column 0.

## Pieces are classes

Write an abstract class `Piece` that knows its colour, its letter and its name, with one abstract method: whether it may move from one square to another on this board. Then a class for each kind, `King`, `Queen`, `Rook`, `Bishop`, `Knight` and `Pawn`, each writing that method its own way. Keep the board as a `Piece[8][8]`, `null` for an empty square, and build each piece from its letter.

- the king goes one square in any direction
- the rook any distance in a straight line, across or up and down
- the bishop any distance diagonally
- the queen like a rook or a bishop
- the knight in an L: two squares one way and one the other, jumping over anything

## Moves and turns

Every other line, until `quit` (print `Bye`), is a move, like `e2 e4`. White moves first, then the sides take turns. A move that goes through is printed with its number, `...` after the number for Black's moves:

```text
1. White pawn e2-e4
1... Black pawn e7-e5
```

Refuse a move, and keep the same player's turn, when:

- a square isn't on the board: `Not a square: e9`
- there's no piece on the first square: `No piece on e3`
- the piece is the other side's: `It's White's turn`
- the second square holds a piece of your own: `Can't take your own pawn`
- the piece doesn't move that way: `A bishop can't move from f1 to f3`

Checked in that order. A line that isn't two words prints `Usage: <from> <to>, like e2 e4`.

## Nothing in the way

Rooks, bishops and queens slide: every square between the start and the end must be empty. Write it once, a helper that walks from one square towards the other a step at a time, and use it in the three classes. Taking a piece on the end square is fine, and the line says so: `4. White queen h5-f7, takes pawn`. `captured` lists what each side has taken so far, in order:

```text
White took: pawn
Black took: nothing
```

## Pawns

Pawns are the odd ones. A pawn moves one square forward (up the board for White, down for Black) to an empty square, or two from its starting rank (rank 2 for White, 7 for Black) when both squares are empty. It takes only diagonally, one square forward. And a pawn that reaches the last rank becomes a queen: `, becomes a queen`.

## Check

A move must never leave your own king attacked. After making a move on the board, look whether any of the other side's pieces could move to your king's square; if one could, put everything back and refuse: `That leaves your king in check`. (A pawn attacks only diagonally, so don't ask it its usual question.)

And when a move attacks the other king, announce it: `, check!` at the end of the line.

## The end of the game

After every move, look whether the other side has any legal move at all: any piece, to any square, that its class allows and that doesn't leave its king in check. If it has none, the game is over, and the line says how, then the final board is printed and the program stops:

- in check with no move: `, checkmate! White wins`
- not in check, but no move: `, stalemate! It's a draw`

```text
4. White queen h5-f7, takes pawn, checkmate! White wins
```

That's the four-move mate every beginner falls for once. The kids at the club will see it on the board now, square by square.

The library on Maple Street still runs its front desk from a paper notebook. You'll replace it with a program the librarian types commands into: it knows every book on the shelves, who borrowed what, when it is due back and who owes a late fee.

You build it one step at a time, in one file. Every step adds a command or a rule, and the commands from earlier steps keep working. Tick a step off when your program does everything it asks; you can always come back and untick it.

Everything the program reads comes from `input()`, and everything it says goes through `print()`. Run it, then type the lines of an example yourself to see what it answers.

## Load the catalog

The program starts by reading the catalog. The first line is how many books there are, then comes one line per book, four fields separated by `|`:

```text
3
B01|Dune|Frank Herbert|2
B02|Emma|Jane Austen|1
B03|Matilda|Roald Dahl|3
```

The fields are the book's ID, its title, its author and how many copies the library owns. Keep each book somewhere you can find it by its ID, since every later command names books that way.

Once the catalog is in, print `Loaded 3 books` (with the real number). Then keep reading commands, one per line, until the librarian types `quit`, and print `Goodbye` then. For now every command but `quit` can be ignored.

```text
Loaded 3 books
Goodbye
```

## List the books

`list` prints every book, sorted by title, one per line: its ID, its title, its author, and how many copies are on the shelf out of how many the library owns.

```text
B01 | Dune by Frank Herbert | 2 of 2 on the shelf
B02 | Emma by Jane Austen | 1 of 1 on the shelf
B03 | Matilda by Roald Dahl | 3 of 3 on the shelf
```

Nothing is borrowed yet, so every copy is on the shelf. Keep the two numbers apart anyway: from the next steps on they differ.

## Search the catalog

`find <word>` prints the books whose title or author contains the word, sorted by title, in the same format as `list`. Capitals don't matter: `find DAHL`, `find dahl` and `find Dahl` find the same books.

```text
find an
B01 | Dune by Frank Herbert | 2 of 2 on the shelf
B02 | Emma by Jane Austen | 1 of 1 on the shelf
```

`an` is in Fr**an**k and J**an**e, so two books match. When nothing matches, print `No books match "an"` with the word as it was typed.

## Borrow a book

`borrow <member> <id> <day>` lends one copy of a book. Members are named by one word, and the library opens a member's card the first time they borrow. Days are numbers, counted from the day the library opened; a book is due back 14 days after it was borrowed.

```text
borrow Ana B01 3
Ana borrowed "Dune", due on day 17
```

Refuse the loan, and change nothing, when:

- there is no book with that ID: `No book with ID B09`
- no copy is left on the shelf: `No copies of "Emma" left`
- the member already has that book: `Ana already has "Dune"`
- the member already has 3 books: `Ana already has 3 books`

Check them in that order and print only the first one that applies.

## Return a book

`return <member> <id> <day>` brings a copy back to the shelf.

```text
return Ana B01 10
Ana returned "Dune"
```

When the book doesn't exist, print the same `No book with ID B09` as `borrow`. When the member doesn't have it, print `Ana does not have "Dune"` and change nothing.

## Late fees

A book returned after its due day costs 0.50 for every day late. Add the fee to what the member owes and say it when the book comes back, with two decimals:

```text
borrow Ana B01 3
Ana borrowed "Dune", due on day 17
return Ana B01 20
Ana returned "Dune" 3 days late, fee 1.50
```

A single day late reads `1 day late`. A book returned on its due day or before is on time and prints the line from the previous step. A member who owes more than 5.00 can't borrow until they pay; check it before every other rule of `borrow`:

```text
Ana owes 6.00, pay first
```

`pay <member> <amount>` takes a payment and prints what is still owed: `Ana paid 2.00, owes 4.00`. Nobody can pay more than they owe: then print `Ana owes only 4.00` and take nothing. A name that never borrowed anything prints `No member named Bob`.

## Member card

`member <name>` shows what a member has, their loans sorted by due day:

```text
member Ana
Member: Ana
Loans: 2
- Dune, due on day 17
- Matilda, due on day 21
Owes: 1.50
```

A member with no loans shows `Loans: 0` and no lines under it. A name that never borrowed anything prints `No member named Bob`.

## End-of-day report

`report <day>` is what the librarian reads before closing:

```text
report 20
Report for day 20
Books out: 3
Overdue: Ana - Dune (3 days)
Overdue: Leo - Emma (1 day)
Most borrowed: Dune (4 times)
Fees owed: 7.50
```

- **Books out** counts the copies not on the shelf.
- **Overdue** lists every loan whose due day is before the report's day, sorted by member and then by title; with none, print `Overdue: none`. Mind `1 day` against `3 days`.
- **Most borrowed** counts every `borrow` that went through since the start. On a tie, take the title that comes first alphabetically. Before any loan, print `Most borrowed: none`, and say `1 time` for a single loan.
- **Fees owed** adds up what all members still owe.

## Survive bad input

A real librarian makes typos. Your program must never stop with an error, whatever is typed:

- an empty line is skipped, with nothing printed
- a command it doesn't know prints `Unknown command: borow`
- a known command with the wrong number of words prints how to use it, such as `Usage: borrow <member> <id> <day>`; the other commands use `Usage: find <word>`, `Usage: return <member> <id> <day>`, `Usage: pay <member> <amount>`, `Usage: member <name>` and `Usage: report <day>`
- a day that isn't a whole number, or an amount that isn't a number, prints the same usage line

Use `try` / `except` where a conversion can fail, rather than checking every character yourself.

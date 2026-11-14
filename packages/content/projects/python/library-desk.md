The library on Maple Street still writes everything in a paper notebook. You will write the program for its front desk. The librarian types commands into it, and it knows every book in the library, who borrowed what, when each book must come back, and who has to pay for a late book.

**How it works.** First the program reads the catalog: the list of all the books. Then the librarian types one command on each line, and the program answers each one, until the command `quit`.

Here is a short visit to the desk, as you see it in the output box when you run a finished program. The lines you type and the program's answers come one after the other:

```text
3
B01|Dune|Frank Herbert|2
B02|Emma|Jane Austen|1
B03|Matilda|Roald Dahl|3
Loaded 3 books
borrow Ida B01 3
Ida borrowed "Dune", due on day 17
borrow Leo B02 4
Leo borrowed "Emma", due on day 18
borrow Ida B02 5
No copies of "Emma" left
borrow Ida B03 6
Ida borrowed "Matilda", due on day 20
list
B01 | Dune by Frank Herbert | 1 of 2 on the shelf
B02 | Emma by Jane Austen | 0 of 1 on the shelf
B03 | Matilda by Roald Dahl | 2 of 3 on the shelf
return Ida B01 10
Ida returned "Dune"
member Ida
Member: Ida
Loans: 1
- Matilda, due on day 20
Owes: 0.00
quit
Goodbye
```

The commands, all together:

| Command                      | What it does                                              |
| ---------------------------- | --------------------------------------------------------- |
| `list`                       | shows every book                                          |
| `find <word>`                | shows the books with that word in the title or the author |
| `borrow <member> <id> <day>` | a member takes a book home                                |
| `return <member> <id> <day>` | a member brings a book back                               |
| `pay <member> <amount>`      | a member pays money they owe                              |
| `member <name>`              | shows a member's books and what they owe                  |
| `report <day>`               | the report the librarian reads at the end of the day      |
| `quit`                       | ends the program                                          |

Days are numbers: day 1 is the day the library opened, day 2 the next day, and so on. A member is a person with a library card, named by one word.

**To try your program**, press Run and type the lines in the output box, or paste several at once. It stops by itself at `quit`.

Build the program one step at a time, in one file. Each step adds a command or a rule, and the commands from earlier steps keep working. Tick a step when your program does what it asks. When you think it is finished, press **Run Tests**: the tests play a whole day at the library. Passing them finishes the project.

## Load the catalog

The first line is how many books there are. Then comes one line for each book, with four parts separated by `|`:

```text
3
B01|Dune|Frank Herbert|2
B02|Emma|Jane Austen|1
B03|Matilda|Roald Dahl|3
```

The parts are the book's ID, its title, its author and how many copies the library has. Every command names a book by its ID, so keep the books in a dictionary with the ID as the key.

When the catalog is read, print `Loaded 3 books` (with the real number). Then read commands, one on each line, until the librarian types `quit`, and print `Goodbye` then. For now, do nothing for the other commands.

```text
Loaded 3 books
Goodbye
```

## List the books

`list` prints every book, sorted by title, one on each line: its ID, its title, its author, and how many copies are on the shelf out of how many the library has:

```text
B01 | Dune by Frank Herbert | 2 of 2 on the shelf
B02 | Emma by Jane Austen | 1 of 1 on the shelf
B03 | Matilda by Roald Dahl | 3 of 3 on the shelf
```

Nobody has borrowed a book yet, so every copy is on the shelf. But keep the two numbers apart: from the next steps on they are different.

## Search the catalog

`find <word>` prints the books whose title or author has the word in it, sorted by title, in the same form as `list`. Small and capital letters don't matter: `find DAHL`, `find dahl` and `find Dahl` find the same books.

```text
find an
B01 | Dune by Frank Herbert | 2 of 2 on the shelf
B02 | Emma by Jane Austen | 1 of 1 on the shelf
```

`an` is in Fr**an**k and J**an**e, so two books match. When no book matches, print `No books match "an"`, with the word as it was typed.

## Borrow a book

`borrow <member> <id> <day>` gives one copy of a book to a member. A member gets a card the first time they borrow. A book must come back 14 days after the day it was borrowed: that is its due day.

```text
borrow Ida B01 3
Ida borrowed "Dune", due on day 17
```

Say no, and change nothing, when:

- there is no book with that ID: `No book with ID B09`
- no copy is left on the shelf: `No copies of "Emma" left`
- the member already has that book: `Ida already has "Dune"`
- the member already has 3 books: `Ida already has 3 books`

Check them in this order and print only the first one that is true.

## Return a book

`return <member> <id> <day>` puts a copy back on the shelf:

```text
return Ida B01 10
Ida returned "Dune"
```

When there is no book with that ID, print `No book with ID B09`, as `borrow` does. When the member doesn't have the book, print `Ida does not have "Dune"` and change nothing.

## Late fees

A book that comes back after its due day costs 0.50 for each day late. This money is the fee. Add it to what the member owes, and say it when the book comes back, with two digits after the point:

```text
borrow Ida B01 3
Ida borrowed "Dune", due on day 17
return Ida B01 20
Ida returned "Dune" 3 days late, fee 1.50
```

For one day, write `1 day late`. A book that comes back on its due day or before is on time, and prints the line from the last step.

A member who owes more than 5.00 can't borrow until they pay. Check this before all the other rules of `borrow`:

```text
Ida owes 6.00, pay first
```

`pay <member> <amount>` takes money and prints what the member still owes: `Ida paid 2.00, owes 4.00`. Nobody can pay more than they owe: then print `Ida owes only 4.00` and take nothing. For a name that never borrowed a book, print `No member named Bob`.

## Member card

`member <name>` shows what a member has. Their books are sorted by due day:

```text
member Ida
Member: Ida
Loans: 2
- Dune, due on day 17
- Matilda, due on day 21
Owes: 1.50
```

A member with no books shows `Loans: 0` and no lines under it. For a name that never borrowed a book, print `No member named Bob`.

## End-of-day report

`report <day>` is what the librarian reads before the library closes:

```text
report 20
Report for day 20
Books out: 3
Overdue: Ida - Dune (3 days)
Overdue: Leo - Emma (1 day)
Most borrowed: Dune (4 times)
Fees owed: 7.50
```

- **Books out**: how many copies are not on the shelf
- **Overdue**: one line for each book that is late, that is, its due day is before the report's day. Sort them by member, then by title. With no late books, print `Overdue: none`. Write `1 day` for one and `3 days` for more
- **Most borrowed**: the book borrowed most times since the start, counting every `borrow` that worked. If two books are equal, take the title that comes first from A to Z. Before any book is borrowed, print `Most borrowed: none`. Write `1 time` for one
- **Fees owed**: all the money that all members still owe

## Survive bad input

A real librarian makes mistakes when typing. Your program must never stop with an error, whatever is typed:

- an empty line: print nothing and go on
- a command the program doesn't know: `Unknown command: borow`
- a known command with the wrong number of words: print how to use it, like `Usage: borrow <member> <id> <day>`. The other commands use `Usage: find <word>`, `Usage: return <member> <id> <day>`, `Usage: pay <member> <amount>`, `Usage: member <name>` and `Usage: report <day>`
- a day that is not a whole number, or an amount that is not a number: print the same `Usage:` line

Use `try` / `except` around a conversion that can fail, like `int(day)`, instead of checking every character yourself.

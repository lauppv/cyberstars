A project that uses the C part of the course: structs, a linked list, qsort with a compare function, strings, and files. You will build the catalog of the computing center's tape library, the shelf of manuals and reports that operators borrow

There is no code to copy here, only a plan. Take it one command at a time, and test each one before the next

---

**The plan**

Each book is a node of a linked list

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct book {
    int id;
    char title[32];
    int year;
    int out;
    struct book *next;
};

int main(void) {
    struct book *b = malloc(sizeof(struct book));
    b->id = 7;
    strcpy(b->title, "PayrollManual");
    b->year = 1969;
    b->out = 0;
    b->next = NULL;

    printf("%d %s %d %d\n", b->id, b->title, b->year, b->out);
    free(b);
    return 0;
}
```

Output

```text
7 PayrollManual 1969 0
```

out is 1 while someone has borrowed the book. You'll want a few small functions

- **find**: walk the list and return the node with an id, or NULL
- **add**: make a node with malloc and put it at the front, or at the end
- **remove**: take a node out and free it, like in the Linked List lessons
- **clear**: free every node

---

list needs the books sorted, but the list itself can stay in any order. Build an array of pointers to the nodes, sort that array with qsort, and print from it. The compare function gets pointers to array cells, and each cell is a `struct book *`, so it's a pointer to a pointer

```text
int by_year(const void *a, const void *b) {
    const struct book *x = *(struct book *const *)a;
    const struct book *y = *(struct book *const *)b;
    // compare x->year, then x->title, then x->id
}
```

---

save and load keep the catalog in a text file, one book per line, with fprintf and fscanf from the File I/O lesson. load replaces the whole catalog with what's in the file: clear the list first

---

## Mission: The Library Catalog

1. Read commands, one per line, until the input ends, and answer them
   - `add id title year`: add a book. If the id is taken, print `Book id already exists`
   - `remove id`: remove the book. If there's no such book, print `No book id`
   - `borrow id`: mark it as out. Print `No book id`, or `Book id is already out`
   - `return id`: mark it as back. Print `No book id`, or `Book id is not out`
   - `list`: print every book as `id year title`, with ` (out)` after the ones that are out, sorted by year, then by title, then by id. Print `Empty catalog` when there are no books
   - `save file`: write the catalog into the file
   - `load file`: replace the catalog with the one in the file. If the file can't be opened, print `Cannot open ` and the file's name, and keep the catalog
2. Keep the books in a linked list, and sort with qsort for list
3. Free every node before the program ends

Titles are one word of at most 30 characters. Ids are from 1 to 9999, years from 1900 to 2099. There are at most 300 commands

**Example**

Input

```text
add 7 PayrollManual 1969
add 3 OrbitTables 1962
add 9 CensusReport 1969
add 3 Duplicate 1970
borrow 9
borrow 9
save shelf.txt
remove 7
list
load shelf.txt
return 3
list
```

Output

```text
Book 3 already exists
Book 9 is already out
3 1962 OrbitTables
9 1969 CensusReport (out)
Book 3 is not out
3 1962 OrbitTables
9 1969 CensusReport (out)
7 1969 PayrollManual
```

The file keeps which books are out, so after load, book 9 is still out

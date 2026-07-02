Combine **pointer arithmetic**, **string functions**, and **structs with pointers**

---

## Mission: Rebuilding the Internal Directory

The computing center's internal phone directory crashed on disk and must be rebuilt from scratch, from a backup tape. Build the lookup system using structs and pointer arithmetic.

1. Define a struct **Contact** with fields **name** (char array) and **phone** (char array)
2. Write **void add_contact(Contact \*book, int \*count, const char \*name, const char \*phone)** — adds a contact at position **\*count** and increments the counter. Use **strcpy** to copy the strings
3. Write **void find_contact(Contact \*book, int count, const char \*query)** — walks the contacts using **pointer arithmetic** (`(book + i)->name`). If found, print **"Found: name - phone"**. If not found, print **"Not found: query"**
4. Read from input: a count **n** of contacts, followed by **n** lines with **name phone**. Then read a count **q** of queries, followed by **q** lines with the searched name

**Example**

Input

```text
3
op7 0722111222
op12 0733222333
op9 0744333444
2
op12
op5
```

Output

```text
Found: op12 - 0733222333
Not found: op5
```

**Example**

Input

```text
2
shift1 0711000111
shift2 0722000222
3
shift2
shift9
shift1
```

Output

```text
Found: shift2 - 0722000222
Not found: shift9
Found: shift1 - 0711000111
```

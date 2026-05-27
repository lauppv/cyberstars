Combine **pointer arithmetic**, **string functions**, and **structs with pointers**

---

Build a **contact book**. Define a struct **Contact** with **name** (char array) and **phone** (char array)

Write these functions:

**void addContact(Contact \*book, int \*count, const char \*name, const char \*phone)** — adds a contact to the array at position **\*count** and increments the counter through the pointer. Use **strcpy** to copy strings

**void searchContact(Contact \*book, int count, const char \*query)** — loops through the contacts using **pointer arithmetic** (use `(book + i)->name` instead of `book[i].name`). If a contact's name matches the query (use **strcmp**), print it. If not found, print **"Not found"**

In main, create a Contact array of size 10. Add these contacts:

- "Tommy", "0722111222"
- "Lance", "0733222333"
- "Ken", "0744333444"

Search for "Lance" and "Diaz"

Expected output

```text
Found: Lance - 0733222333
Not found: Diaz
```

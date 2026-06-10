Combine **pointer arithmetic**, **string functions**, and **structs with pointers**

---

## Mission: Crew Directory Lookup

The station's crew directory crashed and needs to be rebuilt from scratch. Cortez has the backup data for three crew members. Build the lookup system using structs and pointer arithmetic.

The data is already on the right. Do the following, in order:

1. Write **void add_contact(Contact *book, int *count, const char *name, const char *phone)** — adds a contact at position **\*count** and increments the counter. Use **strcpy** to copy strings
2. Write **void search_contact(Contact *book, int count, const char *query)** — loops through contacts using **pointer arithmetic** (`(book + i)->name`). If found, print **"Found: name - phone"**. If not found, print **"Not found: query"**
3. Add these crew members: Tommy (0722111222), Lance (0733222333), Ken (0744333444)
4. Search for "Lance" and "Diaz"

**Output**

```text
Found: Lance - 0733222333
Not found: Diaz
```

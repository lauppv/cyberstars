Programs need to read and write **files** — configurations, shift logs, saved data. C gives us **fopen**, **fclose**, **fprintf**, **fscanf**, and **fgets** for this

```c
#include <stdio.h>

int main(void) {
    FILE *f = fopen("hello.txt", "w");
    if (f == NULL) {
        printf("Could not open file\n");
        return 1;
    }

    fprintf(f, "Hello from the terminal\n");
    fprintf(f, "This is line 2\n");
    fclose(f);

    printf("File written!\n");
    return 0;
}
```

**fopen** opens a file and returns a **FILE pointer**. The second argument is the **mode**:

- **"w"** — write (creates the file, or **overwrites** it if it exists)
- **"r"** — read (file must exist)
- **"a"** — append (adds to the end, doesn't erase)

**fprintf** works exactly like **printf**, but writes to a file instead of the screen. **fclose** closes the file — always do this, or data might not be saved

---

Reading from a file

```c
#include <stdio.h>

int main(void) {
    FILE *f = fopen("hello.txt", "r");
    if (f == NULL) {
        printf("File not found\n");
        return 1;
    }

    char line[100];
    while (fgets(line, 100, f) != NULL) {
        printf("%s", line);
    }

    fclose(f);
    return 0;
}
```

**fgets(line, 100, f)** reads one line (up to 99 characters + '\0') from the file into the **line** array. It returns **NULL** when there are no more lines. The while loop reads the entire file, line by line

---

We can also use **fscanf** for structured data

```c
#include <stdio.h>

int main(void) {
    FILE *f = fopen("log.txt", "r");
    char name[50];
    int code;

    while (fscanf(f, "%s %d", name, &code) == 2) {
        printf("%s reported code %d\n", name, code);
    }
    fclose(f);
    return 0;
}
```

**fscanf** returns the number of items it successfully read. When we expect 2 items (name and code), we check **== 2**

---

The pattern for safe file operations is always the same:

1. **fopen** — open the file
2. **Check for NULL** — handle the error
3. **Read or write** — do your work
4. **fclose** — close the file

Forgetting **fclose** is like leaving the tap running. The program might work fine for a while, but eventually you'll run out of file descriptors (a limited operating system resource)

---

## Mission: Computing center shift log

The computing center keeps a log of every shift: the on-duty technician's name and the number of incidents they resolved. At the end of the shift, the log must be written to disk, then read back for the morning report.

1. Open a file **"shift.txt"** for **writing**
2. Write these 3 lines with **fprintf**: `Enescu 95`, `Vlad 82`, `Dobre 98` (name and incident count, separated by a space)
3. Close the file
4. Open **"shift.txt"** for **reading**
5. Read each name and count using **fscanf** and print them as: **"Technician: Enescu, Incidents: 95"**
6. Close the file

**Example**

Your program should print

```text
Technician: Enescu, Incidents: 95
Technician: Vlad, Incidents: 82
Technician: Dobre, Incidents: 98
```

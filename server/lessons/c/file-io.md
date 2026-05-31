Programs need to read and write **files** — configurations, logs, saved data. C gives us **fopen**, **fclose**, **fprintf**, **fscanf**, and **fgets** for this

```c
#include <stdio.h>

int main(void) {
    FILE *f = fopen("hello.txt", "w");
    if (f == NULL) {
        printf("Could not open file\n");
        return 1;
    }

    fprintf(f, "Hello, CyberStars!\n");
    fprintf(f, "This is line 2\n");
    fclose(f);

    printf("File written!\n");
    return 0;
}
```

**fopen** opens a file and returns a **FILE pointer**. The second argument is the **mode**:

- **"w"** — write (creates the file, or **overwrites** if it exists)
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

**fgets(line, 100, f)** reads one line (up to 99 chars + '\0') from the file into the **line** array. It returns **NULL** when there are no more lines. The while loop reads the entire file, line by line

---

We can also use **fscanf** for structured data

```c
#include <stdio.h>

int main(void) {
    FILE *f = fopen("scores.txt", "r");
    char name[50];
    int score;

    while (fscanf(f, "%s %d", name, &score) == 2) {
        printf("%s got %d points\n", name, score);
    }
    fclose(f);
    return 0;
}
```

**fscanf** returns the number of items it successfully read. When we expect 2 items (name and score), we check **== 2**

---

The pattern for safe file operations is always the same:

1. **fopen** — open the file
2. **Check for NULL** — handle the error
3. **Read or write** — do your work
4. **fclose** — close the file

Forgetting **fclose** is like leaving the water running. The program might work fine for a while, but eventually you'll run out of file descriptors (a limited OS resource)

---

## Mission: Crew Log Archive

The station needs a permanent crew log. Write crew names and scores to a file, then read the file back and display a formatted report for the captain.

1. Open a file **"grades.txt"** for **writing**
2. Write these 3 lines (use **fprintf**):

```text
Tommy 95
Lance 82
Cortez 98
```

3. Close the file
4. Open **"grades.txt"** for **reading**
5. Read each name and grade using **fscanf**, and print them as: **"Name: Tommy, Grade: 95"**
6. Close the file

**Example**

Your program should print

```text
Name: Tommy, Grade: 95
Name: Lance, Grade: 82
Name: Cortez, Grade: 98
```

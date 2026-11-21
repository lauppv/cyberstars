A directory is a special file that holds a list of names. Each name points to a file, or to another directory. To read that list, we open the directory with **opendir**, take the names one by one with **readdir**, and close it with **closedir**. They come from dirent.h

```c
#include <stdio.h>
#include <string.h>
#include <dirent.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

int main(void) {
    mkdir("box", 0755);
    close(open("box/a.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644));

    DIR *dir = opendir("box");
    if (dir == NULL) {
        return 1;
    }
    struct dirent *entry;
    while ((entry = readdir(dir)) != NULL) {
        printf("%s\n", entry->d_name);
    }
    closedir(dir);
    return 0;
}
```

Every call to readdir returns a pointer to the next entry, and NULL when there are no more. The entry's name is in `d_name`. Here it prints three names, a.txt, `.` and `..`, in some order

---

Two things surprise everyone

1. Every directory holds two extra names: `.` is the directory itself, and `..` is the one above it. When we want only the real content, we skip them with strcmp
2. The order is not alphabetical, and not the order we made the files in. It's whatever order the file system keeps them in. If we want a sorted list, we collect the names and sort them ourselves, with qsort

---

**mkdir** makes a new directory, with permissions like open's. 0755 lets everyone enter it and read it, but only us change it. If the directory already exists, mkdir fails with EEXIST, which is often fine: we wanted it to be there, and it is

```c
#include <stdio.h>
#include <errno.h>
#include <sys/stat.h>

int main(void) {
    if (mkdir("box", 0755) == -1 && errno != EEXIST) {
        perror("mkdir box");
        return 1;
    }
    printf("box is there\n");
    return 0;
}
```

Output

```text
box is there
```

**rmdir** removes a directory, but only an empty one. To remove a directory full of files, we first unlink each file inside it

---

readdir gives us only the name, like a.txt, not the path box/a.txt. To open the file or stat it, we build the full path: the directory, a `/`, and the name

```c
#include <stdio.h>
#include <string.h>
#include <dirent.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

int main(void) {
    mkdir("box", 0755);
    close(open("box/a.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644));

    DIR *dir = opendir("box");
    if (dir == NULL) {
        return 1;
    }
    struct dirent *entry;
    while ((entry = readdir(dir)) != NULL) {
        if (strcmp(entry->d_name, ".") == 0 || strcmp(entry->d_name, "..") == 0) {
            continue;
        }
        char path[300];
        strcpy(path, "box/");
        strcat(path, entry->d_name);
        printf("%s\n", path);
    }
    closedir(dir);
    return 0;
}
```

Output

```text
box/a.txt
```

---

Putting it together: list the files in a directory, sorted, with their sizes

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

int by_name(const void *a, const void *b) {
    return strcmp(a, b);
}

int main(void) {
    mkdir("crate", 0755);
    int fd = open("crate/b.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    write(fd, "bbb", 3);
    close(fd);
    fd = open("crate/a.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    write(fd, "a", 1);
    close(fd);

    char names[50][256];
    int count = 0;
    DIR *dir = opendir("crate");
    struct dirent *entry;
    while ((entry = readdir(dir)) != NULL) {
        if (strcmp(entry->d_name, ".") == 0 || strcmp(entry->d_name, "..") == 0) {
            continue;
        }
        strcpy(names[count], entry->d_name);
        count++;
    }
    closedir(dir);

    qsort(names, count, sizeof(names[0]), by_name);

    for (int i = 0; i < count; i++) {
        char path[300];
        strcpy(path, "crate/");
        strcat(path, names[i]);
        struct stat st;
        stat(path, &st);
        printf("%s %ld\n", names[i], (long)st.st_size);
    }
    return 0;
}
```

Output

```text
a.txt 1
b.txt 3
```

Each name is a row of the 2D array names, and qsort moves whole rows. The compare function gets the address of a row, which is already the start of a string, so it can give it straight to strcmp

---

## Mission: The Archive Shelf

The archive keeps its files on a shelf: a directory called `shelf`. Each evening, the clerk clears the shelf, puts the new files on it and writes a list of what is there

1. Make the directory `shelf`. If it already exists, that's fine
2. Clear it: delete every file already in it. Read its names with readdir, skip `.` and `..`, and unlink the rest
3. Read lines until the input ends, each with a file name and a size. Make each file inside shelf, with that many `x` characters in it
4. Read the directory again and print its files in alphabetical order, each with its size from stat. Then print how many files there are and how many bytes they hold together, as in the example

There are from 1 to 50 files. Names are one word of at most 30 characters, all different, and sizes are from 0 to 2000

**Example**

Input

```text
tape.txt 30
crew.txt 12
log.txt 0
```

Output

```text
crew.txt 12
log.txt 0
tape.txt 30
Files: 3, bytes: 42
```

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <errno.h>
#include <dirent.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

void fail(const char *command, const char *name) {
    printf("%s %s: %s\n", command, name, strerror(errno));
}

int write_word(const char *name, const char *word, int flags) {
    int fd = open(name, flags, 0644);
    if (fd == -1) {
        return -1;
    }
    write(fd, word, strlen(word));
    write(fd, "\n", 1);
    close(fd);
    return 0;
}

int show(const char *name) {
    char buf[4096];
    int fd = open(name, O_RDONLY);
    if (fd == -1) {
        return -1;
    }
    ssize_t total = 0;
    ssize_t n;
    while ((n = read(fd, buf + total, sizeof(buf) - 1 - total)) > 0) {
        total = total + n;
    }
    close(fd);
    buf[total] = '\0';
    printf("%s", buf);
    return 0;
}

int copy(const char *from, const char *to) {
    int in = open(from, O_RDONLY);
    if (in == -1) {
        return -1;
    }
    int out = open(to, O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (out == -1) {
        close(in);
        return -1;
    }
    char buf[512];
    ssize_t n;
    while ((n = read(in, buf, sizeof(buf))) > 0) {
        write(out, buf, n);
    }
    close(in);
    close(out);
    return 0;
}

int ends_with_txt(const char *name) {
    size_t len = strlen(name);
    return len >= 4 && strcmp(name + len - 4, ".txt") == 0;
}

int by_name(const void *a, const void *b) {
    return strcmp(a, b);
}

void list(void) {
    char names[256][256];
    int count = 0;
    DIR *dir = opendir(".");
    struct dirent *entry;
    while ((entry = readdir(dir)) != NULL) {
        if (ends_with_txt(entry->d_name) && count < 256) {
            strcpy(names[count], entry->d_name);
            count++;
        }
    }
    closedir(dir);
    qsort(names, count, sizeof(names[0]), by_name);
    for (int i = 0; i < count; i++) {
        struct stat st;
        stat(names[i], &st);
        printf("%s %ld\n", names[i], (long)st.st_size);
    }
    printf("Files: %d\n", count);
}

int main(void) {
    char line[128];
    while (fgets(line, sizeof(line), stdin) != NULL) {
        char command[16];
        char a[64];
        char b[64];
        int found = sscanf(line, "%15s %63s %63s", command, a, b);
        if (found < 1) {
            continue;
        }

        if (strcmp(command, "list") == 0) {
            list();
        } else if (strcmp(command, "write") == 0 && found == 3) {
            if (write_word(a, b, O_WRONLY | O_CREAT | O_TRUNC) == -1) {
                fail(command, a);
            }
        } else if (strcmp(command, "append") == 0 && found == 3) {
            if (write_word(a, b, O_WRONLY | O_APPEND) == -1) {
                fail(command, a);
            }
        } else if (strcmp(command, "copy") == 0 && found == 3) {
            if (copy(a, b) == -1) {
                fail(command, a);
            }
        } else if (strcmp(command, "show") == 0 && found >= 2) {
            if (show(a) == -1) {
                fail(command, a);
            }
        } else if (strcmp(command, "remove") == 0 && found >= 2) {
            if (unlink(a) == -1) {
                fail(command, a);
            }
        }
    }
    return 0;
}
```

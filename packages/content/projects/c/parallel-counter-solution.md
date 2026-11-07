```c
#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <unistd.h>
#include <sys/wait.h>

#define MAXL 2000
#define LEN 512
#define MAXW 8

char lines[MAXL][LEN];
int n;
char target[64];

struct Count {
    int lines, words, letters, hits;
};

struct Count count(int from, int to) {
    struct Count c = {0, 0, 0, 0};
    for (int i = from; i < to; i++) {
        c.lines++;
        char *s = lines[i];
        for (int k = 0; s[k];) {
            if (!isalpha((unsigned char)s[k])) {
                k++;
                continue;
            }
            char word[LEN];
            int w = 0;
            while (isalpha((unsigned char)s[k])) word[w++] = tolower((unsigned char)s[k++]);
            word[w] = '\0';
            c.words++;
            c.letters += w;
            if (strcmp(word, target) == 0) c.hits++;
        }
    }
    return c;
}

int main(void) {
    int workers;
    scanf("%d %63s", &workers, target);
    for (char *t = target; *t; t++) *t = tolower((unsigned char)*t);
    char rest[LEN];
    fgets(rest, sizeof rest, stdin);
    while (n < MAXL && fgets(lines[n], LEN, stdin)) {
        lines[n][strcspn(lines[n], "\n")] = '\0';
        n++;
    }
    if (workers < 1 || workers > MAXW) {
        printf("Use 1 to %d workers\n", MAXW);
        return 0;
    }
    printf("%d lines, %d workers, looking for \"%s\"\n", n, workers, target);

    int fds[MAXW][2];
    pid_t pids[MAXW];
    for (int k = 0; k < workers; k++) {
        pipe(fds[k]);
        pids[k] = fork();
        if (pids[k] == 0) {
            close(fds[k][0]);
            struct Count c = count(k * n / workers, (k + 1) * n / workers);
            write(fds[k][1], &c, sizeof c);
            close(fds[k][1]);
            _exit(0);
        }
        close(fds[k][1]);
    }
    struct Count total = {0, 0, 0, 0};
    for (int k = 0; k < workers; k++) {
        struct Count c;
        read(fds[k][0], &c, sizeof c);
        close(fds[k][0]);
        int status;
        waitpid(pids[k], &status, 0);
        int from = k * n / workers, to = (k + 1) * n / workers;
        if (to > from) printf("Worker %d, lines %d-%d: ", k + 1, from + 1, to);
        else printf("Worker %d, no lines: ", k + 1);
        printf("%d words, %d letters, %d \"%s\"\n", c.words, c.letters, c.hits, target);
        total.lines += c.lines;
        total.words += c.words;
        total.letters += c.letters;
        total.hits += c.hits;
    }
    printf("\nTotal: %d lines, %d words, %d letters, %d \"%s\"\n", total.lines, total.words, total.letters,
           total.hits, target);
    struct Count alone = count(0, n);
    int same = alone.lines == total.lines && alone.words == total.words && alone.letters == total.letters &&
               alone.hits == total.hits;
    printf("Counted alone: %s\n", same ? "the same" : "different!");
    return 0;
}
```

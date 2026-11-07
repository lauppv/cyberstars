```c
#include <stdio.h>
#include <string.h>
#include <ctype.h>

#define MAXL 100
#define LEN 512

char lines[MAXL][LEN];
int n;

/* writes the runs of src into out */
void compress(const char *src, char *out) {
    out[0] = '\0';
    for (int i = 0; src[i];) {
        int j = i;
        while (src[j] == src[i]) j++;
        char run[16];
        if (j - i == 1) sprintf(run, "%c", src[i]);
        else sprintf(run, "%d%c", j - i, src[i]);
        strcat(out, run);
        i = j;
    }
}

/* writes the expanded text into out; returns NULL or what's wrong */
const char *expand(const char *src, char *out) {
    int k = 0;
    for (int i = 0; src[i];) {
        int count = 1;
        if (isdigit((unsigned char)src[i])) {
            count = 0;
            while (isdigit((unsigned char)src[i])) count = count * 10 + (src[i++] - '0');
            if (!src[i]) return "a count with no character";
            if (count < 2) return "a count below 2";
        }
        if (k + count >= LEN) return "too long";
        for (int c = 0; c < count; c++) out[k++] = src[i];
        i++;
    }
    out[k] = '\0';
    return NULL;
}

int main(void) {
    char mode[32];
    if (!fgets(mode, sizeof mode, stdin)) return 0;
    mode[strcspn(mode, "\n")] = '\0';
    while (n < MAXL && fgets(lines[n], LEN, stdin)) {
        lines[n][strcspn(lines[n], "\n")] = '\0';
        n++;
    }
    char out[LEN * 2], back[LEN];
    if (strcmp(mode, "compress") == 0) {
        int before = 0, after = 0, ok = 1;
        for (int i = 0; i < n; i++) {
            for (char *c = lines[i]; *c; c++)
                if (isdigit((unsigned char)*c)) {
                    printf("Line %d: digits can't be compressed\n", i + 1);
                    return 0;
                }
        }
        for (int i = 0; i < n; i++) {
            compress(lines[i], out);
            printf("%s\n", out);
            before += strlen(lines[i]);
            after += strlen(out);
            if (expand(out, back) || strcmp(back, lines[i]) != 0) ok = 0;
        }
        printf("\n%d characters -> %d", before, after);
        if (before > 0) printf(" (%d%% saved)", (before - after) * 100 / before);
        printf("\nCheck: %s\n", ok ? "OK" : "FAILED");
    } else if (strcmp(mode, "expand") == 0) {
        for (int i = 0; i < n; i++) {
            const char *why = expand(lines[i], back);
            if (why) {
                printf("Line %d: %s\n", i + 1, why);
                return 0;
            }
        }
        int before = 0, after = 0;
        for (int i = 0; i < n; i++) {
            expand(lines[i], back);
            printf("%s\n", back);
            before += strlen(lines[i]);
            after += strlen(back);
        }
        printf("\n%d characters -> %d\n", before, after);
    } else {
        printf("The first line must be compress or expand\n");
    }
    return 0;
}
```

```c
#include <stdio.h>
#include <string.h>

#define MAXB 65536

unsigned char data[MAXB];

void line(long offset, int n) {
    printf("%08lx ", offset);
    for (int i = 0; i < 16; i++) {
        if (i == 8) printf(" ");
        if (i < n) printf(" %02x", data[offset + i]);
        else printf("   ");
    }
    printf("  |");
    for (int i = 0; i < n; i++) {
        unsigned char c = data[offset + i];
        putchar(c >= 32 && c <= 126 ? c : '.');
    }
    printf("|\n");
}

int main(void) {
    long n = 0;
    int c;
    while (n < MAXB && (c = getchar()) != EOF) data[n++] = (unsigned char)c;

    int starred = 0;
    for (long off = 0; off < n; off += 16) {
        int len = n - off < 16 ? (int)(n - off) : 16;
        if (off > 0 && len == 16 && memcmp(data + off, data + off - 16, 16) == 0) {
            if (!starred) printf("*\n");
            starred = 1;
            continue;
        }
        starred = 0;
        line(off, len);
    }
    printf("%08lx\n", n);

    long lines = 0, letters = 0, digits = 0, spaces = 0, other = 0;
    long count[256] = {0};
    for (long i = 0; i < n; i++) {
        unsigned char b = data[i];
        count[b]++;
        if (b == '\n') lines++;
        else if ((b >= 'a' && b <= 'z') || (b >= 'A' && b <= 'Z')) letters++;
        else if (b >= '0' && b <= '9') digits++;
        else if (b == ' ') spaces++;
        else other++;
    }
    printf("\n%ld bytes: %ld letters, %ld digits, %ld spaces, %ld newlines, %ld other\n", n, letters, digits,
           spaces, lines, other);
    if (n > 0) {
        int top = 0;
        for (int b = 1; b < 256; b++)
            if (count[b] > count[top]) top = b;
        printf("Most common byte: %02x", top);
        if (top >= 32 && top <= 126) printf(" '%c'", top);
        printf(", %ld times\n", count[top]);
    }
    return 0;
}
```

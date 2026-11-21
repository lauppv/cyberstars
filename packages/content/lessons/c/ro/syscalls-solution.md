```c
#include <stdio.h>
#include <unistd.h>

int main(void) {
    char buf[16];
    ssize_t n;
    long bytes = 0;
    long linii = 0;

    while ((n = read(0, buf, sizeof(buf))) > 0) {
        write(1, buf, n);
        bytes = bytes + n;
        for (ssize_t i = 0; i < n; i++) {
            if (buf[i] == '\n') {
                linii++;
            }
        }
    }

    printf("Bytes: %ld, linii: %ld\n", bytes, linii);
    return 0;
}
```

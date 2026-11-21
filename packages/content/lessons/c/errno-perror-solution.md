```c
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    char command[16];
    char name[64];
    int failed = 0;

    while (scanf("%15s %63s", command, name) == 2) {
        int result = -1;
        if (strcmp(command, "create") == 0) {
            result = open(name, O_WRONLY | O_CREAT | O_EXCL, 0644);
            if (result != -1) {
                close(result);
            }
        } else if (strcmp(command, "open") == 0) {
            result = open(name, O_RDONLY);
            if (result != -1) {
                close(result);
            }
        } else if (strcmp(command, "remove") == 0) {
            result = unlink(name);
        }

        if (result == -1) {
            printf("%s %s: %s\n", command, name, strerror(errno));
            failed++;
        } else {
            printf("%s %s: ok\n", command, name);
        }
    }

    printf("Failed: %d\n", failed);
    return 0;
}
```

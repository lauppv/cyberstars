#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    char command[16], name[64];
    int failed = 0;
    while (scanf("%15s %63s", command, name) == 2) {
        int r = -1;
        if (!strcmp(command, "create")) { r = open(name, O_WRONLY | O_CREAT | O_EXCL, 0644); if (r != -1) close(r); }
        else if (!strcmp(command, "open")) { r = open(name, O_RDONLY | O_CREAT, 0644); if (r != -1) close(r); }
        else r = unlink(name);
        if (r == -1) { printf("%s %s: %s\n", command, name, strerror(errno)); failed++; }
        else printf("%s %s: ok\n", command, name);
    }
    printf("Failed: %d\n", failed);
    return 0;
}

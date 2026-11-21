#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    char line[128];
    while (fgets(line, sizeof(line), stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';
        char *cmd = strtok(line, " ");
        if (!cmd) continue;
        if (!strcmp(cmd, "echo")) {
            char *w = strtok(NULL, " "); int first = 1;
            while (w) { printf(first ? "%s" : " %s", w); first = 0; w = strtok(NULL, " "); }
            printf("\n");
        } else if (!strcmp(cmd, "add") || !strcmp(cmd, "max")) {
            int add = !strcmp(cmd, "add"), bad = 0; long r = 0;
            for (char *w = strtok(NULL, " "); w; w = strtok(NULL, " ")) {
                char *end; long n = strtol(w, &end, 10);
                if (*end) { printf("Bad number: %s\n", w); bad = 1; break; }
                if (add) r += n; else if (n > r) r = n;
            }
            if (!bad) printf("%ld\n", r);
        } else printf("Unknown command: %s\n", cmd);
    }
    return 0;
}

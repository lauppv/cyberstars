#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    char line[128];
    while (fgets(line, sizeof(line), stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';
        if (!strncmp(line, "echo", 4) && (line[4] == ' ' || line[4] == '\0')) {
            printf("%s\n", line[4] ? line + 5 : "");
            continue;
        }
        char *cmd = strtok(line, " ");
        if (!cmd) continue;
        if (!strcmp(cmd, "add") || !strcmp(cmd, "max")) {
            int add = !strcmp(cmd, "add"), bad = 0, c = 0; long r = 0;
            for (char *w = strtok(NULL, " "); w; w = strtok(NULL, " ")) {
                char *end; long n = strtol(w, &end, 10);
                if (*end) { printf("Bad number: %s\n", w); bad = 1; break; }
                if (add) r += n; else if (c == 0 || n > r) r = n;
                c++;
            }
            if (!bad) printf("%ld\n", r);
        } else printf("Unknown command: %s\n", cmd);
    }
    return 0;
}

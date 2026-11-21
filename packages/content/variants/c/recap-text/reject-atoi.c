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
            int add = !strcmp(cmd, "add"); long r = 0; int c = 0;
            for (char *w = strtok(NULL, " "); w; w = strtok(NULL, " ")) {
                long n = atoi(w);
                if (add) r += n; else if (c == 0 || n > r) r = n;
                c++;
            }
            printf("%ld\n", r);
        } else printf("Unknown command: %s\n", cmd);
    }
    return 0;
}

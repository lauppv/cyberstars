#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int parse(const char *w, long *out) {
    char *end;
    *out = strtol(w, &end, 10);
    return *w != '\0' && *end == '\0';
}

static void numbers(int add) {
    long acc = 0, v;
    int seen = 0;
    char *w;
    while ((w = strtok(NULL, " ")) != NULL) {
        if (!parse(w, &v)) { printf("Bad number: %s\n", w); return; }
        if (add) acc += v;
        else if (!seen || v > acc) acc = v;
        seen = 1;
    }
    printf("%ld\n", acc);
}

int main(void) {
    char buf[200];
    while (fgets(buf, sizeof buf, stdin)) {
        buf[strcspn(buf, "\n")] = 0;
        char *cmd = strtok(buf, " ");
        if (!cmd) continue;
        if (!strcmp(cmd, "add")) numbers(1);
        else if (!strcmp(cmd, "max")) numbers(0);
        else if (!strcmp(cmd, "echo")) {
            char *w; const char *sep = "";
            while ((w = strtok(NULL, " "))) { printf("%s%s", sep, w); sep = " "; }
            putchar('\n');
        } else printf("Unknown command: %s\n", cmd);
    }
    return 0;
}

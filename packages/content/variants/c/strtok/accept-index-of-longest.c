#include <stdio.h>
#include <string.h>

int main(void) {
    char s[200], best[200] = {0};
    size_t bestLen = 0;
    int n = 0;
    if (!fgets(s, sizeof s, stdin)) return 0;
    s[strcspn(s, "\n")] = 0;
    for (char *t = strtok(s, ", "); t; t = strtok(NULL, ", ")) {
        size_t len = strlen(t);
        printf("%s (%zu)\n", t, len);
        if (len > bestLen) { bestLen = len; strcpy(best, t); }
        n++;
    }
    printf("Words: %d\nLongest: %s\n", n, best);
    return 0;
}

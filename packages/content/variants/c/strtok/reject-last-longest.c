#include <stdio.h>
#include <string.h>

int main(void) {
    char line[128], longest[128] = "";
    int count = 0;
    fgets(line, sizeof(line), stdin);
    line[strcspn(line, "\n")] = '\0';
    for (char *w = strtok(line, " ,"); w; w = strtok(NULL, " ,")) {
        printf("%s (%d)\n", w, (int)strlen(w));
        count++;
        if (strlen(w) >= strlen(longest)) strcpy(longest, w);
    }
    printf("Words: %d\nLongest: %s\n", count, longest);
    return 0;
}

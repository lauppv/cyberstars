#include <stdio.h>
#include <string.h>

int main(void) {
    char line[128], longest[128] = "", word[128];
    int count = 0, k = 0;
    fgets(line, sizeof(line), stdin);
    line[strcspn(line, "\n")] = '\0';
    for (int i = 0; ; i++) {
        char c = line[i];
        if (c == ' ' || c == ',' || c == '\0') {
            if (k > 0) {
                word[k] = '\0';
                printf("%s (%d)\n", word, k);
                count++;
                if (k > (int)strlen(longest)) strcpy(longest, word);
                k = 0;
            }
            if (c == '\0') break;
        } else {
            word[k++] = c;
        }
    }
    printf("Words: %d\nLongest: %s\n", count, longest);
    return 0;
}

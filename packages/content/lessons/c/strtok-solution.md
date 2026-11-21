```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char line[128];
    char longest[128] = "";
    int count = 0;

    fgets(line, sizeof(line), stdin);
    line[strcspn(line, "\n")] = '\0';

    char *word = strtok(line, " ,");
    while (word != NULL) {
        printf("%s (%d)\n", word, (int)strlen(word));
        count++;
        if (strlen(word) > strlen(longest)) {
            strcpy(longest, word);
        }
        word = strtok(NULL, " ,");
    }

    printf("Words: %d\n", count);
    printf("Longest: %s\n", longest);
    return 0;
}
```

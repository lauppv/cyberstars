```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    char line[128];

    while (fgets(line, sizeof(line), stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';
        char *command = strtok(line, " ");
        if (command == NULL) {
            continue;
        }

        if (strcmp(command, "echo") == 0) {
            char *word = strtok(NULL, " ");
            int first = 1;
            while (word != NULL) {
                printf(first ? "%s" : " %s", word);
                first = 0;
                word = strtok(NULL, " ");
            }
            printf("\n");
        } else if (strcmp(command, "add") == 0 || strcmp(command, "max") == 0) {
            int is_add = strcmp(command, "add") == 0;
            long result = 0;
            int count = 0;
            int bad = 0;
            char *word = strtok(NULL, " ");
            while (word != NULL) {
                char *end;
                long n = strtol(word, &end, 10);
                if (*end != '\0') {
                    printf("Bad number: %s\n", word);
                    bad = 1;
                    break;
                }
                if (is_add) {
                    result = result + n;
                } else if (count == 0 || n > result) {
                    result = n;
                }
                count++;
                word = strtok(NULL, " ");
            }
            if (!bad) {
                printf("%ld\n", result);
            }
        } else {
            printf("Unknown command: %s\n", command);
        }
    }
    return 0;
}
```

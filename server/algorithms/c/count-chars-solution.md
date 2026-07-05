```c
#include <stdio.h>

int main(void) {
    char word[1001];
    char target;

    // %1000s limits the read to 1000 characters so we don't overrun the buffer.
    scanf("%1000s", word);
    // The space in " %c" tells scanf to skip any whitespace (including \n).
    scanf(" %c", &target);

    // Walk the word character by character until we hit the '\0' terminator.
    int count = 0;
    for (int i = 0; word[i] != '\0'; i++) {
        if (word[i] == target) {
            count++;
        }
    }

    printf("%d\n", count);
    return 0;
}
```

```c
#include <stdio.h>

int main(void) {
    char word[1001];
    scanf("%1000s", word);

    // In C, a string ends with the '\0' character. We count how many characters
    // are there until we hit it.
    int length = 0;
    while (word[length] != '\0') {
        length++;
    }

    printf("%d\n", length);
    return 0;
}
```

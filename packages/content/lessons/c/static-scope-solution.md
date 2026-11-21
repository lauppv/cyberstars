```c
#include <stdio.h>

int take_ticket(char window) {
    static int runs = 0;
    static int prints = 0;
    if (window == 'R') {
        runs++;
        return runs;
    }
    prints++;
    return prints;
}

int main(void) {
    char line[64];
    scanf("%s", line);

    for (int i = 0; line[i] != '\0'; i++) {
        printf("%c%d\n", line[i], take_ticket(line[i]));
    }
    return 0;
}
```

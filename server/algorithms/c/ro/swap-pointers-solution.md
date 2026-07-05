```c
#include <stdio.h>

// Primim adrese, nu valori. Dereferentiem cu * ca sa citim/scriem
// valorile aflate la acele adrese.
void interschimba(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main(void) {
    int x, y;
    scanf("%d", &x);
    scanf("%d", &y);

    // Trimitem adresele lui x si y ca functia sa poata modifica variabilele.
    interschimba(&x, &y);

    printf("%d %d\n", x, y);
    return 0;
}
```

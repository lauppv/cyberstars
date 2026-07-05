```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    // Trucul: o putere a lui 2 are exact un singur bit setat in binar.
    // Cand scazi 1, toti bitii de jos se intorc pe 1 si bitul unic devine 0.
    // Deci x & (x - 1) sterge exact acel bit si rezultatul este 0.
    // Exemplu: 8 = 1000, 7 = 0111, 8 & 7 = 0000.
    for (int i = 0; i < n; i++) {
        int numar;
        scanf("%d", &numar);
        if (numar > 0 && (numar & (numar - 1)) == 0) {
            printf("DA\n");
        } else {
            printf("NU\n");
        }
    }

    return 0;
}
```

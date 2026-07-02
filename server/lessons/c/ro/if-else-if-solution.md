```c
#include <stdio.h>

int main(void) {
    int secunde, eroare_detectata;
    scanf("%d %d", &secunde, &eroare_detectata);

    if (secunde == 100) {
        printf("Verific memoria\n");
    } else if (secunde == 60) {
        printf("Verific perifericele\n");
    } else if (secunde == 30) {
        printf("Incarc nucleul sistemului de operare\n");
    } else if (secunde == 10) {
        printf("Pornesc procesele de sistem\n");
    } else if (secunde < 10) {
        if (eroare_detectata == 1) {
            printf("Eroare detectata. Anulez pornirea\n");
        } else {
            printf("Nicio eroare detectata. Pornesc sistemul...\n");
        }
    } else {
        printf("%d secunde nu au niciun efect\n", secunde);
    }
    return 0;
}
```

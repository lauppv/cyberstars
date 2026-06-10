#include <stdio.h>

int main(void) {
    int secunde = 60;
    int eroare_detectata = 0;

    if (secunde == 100) {
        printf("Pornesc toate calculatoarele de la bord\n");
    } else if (secunde == 60) {
        printf("Verific conexiunea cu turnul de control\n");
    } else if (secunde == 20) {
        printf("Pornesc motoarele secundare\n");
    } else if (secunde == 10) {
        printf("Pornesc motoarele principale\n");
    } else if (secunde < 10) {
        if (eroare_detectata) {
            printf("Eroare detectata. Anulez misiunea\n");
        } else {
            printf("Nicio eroare detectata. Decolez...\n");
        }
    } else {
        printf("%d secunde nu au niciun efect\n", secunde);
    }

    return 0;
}

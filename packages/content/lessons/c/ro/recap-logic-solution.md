```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char parola[64];
    scanf("%s", parola);

    int are_lungime = strlen(parola) >= 8;
    int are_litera_mare = 0;
    int are_cifra = 0;
    int are_special = 0;

    for (int i = 0; i < (int) strlen(parola); i++) {
        char c = parola[i];
        if (c >= 'A' && c <= 'Z') {
            are_litera_mare = 1;
        }
        if (c >= '0' && c <= '9') {
            are_cifra = 1;
        }
        if (c == '!' || c == '@' || c == '#') {
            are_special = 1;
        }
    }

    printf("Lungime >= 8: %s\n", are_lungime ? "OK" : "NU");
    printf("Are litera mare: %s\n", are_litera_mare ? "OK" : "NU");
    printf("Are cifra: %s\n", are_cifra ? "OK" : "NU");
    printf("Are caracter special: %s\n", are_special ? "OK" : "NU");

    int valid = are_lungime && are_litera_mare && are_cifra && are_special;
    printf("Parola valida: %s\n", valid ? "DA" : "NU");

    return 0;
}
```

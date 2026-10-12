```c
#include <stdio.h>

struct ContOre {
    char proprietar[50];
    int sold;
};

void aloca(struct ContOre *cont, int ore) {
    cont->sold += ore;
}

void retrage(struct ContOre *cont, int ore) {
    if (cont->sold >= ore) {
        cont->sold -= ore;
    } else {
        printf("Fonduri insuficiente\n");
    }
}

int main(void) {
    struct ContOre cont;
    scanf("%s", cont.proprietar);
    scanf("%d", &cont.sold);

    for (int i = 0; i < 3; i++) {
        int cod, ore;
        scanf("%d %d", &cod, &ore);
        if (cod == 1) {
            aloca(&cont, ore);
        } else {
            retrage(&cont, ore);
        }
    }

    printf("Sold: %d\n", cont.sold);
    return 0;
}
```

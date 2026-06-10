#include <stdio.h>
#include <string.h>

struct ContBancar {
    char proprietar[50];
    int sold;
};

void depune(struct ContBancar *cont, int suma) {
}

void retrage(struct ContBancar *cont, int suma) {
}

int main(void) {
    struct ContBancar cont = {"Lance", 1000};
    depune(&cont, 500);
    retrage(&cont, 200);
    retrage(&cont, 2000);
    printf("Sold: %d\n", cont.sold);
    return 0;
}

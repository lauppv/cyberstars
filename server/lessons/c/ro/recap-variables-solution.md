```c
#include <stdio.h>

int main(void) {
    int distanta_km;
    double consum_per_km, pret_per_litru;
    scanf("%d %lf %lf", &distanta_km, &consum_per_km, &pret_per_litru);

    // combustibilul total necesar pentru drum
    double combustibil_total = distanta_km * consum_per_km;

    // costul total al combustibilului
    double cost_total = combustibil_total * pret_per_litru;

    printf("Distanta: %d km\n", distanta_km);
    printf("Combustibil: %.2f litri\n", combustibil_total);
    printf("Cost: %.2f EUR\n", cost_total);
    return 0;
}
```

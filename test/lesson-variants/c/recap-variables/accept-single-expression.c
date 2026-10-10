#include <stdio.h>

int main(void) {
    int distance_km = 450;
    double consumption_per_km = 0.07;
    double price_per_liter = 1.75;

    /* liters burned on the whole trip */
    double liters = distance_km * consumption_per_km;
    /* what those liters cost */
    double eur = liters * price_per_liter;

    printf("Distance: %d km\nFuel: %.2lf liters\nCost: %.2lf EUR\n", distance_km, liters, eur);
    return 0;
}

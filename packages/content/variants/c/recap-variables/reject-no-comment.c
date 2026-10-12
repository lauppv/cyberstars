#include <stdio.h>

int main(void) {
    int distance_km = 450;
    double consumption_per_km = 0.07;
    double price_per_liter = 1.75;
    double fuel = distance_km * consumption_per_km;
    double cost = fuel * price_per_liter;
    printf("Distance: %d km\n", distance_km);
    printf("Fuel: %.2f liters\n", fuel);
    printf("Cost: %.2f EUR\n", cost);
    return 0;
}

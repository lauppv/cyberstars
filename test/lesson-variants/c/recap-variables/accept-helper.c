#include <stdio.h>

static double times(double a, double b) {
    return a * b;
}

int main(void) {
    int distance_km = 450;
    double consumption_per_km = 0.07;
    double price_per_liter = 1.75;

    // fuel for the trip
    double f = times(distance_km, consumption_per_km);
    // cost of that fuel
    double c = times(f, price_per_liter);

    printf("Distance: %d km\n", distance_km);
    printf("Fuel: %.2f liters\n", f);
    printf("Cost: %.2f EUR\n", c);
    return 0;
}

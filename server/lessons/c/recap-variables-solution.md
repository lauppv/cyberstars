```c
#include <stdio.h>

int main(void) {
    int distance_km = 450;
    double consumption_per_km = 0.07;
    double price_per_liter = 1.75;

    // total fuel needed for the trip
    double total_fuel = distance_km * consumption_per_km;

    // total cost of the fuel
    double total_cost = total_fuel * price_per_liter;

    printf("Distance: %d km\n", distance_km);
    printf("Fuel: %.2f liters\n", total_fuel);
    printf("Cost: %.2f EUR\n", total_cost);
    return 0;
}
```

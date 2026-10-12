#include <stdio.h>
#include <stdbool.h>

int main(void) {
    int e, w, g, inv;
    scanf("%d %d %d %d", &e, &w, &g, &inv);
    bool staff_ok = e && w;
    bool visitor_ok = g && inv;
    if (staff_ok || visitor_ok) {
        printf("Access granted\n");
    } else {
        printf("Access denied\n");
    }
    return 0;
}

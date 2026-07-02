```c
#include <stdio.h>
#include <stdbool.h>

int main(void) {
    int is_employee, is_working_day, is_guest, has_invitation;
    scanf("%d %d %d %d", &is_employee, &is_working_day, &is_guest, &has_invitation);

    if ((is_employee && is_working_day) || (is_guest && has_invitation)) {
        printf("Access granted\n");
    } else {
        printf("Access denied\n");
    }

    return 0;
}
```

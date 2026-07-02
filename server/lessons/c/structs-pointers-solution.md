```c
#include <stdio.h>

struct HourAccount {
    char owner[50];
    int balance;
};

void allocate(struct HourAccount *acc, int hours) {
    acc->balance += hours;
}

void withdraw(struct HourAccount *acc, int hours) {
    if (acc->balance >= hours) {
        acc->balance -= hours;
    } else {
        printf("Insufficient funds\n");
    }
}

int main(void) {
    struct HourAccount acc;
    scanf("%s", acc.owner);
    scanf("%d", &acc.balance);

    for (int i = 0; i < 3; i++) {
        int code, hours;
        scanf("%d %d", &code, &hours);
        if (code == 1) {
            allocate(&acc, hours);
        } else {
            withdraw(&acc, hours);
        }
    }

    printf("Balance: %d\n", acc.balance);
    return 0;
}
```

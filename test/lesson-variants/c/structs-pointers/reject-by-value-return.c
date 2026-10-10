#include <stdio.h>

struct HourAccount {
    char owner[50];
    int balance;
};

struct HourAccount allocate(struct HourAccount acc, int hours) {
    acc.balance += hours;
    return acc;
}

struct HourAccount withdraw(struct HourAccount acc, int hours) {
    if (acc.balance >= hours) acc.balance -= hours;
    else printf("Insufficient funds\n");
    return acc;
}

int main(void) {
    struct HourAccount acc;
    scanf("%s %d", acc.owner, &acc.balance);
    for (int i = 0; i < 3; i++) {
        int code, hours;
        scanf("%d %d", &code, &hours);
        if (code == 1) acc = allocate(acc, hours);
        else acc = withdraw(acc, hours);
    }
    printf("Balance: %d\n", acc.balance);
    return 0;
}

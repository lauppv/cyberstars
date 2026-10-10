#include <stdio.h>

struct HourAccount {
    char owner[64];
    int balance;
};

void allocate(struct HourAccount *acc, int hours) {
    acc->balance = acc->balance + hours;
}

void withdraw(struct HourAccount *acc, int hours) {
    if (hours > acc->balance) {
        puts("Insufficient funds");
        return;
    }
    acc->balance -= hours;
}

int main(void) {
    struct HourAccount ledger;
    scanf("%63s %d", ledger.owner, &ledger.balance);
    int ops = 3;
    while (ops-- > 0) {
        int kind, amount;
        scanf("%d %d", &kind, &amount);
        switch (kind) {
        case 1: allocate(&ledger, amount); break;
        case 2: withdraw(&ledger, amount); break;
        }
    }
    printf("Balance: %d\n", ledger.balance);
    return 0;
}

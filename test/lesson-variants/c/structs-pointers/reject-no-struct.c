#include <stdio.h>

void allocate(int *balance, int hours) {
    *balance += hours;
}

void withdraw(int *balance, int hours) {
    if (*balance >= hours) *balance -= hours;
    else printf("Insufficient funds\n");
}

int main(void) {
    char owner[50];
    int balance;
    scanf("%s %d", owner, &balance);
    for (int i = 0; i < 3; i++) {
        int code, hours;
        scanf("%d %d", &code, &hours);
        if (code == 1) allocate(&balance, hours);
        else withdraw(&balance, hours);
    }
    printf("Balance: %d\n", balance);
    return 0;
}

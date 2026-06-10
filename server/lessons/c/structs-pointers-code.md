#include <stdio.h>
#include <string.h>

struct BankAccount {
    char owner[50];
    int balance;
};

void deposit(struct BankAccount *acc, int amount) {
}

void withdraw(struct BankAccount *acc, int amount) {
}

int main(void) {
    struct BankAccount acc = {"Lance", 1000};
    deposit(&acc, 500);
    withdraw(&acc, 200);
    withdraw(&acc, 2000);
    printf("Balance: %d\n", acc.balance);
    return 0;
}

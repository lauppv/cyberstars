#include <stdio.h>
#include <string.h>

struct BankAccount {
    char owner[50];
    int balance;
};

void deposit(struct BankAccount *acc, int amount) {
    // add amount to balance
}

void withdraw(struct BankAccount *acc, int amount) {
    // subtract if enough, otherwise print "Insufficient funds"
}

int main(void) {
    struct BankAccount acc = {"Lance", 1000};
    deposit(&acc, 500);
    withdraw(&acc, 200);
    withdraw(&acc, 2000);
    printf("Balance: %d\n", acc.balance);
    return 0;
}

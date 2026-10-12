#include <stdio.h>
#include <stdlib.h>

typedef struct HourAccount {
    char owner[50];
    int balance;
} Account;

void allocate(struct HourAccount *acc, int hours) {
    (*acc).balance += hours;
}

void withdraw(struct HourAccount *acc, int hours) {
    int enough = (*acc).balance >= hours;
    if (enough) (*acc).balance -= hours;
    else printf("Insufficient funds\n");
}

int main(void) {
    Account *a = malloc(sizeof *a);
    scanf("%s", a->owner);
    scanf("%d", &a->balance);
    int code[3], val[3];
    for (int i = 0; i < 3; i++) scanf("%d %d", &code[i], &val[i]);
    for (int i = 0; i < 3; i++) (code[i] == 1 ? allocate : withdraw)(a, val[i]);
    printf("Balance: %d\n", a->balance);
    free(a);
    return 0;
}

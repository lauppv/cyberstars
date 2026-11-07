```c
#include <stdio.h>
#include <string.h>

#define MAX 20

struct Product {
    char code[8];
    char name[32];
    int price;
    int count;
    int sold;
};

int coins[4] = {500, 100, 50, 10};
int tube[4] = {5, 5, 5, 5};

void money(int bani) { printf("%d.%02d", bani / 100, bani % 100); }

int find(struct Product p[], int n, const char *code) {
    for (int i = 0; i < n; i++)
        if (strcmp(p[i].code, code) == 0) return i;
    return -1;
}

/* Gives `amount` back from the tubes, biggest coins first; returns 0 and gives nothing when it can't */
int give_change(int amount) {
    int use[4] = {0, 0, 0, 0};
    int left = amount;
    for (int i = 0; i < 4; i++) {
        while (left >= coins[i] && use[i] < tube[i]) {
            left -= coins[i];
            use[i]++;
        }
    }
    if (left != 0) return 0;
    if (amount > 0) {
        printf("Coins out:");
        for (int i = 0; i < 4; i++) {
            for (int k = 0; k < use[i]; k++) printf(" %d", coins[i]);
            tube[i] -= use[i];
        }
        printf("\n");
    }
    return 1;
}

int main(void) {
    struct Product p[MAX];
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%7s %31s %d %d", p[i].code, p[i].name, &p[i].price, &p[i].count);
        p[i].sold = 0;
    }
    printf("Loaded %d products\n", n);
    int credit = 0, earned = 0;
    char cmd[32];
    while (scanf("%31s", cmd) == 1) {
        if (strcmp(cmd, "quit") == 0) {
            printf("Bye\n");
            break;
        } else if (strcmp(cmd, "list") == 0) {
            for (int i = 0; i < n; i++) {
                printf("%s %s ", p[i].code, p[i].name);
                money(p[i].price);
                if (p[i].count == 0) printf(" (sold out)\n");
                else printf(" (%d left)\n", p[i].count);
            }
        } else if (strcmp(cmd, "coin") == 0) {
            int v;
            if (scanf("%d", &v) != 1) {
                printf("Usage: coin <value>\n");
                scanf("%*s");
                continue;
            }
            int k = -1;
            for (int i = 0; i < 4; i++)
                if (coins[i] == v) k = i;
            if (k < 0) {
                printf("Coin rejected: %d\n", v);
            } else {
                tube[k]++;
                credit += v;
                printf("Credit: ");
                money(credit);
                printf("\n");
            }
        } else if (strcmp(cmd, "buy") == 0) {
            char code[8];
            scanf("%7s", code);
            int i = find(p, n, code);
            if (i < 0) printf("No product %s\n", code);
            else if (p[i].count == 0) printf("%s is sold out\n", p[i].name);
            else if (credit < p[i].price) {
                printf("%s costs ", p[i].name);
                money(p[i].price);
                printf(", credit ");
                money(credit);
                printf("\n");
            } else if (!give_change(credit - p[i].price)) {
                printf("Exact change only, ");
                money(credit);
                printf(" back\n");
                give_change(credit);
                credit = 0;
            } else {
                printf("Here is your %s\n", p[i].name);
                p[i].count--;
                p[i].sold++;
                earned += p[i].price;
                credit = 0;
            }
        } else if (strcmp(cmd, "refund") == 0) {
            if (credit == 0) printf("No credit\n");
            else {
                give_change(credit);
                credit = 0;
            }
        } else if (strcmp(cmd, "restock") == 0) {
            char code[8];
            int c;
            int got = scanf("%7s %d", code, &c);
            if (got != 2 || c < 1) {
                printf("Usage: restock <code> <count>\n");
                if (got == 1) scanf("%*s");
                continue;
            }
            int i = find(p, n, code);
            if (i < 0) printf("No product %s\n", code);
            else {
                p[i].count += c;
                printf("%s: %d left\n", p[i].name, p[i].count);
            }
        } else if (strcmp(cmd, "report") == 0) {
            for (int i = 0; i < n; i++)
                if (p[i].sold > 0) printf("%s: %d sold\n", p[i].name, p[i].sold);
            printf("Earned: ");
            money(earned);
            printf("\nCoins:");
            for (int i = 0; i < 4; i++) printf(" %dx%d", tube[i], coins[i]);
            printf("\n");
        } else {
            printf("Unknown command: %s\n", cmd);
        }
    }
    return 0;
}
```

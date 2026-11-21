#include <stdio.h>
#include <string.h>

struct operator { char name[16]; int jobs; };

int main(void) {
    int n;
    struct operator ops[100], t;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) scanf("%15s %d", ops[i].name, &ops[i].jobs);
    for (int i = 0; i < n; i++)
        for (int j = 0; j + 1 < n - i; j++)
            if (ops[j].jobs < ops[j + 1].jobs || (ops[j].jobs == ops[j + 1].jobs && strcmp(ops[j].name, ops[j + 1].name) > 0)) {
                t = ops[j]; ops[j] = ops[j + 1]; ops[j + 1] = t;
            }
    for (int i = 0; i < n; i++) printf("%d. %s %d\n", i + 1, ops[i].name, ops[i].jobs);
    return 0;
}

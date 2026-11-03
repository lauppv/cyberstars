#include <search.h>
#include <stdio.h>

struct Count {
    int value;
    int times;
};

static struct Count counts[30000];
static int out_n;

static int by_value(const void *x, const void *y) {
    int a = ((const struct Count *)x)->value, b = ((const struct Count *)y)->value;
    return (a > b) - (a < b);
}

static void print_in_order(const void *node, VISIT which, int depth) {
    (void)depth;
    if (which != postorder && which != leaf) return;
    const struct Count *c = *(struct Count *const *)node;
    for (int k = 0; k < c->times; k++) printf(out_n++ ? " %d" : "%d", c->value);
}

int main(void) {
    int n;
    void *tree = NULL;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < 1; j++) {
            counts[i].times = 1;
            scanf("%d", &counts[i].value);
            struct Count **found = tsearch(&counts[i], &tree, by_value);
            if (*found != &counts[i]) (*found)->times++;
        }
    }
    twalk(tree, print_in_order);
    putchar('\n');
    return 0;
}

```c
#include <stdio.h>
#include <stdlib.h>

struct nod {
    int valoare;
    struct nod *urmator;
};

struct nod *adauga(struct nod *cap, int valoare) {
    struct nod *n = malloc(sizeof(struct nod));
    n->valoare = valoare;
    n->urmator = cap;
    return n;
}

int main(void) {
    struct nod *cap = NULL;
    int x;
    while (scanf("%d", &x) == 1) {
        cap = adauga(cap, x);
    }

    for (struct nod *p = cap; p != NULL; p = p->urmator) {
        printf("%d -> ", p->valoare);
    }
    printf("NULL\n");

    int lungime = 0;
    int total = 0;
    for (struct nod *p = cap; p != NULL; p = p->urmator) {
        lungime++;
        total = total + p->valoare;
    }
    printf("Lungime: %d\n", lungime);
    printf("Total: %d\n", total);

    while (cap != NULL) {
        struct nod *urmator = cap->urmator;
        free(cap);
        cap = urmator;
    }
    return 0;
}
```

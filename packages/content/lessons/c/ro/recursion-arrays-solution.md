```c
#include <stdio.h>

int numara_peste(int v[], int n, int limita) {
    if (n == 0) {
        return 0;
    }
    int ultima = v[n - 1] > limita ? 1 : 0;
    return ultima + numara_peste(v, n - 1, limita);
}

int e_crescator(int v[], int n) {
    if (n <= 1) {
        return 1;
    }
    if (v[n - 1] < v[n - 2]) {
        return 0;
    }
    return e_crescator(v, n - 1);
}

int main(void) {
    int n, limita;
    int v[100];
    scanf("%d %d", &n, &limita);
    for (int i = 0; i < n; i++) {
        scanf("%d", &v[i]);
    }

    printf("Peste %d: %d\n", limita, numara_peste(v, n, limita));
    printf("Crescator: %s\n", e_crescator(v, n) ? "da" : "nu");
    return 0;
}
```

#include <stdio.h>
#include <string.h>

char names[100][50];
char phones[100][20];

void add_contact(char (*book)[50], int *count, const char *name, const char *phone) {
    strcpy(book[*count], name);
    strcpy(phones[*count], phone);
    (*count)++;
}

void find_contact(char (*book)[50], int count, const char *query) {
    for (int i = 0; i < count; i++) {
        if (strcmp(*(book + i), query) == 0) {
            printf("Found: %s - %s\n", book[i], phones[i]);
            return;
        }
    }
    printf("Not found: %s\n", query);
}

int main(void) {
    int count = 0, n, q;
    char a[50], b[20];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%49s %19s", a, b);
        add_contact(names, &count, a, b);
    }
    scanf("%d", &q);
    for (int i = 0; i < q; i++) {
        scanf("%49s", a);
        find_contact(names, count, a);
    }
    return 0;
}

#include <stdio.h>
#include <string.h>

typedef struct {
    char name[50];
    char phone[20];
} Contact;

void add_contact(Contact book[], int count[], const char name[], const char phone[]) {
    strcpy(book[count[0]].name, name);
    strcpy(book[count[0]].phone, phone);
    count[0]++;
}

void find_contact(Contact book[], int count, const char query[]) {
    for (int i = 0; i < count; i++) {
        if (strcmp(book[i].name, query) == 0) {
            printf("Found: %s - %s\n", book[i].name, book[i].phone);
            return;
        }
    }
    printf("Not found: %s\n", query);
}

int main(void) {
    Contact book[100];
    int count[1] = {0};
    int n, q;
    char a[50], b[20];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%49s %19s", a, b);
        add_contact(book, count, a, b);
    }
    scanf("%d", &q);
    for (int i = 0; i < q; i++) {
        scanf("%49s", a);
        find_contact(book, count[0], a);
    }
    return 0;
}

```c
#include <stdio.h>
#include <string.h>

typedef struct {
    char name[50];
    char phone[20];
} Contact;

void add_contact(Contact *book, int *count, const char *name, const char *phone) {
    strcpy((book + *count)->name, name);
    strcpy((book + *count)->phone, phone);
    *count += 1;
}

void find_contact(Contact *book, int count, const char *query) {
    for (int i = 0; i < count; i++) {
        if (strcmp((book + i)->name, query) == 0) {
            printf("Found: %s - %s\n", (book + i)->name, (book + i)->phone);
            return;
        }
    }
    printf("Not found: %s\n", query);
}

int main(void) {
    Contact book[100];
    int count = 0;

    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        char name[50], phone[20];
        scanf("%s %s", name, phone);
        add_contact(book, &count, name, phone);
    }

    int q;
    scanf("%d", &q);
    for (int i = 0; i < q; i++) {
        char query[50];
        scanf("%s", query);
        find_contact(book, count, query);
    }

    return 0;
}
```

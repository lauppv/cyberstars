#include <stdio.h>
#include <string.h>

typedef struct { char name[50]; char phone[20]; } Contact;

void add_contact(Contact *book, int *count, const char *name, const char *phone) {
    strcpy((book + *count)->name, name);
    strcpy((book + *count)->phone, phone);
    *count += 1;
}

void find_contact(Contact *book, int count, const char *query) {
    for (int i = 0; i < count; i++) {
        if (strncmp((book + i)->name, query, strlen(query)) == 0) {
            printf("Found: %s - %s\n", (book + i)->name, (book + i)->phone);
            return;
        }
    }
    printf("Not found: %s\n", query);
}

int main(void) {
    Contact book[100];
    int count = 0, n, q;
    char a[50], b[20];
    scanf("%d", &n);
    for (int i = 0; i < n; i++) { scanf("%s %s", a, b); add_contact(book, &count, a, b); }
    scanf("%d", &q);
    for (int i = 0; i < q; i++) { scanf("%s", a); find_contact(book, count, a); }
    return 0;
}

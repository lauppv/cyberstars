#include <stdio.h>
#include <string.h>

struct Contact {
    char name[50];
    char phone[20];
};
typedef struct Contact Contact;

void add_contact(Contact *book, int *count, const char *name, const char *phone) {
    Contact *slot = book + *count;
    strcpy(slot->name, name);
    strcpy(slot->phone, phone);
    *count = *count + 1;
}

void find_contact(Contact *book, int count, const char *query) {
    Contact *end = book + count;
    while (book < end && strcmp(book->name, query) != 0) book++;
    if (book == end) {
        printf("Not found: %s\n", query);
        return;
    }
    printf("Found: %s - %s\n", book->name, book->phone);
}

int main(void) {
    Contact all[100];
    int used = 0;
    int n;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        char a[50], b[20];
        scanf("%49s %19s", a, b);
        add_contact(all, &used, a, b);
    }
    int q;
    scanf("%d", &q);
    for (int i = 0; i < q; i++) {
        char a[50];
        scanf("%49s", a);
        find_contact(all, used, a);
    }
    return 0;
}

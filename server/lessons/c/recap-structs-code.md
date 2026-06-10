#include <stdio.h>
#include <string.h>

typedef struct {
    char name[50];
    char phone[20];
} Contact;

void add_contact(Contact *book, int *count, const char *name, const char *phone) {
}

void search_contact(Contact *book, int count, const char *query) {
}

int main(void) {
    Contact book[10];
    int count = 0;

    add_contact(book, &count, "Tommy", "0722111222");
    add_contact(book, &count, "Lance", "0733222333");
    add_contact(book, &count, "Ken", "0744333444");

    search_contact(book, count, "Lance");
    search_contact(book, count, "Diaz");

    return 0;
}

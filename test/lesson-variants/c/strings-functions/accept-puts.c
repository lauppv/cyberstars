#include <stdio.h>
#include <string.h>

int main(void) {
    char left[32], right[32], label[64];
    scanf("%31s", left);
    scanf("%31s", right);
    printf("%zu\n", strlen(left));
    strcpy(label, left);
    strcat(label, right);
    puts(label);
    return 0;
}

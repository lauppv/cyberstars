#include <stdio.h>

int main(void) {
    char operator_name[100];
    int age_now = 0;
    scanf("%99s", operator_name);
    scanf("%d", &age_now);
    printf("Hello %s, ", operator_name);
    printf("you are %d years old. ", age_now);
    printf("Next year you will be %d\n", ++age_now);
    return 0;
}

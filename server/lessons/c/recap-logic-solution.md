```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char password[64];
    scanf("%s", password);

    int has_length = strlen(password) >= 8;
    int has_uppercase = 0;
    int has_digit = 0;
    int has_special = 0;

    for (int i = 0; i < (int) strlen(password); i++) {
        char c = password[i];
        if (c >= 'A' && c <= 'Z') {
            has_uppercase = 1;
        }
        if (c >= '0' && c <= '9') {
            has_digit = 1;
        }
        if (c == '!' || c == '@' || c == '#') {
            has_special = 1;
        }
    }

    printf("Length >= 8: %s\n", has_length ? "PASS" : "FAIL");
    printf("Has uppercase: %s\n", has_uppercase ? "PASS" : "FAIL");
    printf("Has digit: %s\n", has_digit ? "PASS" : "FAIL");
    printf("Has special char: %s\n", has_special ? "PASS" : "FAIL");

    int valid = has_length && has_uppercase && has_digit && has_special;
    printf("Password valid: %s\n", valid ? "YES" : "NO");

    return 0;
}
```

#include <stdio.h>
#include <string.h>

int main(void) {
    char p[64];
    scanf("%s", p);
    int len = strlen(p) >= 8, up = 0, dig = 0, sp = 0;
    for (int i = 0; p[i]; i++) {
        if (p[i] >= 'A' && p[i] <= 'Z') up = 1;
        if (p[i] >= '0' && p[i] <= '9') dig = 1;
        if (p[i] == '!' || p[i] == '@') sp = 1;
    }
    printf("Length >= 8: %s\n", len ? "PASS" : "FAIL");
    printf("Has uppercase: %s\n", up ? "PASS" : "FAIL");
    printf("Has digit: %s\n", dig ? "PASS" : "FAIL");
    printf("Has special char: %s\n", sp ? "PASS" : "FAIL");
    printf("Password valid: %s\n", len && up && dig && sp ? "YES" : "NO");
    return 0;
}

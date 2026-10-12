#include <stdio.h>
#include <string.h>
#include <ctype.h>

int main(void) {
    char word[64];
    scanf("%s", word);
    int len = strlen(word);
    int up = 0, dig = 0, sp = 0;
    for (char *c = word; *c; c++) {
        up |= isupper((unsigned char)*c) != 0;
        dig |= isdigit((unsigned char)*c) != 0;
        sp |= strchr("!@#", *c) != NULL;
    }
    int all = len >= 8 && up && dig && sp;
    printf("Length >= 8: %s\nHas uppercase: %s\nHas digit: %s\nHas special char: %s\nPassword valid: %s\n",
           len >= 8 ? "PASS" : "FAIL", up ? "PASS" : "FAIL", dig ? "PASS" : "FAIL",
           sp ? "PASS" : "FAIL", all ? "YES" : "NO");
    return 0;
}

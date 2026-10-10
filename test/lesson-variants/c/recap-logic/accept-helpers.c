#include <stdio.h>
#include <string.h>

static int any_in_range(const char *s, char lo, char hi) {
    for (size_t i = 0; i < strlen(s); i++)
        if (s[i] >= lo && s[i] <= hi) return 1;
    return 0;
}

static int any_special(const char *s) {
    for (size_t i = 0; s[i] != '\0'; i++)
        if (s[i] == '!' || s[i] == '@' || s[i] == '#') return 1;
    return 0;
}

static const char *verdict(int ok) { return ok ? "PASS" : "FAIL"; }

int main(void) {
    char pw[64];
    scanf("%63s", pw);
    int checks[4] = {
        strlen(pw) >= 8, any_in_range(pw, 'A', 'Z'), any_in_range(pw, '0', '9'), any_special(pw)
    };
    printf("Length >= 8: %s\n", verdict(checks[0]));
    printf("Has uppercase: %s\n", verdict(checks[1]));
    printf("Has digit: %s\n", verdict(checks[2]));
    printf("Has special char: %s\n", verdict(checks[3]));
    printf("Password valid: %s\n", checks[0] && checks[1] && checks[2] && checks[3] ? "YES" : "NO");
    return 0;
}

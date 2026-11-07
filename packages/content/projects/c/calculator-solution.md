```c
#include <stdio.h>
#include <string.h>
#include <ctype.h>

#define MAX 256
#define VARS 26

long long values[MAX];
int nv;
char ops[MAX];
int no;
long long var[VARS];
int has_var[VARS];
long long ans = 0;
const char *error;

int prec(char op) {
    if (op == 'u') return 3;
    if (op == '*' || op == '/' || op == '%') return 2;
    if (op == '+' || op == '-') return 1;
    return 0;
}

void apply(void) {
    char op = ops[--no];
    if (op == 'u') {
        if (nv < 1) { error = "missing number"; return; }
        values[nv - 1] = -values[nv - 1];
        return;
    }
    if (nv < 2) { error = "missing number"; return; }
    long long b = values[--nv], a = values[--nv];
    if ((op == '/' || op == '%') && b == 0) { error = "division by zero"; return; }
    long long r = op == '+' ? a + b : op == '-' ? a - b : op == '*' ? a * b : op == '/' ? a / b : a % b;
    values[nv++] = r;
}

/* evaluates text; returns 1 and sets *out, or 0 with error set */
int evaluate(const char *s, long long *out) {
    nv = no = 0;
    error = NULL;
    int expect_value = 1;
    for (int i = 0; s[i] && !error;) {
        char c = s[i];
        if (c == ' ' || c == '\t') { i++; continue; }
        if (isdigit((unsigned char)c)) {
            if (!expect_value) { error = "missing operator"; break; }
            long long v = 0;
            while (isdigit((unsigned char)s[i])) v = v * 10 + (s[i++] - '0');
            values[nv++] = v;
            expect_value = 0;
        } else if (isalpha((unsigned char)c)) {
            if (!expect_value) { error = "missing operator"; break; }
            char name[32];
            int k = 0;
            while (isalnum((unsigned char)s[i]) && k < 31) name[k++] = s[i++];
            name[k] = '\0';
            if (strcmp(name, "ans") == 0) values[nv++] = ans;
            else if (k == 1 && islower((unsigned char)name[0]) && has_var[name[0] - 'a']) values[nv++] = var[name[0] - 'a'];
            else { error = "unknown name"; break; }
            expect_value = 0;
        } else if (c == '(') {
            if (!expect_value) { error = "missing operator"; break; }
            ops[no++] = '(';
            i++;
        } else if (c == ')') {
            if (expect_value) { error = "missing number"; break; }
            while (no > 0 && ops[no - 1] != '(' && !error) apply();
            if (error) break;
            if (no == 0) { error = "unbalanced brackets"; break; }
            no--;
            i++;
        } else if (strchr("+-*/%", c)) {
            if (expect_value) {
                if (c != '-') { error = "missing number"; break; }
                ops[no++] = 'u';
                i++;
                continue;
            }
            while (no > 0 && ops[no - 1] != '(' && prec(ops[no - 1]) >= prec(c) && !error) apply();
            ops[no++] = c;
            expect_value = 1;
            i++;
        } else {
            error = "unexpected character";
        }
    }
    if (!error && expect_value) error = "missing number";
    while (!error && no > 0) {
        if (ops[no - 1] == '(') { error = "unbalanced brackets"; break; }
        apply();
    }
    if (error) return 0;
    *out = values[0];
    return 1;
}

int main(void) {
    char line[MAX];
    while (fgets(line, sizeof line, stdin)) {
        line[strcspn(line, "\n")] = '\0';
        char *s = line;
        while (*s == ' ') s++;
        if (*s == '\0') continue;
        if (strcmp(s, "quit") == 0) break;
        int target = -1;
        if (islower((unsigned char)s[0]) && !isalnum((unsigned char)s[1])) {
            char *eq = s + 1;
            while (*eq == ' ') eq++;
            if (*eq == '=') {
                target = s[0] - 'a';
                s = eq + 1;
            }
        }
        long long r;
        if (!evaluate(s, &r)) {
            printf("Error: %s\n", error);
            continue;
        }
        ans = r;
        if (target >= 0) {
            var[target] = r;
            has_var[target] = 1;
            printf("%c = %lld\n", 'a' + target, r);
        } else {
            printf("= %lld\n", r);
        }
    }
    printf("Bye\n");
    return 0;
}
```

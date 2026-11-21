#include <stdio.h>
#include <string.h>
#include <ctype.h>

int main(void) {
    char line[128];
    fgets(line, sizeof(line), stdin);
    line[strcspn(line, "\n")] = '\0';
    int sum = 0;
    for (int i = 0; line[i] != '\0'; i++) {
        line[i] = toupper(line[i]);
        if (line[i] >= '0' && line[i] <= '9') sum += line[i] - '0';
    }
    printf("%s\nDigit sum: %d\n", line, sum);
    return 0;
}

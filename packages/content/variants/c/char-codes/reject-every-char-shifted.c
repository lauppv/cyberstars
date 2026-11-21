#include <stdio.h>
#include <string.h>

int main(void) {
    char line[128];
    fgets(line, sizeof(line), stdin);
    line[strcspn(line, "\n")] = '\0';
    int sum = 0;
    for (int i = 0; line[i] != '\0'; i++) {
        if (line[i] >= '0' && line[i] <= '9') sum += line[i] - '0';
        else if (line[i] >= 'a') line[i] = line[i] - 32;
    }
    printf("%s\nDigit sum: %d\n", line, sum);
    return 0;
}

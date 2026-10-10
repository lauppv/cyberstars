#include <stdio.h>
#include <string.h>

void run_command(const char *command) {
    if (strcmp(command, "time") == 0) printf("12:04\n");
    else if (strcmp(command, "space") == 0) printf("128K free\n");
    else printf("Unknown command: %s\n", command);
    printf("Done\n");
}

int main(void) {
    char command[50];
    while (scanf("%49s", command) == 1) {
        if (strcmp(command, "exit") == 0) break;
        run_command(command);
    }
    return 0;
}

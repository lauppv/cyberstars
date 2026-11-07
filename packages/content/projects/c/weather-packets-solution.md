```c
#include <stdio.h>
#include <string.h>

/* bits 31-28 station, 27-18 temperature (tenths + 400), 17-11 humidity, 10-3 wind, 2 rain, 1 battery low, 0 sensor error */

struct Station {
    int packets;
    double tmin, tmax;
    int rain;
};

struct Station st[16];

void binary(unsigned int p) {
    for (int b = 31; b >= 0; b--) {
        printf("%u", (p >> b) & 1u);
        if (b == 28 || b == 18 || b == 11 || b == 3) printf(" ");
    }
    printf("\n");
}

int main(void) {
    char cmd[32];
    int count = 0;
    printf("Receiver on\n");
    while (scanf("%31s", cmd) == 1) {
        if (strcmp(cmd, "quit") == 0) {
            printf("Receiver off\n");
            break;
        } else if (strcmp(cmd, "packet") == 0) {
            unsigned int p;
            if (scanf("%x", &p) != 1) {
                printf("Usage: packet <hex>\n");
                scanf("%*[^\n]");
                continue;
            }
            unsigned int id = p >> 28;
            unsigned int raw_t = (p >> 18) & 0x3FF;
            unsigned int hum = (p >> 11) & 0x7F;
            unsigned int wind = (p >> 3) & 0xFF;
            double temp = raw_t / 10.0 - 40.0;
            count++;
            printf("Packet %d from station %u\n", count, id);
            binary(p);
            if (hum > 100) {
                printf("Rejected: humidity %u\n", hum);
                continue;
            }
            if (p & 1u) {
                printf("Rejected: sensor error\n");
                continue;
            }
            printf("Temperature %.1f C, humidity %u%%, wind %u km/h\n", temp, hum, wind);
            if (p & 4u) printf("Raining\n");
            if (p & 2u) printf("Battery low\n");
            struct Station *s = &st[id];
            if (s->packets == 0 || temp < s->tmin) s->tmin = temp;
            if (s->packets == 0 || temp > s->tmax) s->tmax = temp;
            s->packets++;
            if (p & 4u) s->rain++;
        } else if (strcmp(cmd, "stations") == 0) {
            int any = 0;
            for (int i = 0; i < 16; i++)
                if (st[i].packets) {
                    any = 1;
                    printf("Station %d: %d %s, %.1f to %.1f C, rain in %d\n", i, st[i].packets,
                           st[i].packets == 1 ? "packet" : "packets", st[i].tmin, st[i].tmax, st[i].rain);
                }
            if (!any) printf("No packets yet\n");
        } else if (strcmp(cmd, "encode") == 0) {
            unsigned int id, hum, wind, rain, battery;
            double temp;
            if (scanf("%u %lf %u %u %u %u", &id, &temp, &hum, &wind, &rain, &battery) != 6) {
                printf("Usage: encode <station> <temperature> <humidity> <wind> <rain> <battery>\n");
                scanf("%*[^\n]");
                continue;
            }
            int raw_t = (int)(temp * 10 + (temp < 0 ? -0.5 : 0.5)) + 400;
            if (id > 15 || raw_t < 0 || raw_t > 1023 || hum > 100 || wind > 255 || rain > 1 || battery > 1) {
                printf("Out of range\n");
                continue;
            }
            unsigned int p = id << 28 | (unsigned int)raw_t << 18 | hum << 11 | wind << 3 | rain << 2 | battery << 1;
            printf("0x%08X\n", p);
        } else {
            printf("Unknown command: %s\n", cmd);
            scanf("%*[^\n]");
        }
    }
    return 0;
}
```

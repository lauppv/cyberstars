```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int w, h, maxv;
int *px;

int *at(int *img, int width, int x, int y) { return &img[y * width + x]; }

void show(void) {
    const char *shades = ".,:-=+*#%@";
    for (int y = 0; y < h; y++) {
        for (int x = 0; x < w; x++) printf("%c", shades[*at(px, w, x, y) * 9 / maxv]);
        printf("\n");
    }
}

int clamp(int v) { return v < 0 ? 0 : v > maxv ? maxv : v; }

int main(void) {
    char magic[3];
    if (scanf("%2s %d %d %d", magic, &w, &h, &maxv) != 4 || strcmp(magic, "P2") != 0) {
        printf("Not a P2 image\n");
        return 0;
    }
    px = malloc(sizeof(int) * w * h);
    for (int i = 0; i < w * h; i++)
        if (scanf("%d", &px[i]) != 1) {
            printf("The image ends too soon\n");
            free(px);
            return 0;
        }
    printf("Image %dx%d, max %d\n", w, h, maxv);
    char cmd[32];
    while (scanf("%31s", cmd) == 1) {
        if (strcmp(cmd, "quit") == 0) {
            printf("Bye\n");
            break;
        } else if (strcmp(cmd, "show") == 0) {
            show();
        } else if (strcmp(cmd, "invert") == 0) {
            for (int i = 0; i < w * h; i++) px[i] = maxv - px[i];
            printf("Inverted\n");
        } else if (strcmp(cmd, "brighten") == 0) {
            int d;
            if (scanf("%d", &d) != 1) {
                printf("Usage: brighten <amount>\n");
                scanf("%*[^\n]");
                continue;
            }
            int clipped = 0;
            for (int i = 0; i < w * h; i++) {
                int v = px[i] + d;
                if (v != clamp(v)) clipped++;
                px[i] = clamp(v);
            }
            printf("Brightened by %d, %d pixels clipped\n", d, clipped);
        } else if (strcmp(cmd, "flip") == 0) {
            for (int y = 0; y < h; y++)
                for (int x = 0; x < w / 2; x++) {
                    int t = *at(px, w, x, y);
                    *at(px, w, x, y) = *at(px, w, w - 1 - x, y);
                    *at(px, w, w - 1 - x, y) = t;
                }
            printf("Flipped\n");
        } else if (strcmp(cmd, "rotate") == 0) {
            int *out = malloc(sizeof(int) * w * h);
            /* clockwise: the new image is h wide and w tall; old (x, y) goes to (h - 1 - y, x) */
            for (int y = 0; y < h; y++)
                for (int x = 0; x < w; x++) *at(out, h, h - 1 - y, x) = *at(px, w, x, y);
            free(px);
            px = out;
            int t = w;
            w = h;
            h = t;
            printf("Rotated, now %dx%d\n", w, h);
        } else if (strcmp(cmd, "crop") == 0) {
            int x0, y0, cw, ch;
            if (scanf("%d %d %d %d", &x0, &y0, &cw, &ch) != 4) {
                printf("Usage: crop <x> <y> <width> <height>\n");
                scanf("%*[^\n]");
                continue;
            }
            if (x0 < 0 || y0 < 0 || cw < 1 || ch < 1 || x0 + cw > w || y0 + ch > h) {
                printf("That doesn't fit in %dx%d\n", w, h);
                continue;
            }
            int *out = malloc(sizeof(int) * cw * ch);
            for (int y = 0; y < ch; y++)
                for (int x = 0; x < cw; x++) *at(out, cw, x, y) = *at(px, w, x0 + x, y0 + y);
            free(px);
            px = out;
            w = cw;
            h = ch;
            printf("Cropped to %dx%d\n", w, h);
        } else if (strcmp(cmd, "blur") == 0) {
            int *out = malloc(sizeof(int) * w * h);
            for (int y = 0; y < h; y++)
                for (int x = 0; x < w; x++) {
                    int sum = 0, count = 0;
                    for (int dy = -1; dy <= 1; dy++)
                        for (int dx = -1; dx <= 1; dx++) {
                            int nx = x + dx, ny = y + dy;
                            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                                sum += *at(px, w, nx, ny);
                                count++;
                            }
                        }
                    *at(out, w, x, y) = sum / count;
                }
            free(px);
            px = out;
            printf("Blurred\n");
        } else if (strcmp(cmd, "stats") == 0) {
            int lo = maxv, hi = 0, buckets[4] = {0, 0, 0, 0};
            long sum = 0;
            for (int i = 0; i < w * h; i++) {
                if (px[i] < lo) lo = px[i];
                if (px[i] > hi) hi = px[i];
                sum += px[i];
                buckets[px[i] * 4 / (maxv + 1)]++;
            }
            printf("Darkest %d, brightest %d, average %ld\n", lo, hi, sum / (w * h));
            const char *names[4] = {"dark", "dim", "light", "bright"};
            for (int b = 0; b < 4; b++) printf("%s: %d\n", names[b], buckets[b]);
        } else if (strcmp(cmd, "save") == 0) {
            char file[64];
            scanf("%63s", file);
            FILE *f = fopen(file, "w");
            if (!f) {
                printf("Cannot write %s\n", file);
                continue;
            }
            fprintf(f, "P2\n%d %d\n%d\n", w, h, maxv);
            for (int y = 0; y < h; y++)
                for (int x = 0; x < w; x++) fprintf(f, "%d%c", *at(px, w, x, y), x == w - 1 ? '\n' : ' ');
            fclose(f);
            printf("Saved %s\n", file);
        } else if (strcmp(cmd, "cat") == 0) {
            char file[64], line[512];
            scanf("%63s", file);
            FILE *f = fopen(file, "r");
            if (!f) {
                printf("Cannot read %s\n", file);
                continue;
            }
            while (fgets(line, sizeof line, f)) printf("%s", line);
            fclose(f);
        } else {
            printf("Unknown command: %s\n", cmd);
            scanf("%*[^\n]");
        }
    }
    free(px);
    return 0;
}
```

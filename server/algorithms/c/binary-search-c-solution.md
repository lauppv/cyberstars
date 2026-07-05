```c
#include <stdio.h>

int main(void) {
    int n;
    scanf("%d", &n);

    int arr[1000];
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    int target;
    scanf("%d", &target);

    // We keep two pointers: left and right. Each step we cut the range in half.
    int left = 0;
    int right = n - 1;
    int result = -1;

    while (left <= right) {
        // left + (right - left) / 2 avoids the overflow that would happen
        // with (left + right) / 2 for very large numbers.
        int mid = left + (right - left) / 2;

        if (arr[mid] == target) {
            result = mid;
            break;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    printf("%d\n", result);
    return 0;
}
```

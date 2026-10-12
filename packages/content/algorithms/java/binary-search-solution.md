```java
import java.util.Scanner;

public class Main {
    static int binarySearch(int[] arr, int target) {
        // We keep two pointers: low and high. Each step we cut the range in half.
        int low = 0;
        int high = arr.length - 1;

        while (low <= high) {
            int mid = (low + high) / 2;

            if (arr[mid] == target) {
                return mid;
            } else if (arr[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }

        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = Integer.parseInt(sc.nextLine());

        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = Integer.parseInt(sc.nextLine());
        }

        int target = Integer.parseInt(sc.nextLine());

        System.out.println(binarySearch(arr, target));
    }
}
```

```java
import java.util.Scanner;

public class Main {
    static void bubbleSort(int[] arr) {
        int n = arr.length;

        // On each pass, the largest element "bubbles up" to the end.
        // After i passes, the last i positions are already sorted.
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    int tmp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = tmp;
                }
            }
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = Integer.parseInt(sc.nextLine());

        int[] arr = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = Integer.parseInt(sc.nextLine());
        }

        bubbleSort(arr);

        // Build the output manually, separated by spaces.
        String out = "";
        for (int i = 0; i < n; i++) {
            out = out + arr[i];
            if (i < n - 1) {
                out = out + " ";
            }
        }
        System.out.println(out);
    }
}
```

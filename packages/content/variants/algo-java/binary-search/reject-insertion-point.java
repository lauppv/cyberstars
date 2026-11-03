import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = in.nextInt();
        int target = in.nextInt();
        int low = 0, high = n - 1;
        while (low <= high) {
            int mid = (low + high) / 2;
            if (a[mid] == target) {
                low = mid;
                break;
            } else if (a[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        System.out.println(low);
    }
}

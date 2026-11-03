import java.util.*;

public class Main {
    static int find(int[] a, int target, int lo, int hi) {
        if (lo > hi) return -1;
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == target) return mid;
        return a[mid] < target ? find(a, target, mid + 1, hi) : find(a, target, lo, mid - 1);
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = in.nextInt();
        System.out.println(find(a, in.nextInt(), 0, n - 1));
    }
}

import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = in.nextInt();
        boolean swapped = true;
        for (int end = n - 1; swapped && end > 0; end--) {
            swapped = false;
            for (int j = 0; j < end; j++) {
                if (a[j] > a[j + 1]) {
                    int t = a[j];
                    a[j] = a[j + 1];
                    a[j + 1] = t;
                    swapped = true;
                }
            }
        }
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < n; i++) out.append(i > 0 ? " " : "").append(a[i]);
        System.out.println(out);
    }
}

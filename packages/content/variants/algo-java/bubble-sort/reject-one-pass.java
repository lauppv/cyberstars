import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = in.nextInt();
        for (int pass = 0; pass < 1; pass++) {
            for (int j = 0; j < n - 1; j++) {
                if (a[j] > a[j + 1]) {
                    int t = a[j];
                    a[j] = a[j + 1];
                    a[j + 1] = t;
                }
            }
        }
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < n; i++) out.append(i > 0 ? " " : "").append(a[i]);
        System.out.println(out);
    }
}

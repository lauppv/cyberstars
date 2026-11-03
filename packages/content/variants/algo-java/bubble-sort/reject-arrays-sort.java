import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < 1; j++) a[i] = in.nextInt();
        }
        Arrays.sort(a);
        StringBuilder out = new StringBuilder();
        for (int i = 0; i < n; i++) out.append(i > 0 ? " " : "").append(a[i]);
        System.out.println(out);
    }
}

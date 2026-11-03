import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = in.nextInt();
        int at = Arrays.binarySearch(a, in.nextInt());
        System.out.println(at < 0 ? -1 : at);
    }
}

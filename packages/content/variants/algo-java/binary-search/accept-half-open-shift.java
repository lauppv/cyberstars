import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader r = new BufferedReader(new InputStreamReader(System.in));
        int n = Integer.parseInt(r.readLine().trim());
        int[] values = new int[n];
        for (int i = 0; i < n; i++) values[i] = Integer.parseInt(r.readLine().trim());
        int target = Integer.parseInt(r.readLine().trim());
        int low = 0, high = n;
        while (low < high) {
            int mid = (low + high) >>> 1;
            if (values[mid] < target) low = mid + 1;
            else high = mid;
        }
        System.out.println(low < n && values[low] == target ? low : -1);
    }
}

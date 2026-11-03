import java.io.*;

public class Main {
    static boolean mirrored(String digits) {
        for (int i = 0, j = digits.length() - 1; i < j; i++, j--) {
            if (digits.charAt(i) != digits.charAt(j)) return false;
        }
        return true;
    }

    public static void main(String[] args) throws IOException {
        long value = Long.parseLong(new BufferedReader(new InputStreamReader(System.in)).readLine().trim());
        System.out.println(value >= 0 && mirrored(Long.toString(value)));
    }
}

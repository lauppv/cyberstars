public class Main {
    static int search(String code, int length, int target) {
        if (code.length() == length) {
            int sum = 0;
            for (int i = 0; i < code.length(); i++) sum += code.charAt(i) - '0';
            if (sum == target) {
                System.out.println(code);
                return 1;
            }
            return 0;
        }
        int total = 0;
        for (char c = '0'; c <= '9'; c++) total += search(code + c, length, target);
        return total;
    }

    public static void main(String[] args) {
        int length = 2;
        int target = 3;
        System.out.println("Found: " + search("", length, target));
    }
}

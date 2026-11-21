public class Main {
    public static void main(String[] args) {
        int length = 2;
        int target = 3;
        int limit = (int) Math.pow(10, length);
        int found = 0;
        for (int n = 0; n < limit; n++) {
            int sum = 0;
            int left = n;
            for (int i = 0; i < length; i++) {
                sum += left % 10;
                left /= 10;
            }
            if (sum == target) {
                System.out.println(String.format("%0" + length + "d", n));
                found++;
            }
        }
        System.out.println("Found: " + found);
    }
}

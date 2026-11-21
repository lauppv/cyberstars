public class Main {
    static int crack(String prefix, int digitsLeft, int sumLeft) {
        if (digitsLeft == 0) {
            if (sumLeft == 0) {
                System.out.println(Integer.parseInt(prefix));
                return 1;
            }
            return 0;
        }
        int found = 0;
        for (int d = 0; d <= 9; d++) found += crack(prefix + d, digitsLeft - 1, sumLeft - d);
        return found;
    }

    public static void main(String[] args) {
        int length = 2;
        int target = 3;
        System.out.println("Found: " + crack("", length, target));
    }
}

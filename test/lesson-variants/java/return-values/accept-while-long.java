public class Main {
    static long stashAfter(int f, int n) {
        long stash = 1;
        while (n > 0) {
            stash *= f;
            n--;
        }
        return stash;
    }

    public static void main(String[] args) {
        int factor = 2;
        int days = 3;

        long total = stashAfter(factor, days);
        System.out.println(total);
    }
}

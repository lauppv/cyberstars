public class Main {
    static void open(int n) {
        if (n == 0) {
            System.out.println("Found the cash!");
            return;
        }
        System.out.println("Opening box " + n);
        System.out.println("Closing box " + n);
        open(n - 1);
    }

    public static void main(String[] args) {
        int boxes = 3;
        open(boxes);
    }
}

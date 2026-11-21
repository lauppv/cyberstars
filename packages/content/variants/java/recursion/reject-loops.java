public class Main {
    static void open(int n) {
        for (int i = n; i >= 1; i--) System.out.println("Opening box " + i);
        System.out.println("Found the cash!");
        for (int i = 1; i <= n; i++) System.out.println("Closing box " + i);
    }

    public static void main(String[] args) {
        int boxes = 3;
        open(boxes);
    }
}

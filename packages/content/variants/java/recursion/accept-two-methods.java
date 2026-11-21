public class Main {
    static void open(int left) {
        if (left > 0) {
            System.out.println("Opening box " + left);
            open(left - 1);
            System.out.println("Closing box " + left);
        } else {
            System.out.println("Found the cash!");
        }
    }

    public static void main(String[] args) {
        int boxes = 3;
        open(boxes);
    }
}

interface Discount {
    int apply(int price);
}

public class Main {
    public static void main(String[] args) {
        int price = 90;
        int coupon = 20;
        Discount half = new Discount() {
            public int apply(int p) { return p / 2; }
        };
        Discount minus = new Discount() {
            public int apply(int p) { return p - coupon; }
        };
        System.out.println("Half: " + half.apply(price));
        System.out.println("Coupon: " + minus.apply(price));
        System.out.println("Best: " + Math.min(half.apply(price), minus.apply(price)));
    }
}

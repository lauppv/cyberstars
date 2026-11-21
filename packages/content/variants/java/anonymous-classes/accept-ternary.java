interface Discount {
    int apply(int price);
}

public class Main {
    public static void main(String[] args) {
        int price = 90;
        int coupon = 20;
        Discount half = new Discount() {
            @Override
            public int apply(int price) {
                return price / 2;
            }
        };
        Discount minus = new Discount() {
            @Override
            public int apply(int price) {
                int left = price - coupon;
                return left < 0 ? 0 : left;
            }
        };
        System.out.println("Half: " + half.apply(price));
        System.out.println("Coupon: " + minus.apply(price));
        System.out.println("Best: " + Math.min(half.apply(price), minus.apply(price)));
    }
}

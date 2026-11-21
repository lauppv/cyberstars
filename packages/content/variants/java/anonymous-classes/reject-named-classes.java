interface Discount {
    int apply(int price);
}

class Half implements Discount {
    public int apply(int price) { return price / 2; }
}

class Minus implements Discount {
    int coupon;
    Minus(int coupon) { this.coupon = coupon; }
    public int apply(int price) { return Math.max(price - coupon, 0); }
}

public class Main {
    public static void main(String[] args) {
        int price = 90;
        int coupon = 20;
        Discount half = new Half();
        Discount minus = new Minus(coupon);
        System.out.println("Half: " + half.apply(price));
        System.out.println("Coupon: " + minus.apply(price));
        System.out.println("Best: " + Math.min(half.apply(price), minus.apply(price)));
    }
}

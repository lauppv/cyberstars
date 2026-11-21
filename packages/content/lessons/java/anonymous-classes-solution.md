```java
interface Discount {
    int apply(int price);
}

public class Main {
    public static void main(String[] args) {
        int price = 90;
        int coupon = 20;

        Discount half = new Discount() {
            public int apply(int p) {
                return p / 2;
            }
        };
        Discount minus = new Discount() {
            public int apply(int p) {
                return Math.max(p - coupon, 0);
            }
        };
        int a = half.apply(price);
        int b = minus.apply(price);
        System.out.println("Half: " + a);
        System.out.println("Coupon: " + b);
        System.out.println("Best: " + Math.min(a, b));
    }
}
```

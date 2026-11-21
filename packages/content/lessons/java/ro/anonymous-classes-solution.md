```java
interface Reducere {
    int aplica(int pret);
}

public class Main {
    public static void main(String[] args) {
        int pret = 90;
        int cupon = 20;

        Reducere jumatate = new Reducere() {
            public int aplica(int p) {
                return p / 2;
            }
        };
        Reducere minus = new Reducere() {
            public int aplica(int p) {
                return Math.max(p - cupon, 0);
            }
        };
        int a = jumatate.aplica(pret);
        int b = minus.aplica(pret);
        System.out.println("Jumatate: " + a);
        System.out.println("Cupon: " + b);
        System.out.println("Cel mai bun: " + Math.min(a, b));
    }
}
```

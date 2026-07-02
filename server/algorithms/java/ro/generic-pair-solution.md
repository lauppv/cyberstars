```java
import java.util.Scanner;

class Pereche<A, B> {
    private final A prim;
    private final B secund;

    Pereche(A prim, B secund) {
        this.prim = prim;
        this.secund = secund;
    }

    A getFirst() {
        return prim;
    }

    B getSecond() {
        return secund;
    }

    Pereche<B, A> swap() {
        return new Pereche<>(secund, prim);
    }

    @Override
    public String toString() {
        return "(" + prim + ", " + secund + ")";
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String sir = sc.nextLine().trim();
        int numar = Integer.parseInt(sc.nextLine().trim());
        Pereche<String, Integer> pereche = new Pereche<>(sir, numar);
        Pereche<Integer, String> interschimbata = pereche.swap();
        System.out.println(pereche);
        System.out.println(interschimbata);
    }
}
```

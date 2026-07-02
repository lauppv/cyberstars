```java
import java.util.Scanner;

class Contor {
    private int valoare = 0;

    void increment() {
        valoare++;
    }

    void decrement() {
        valoare--;
    }

    int getValue() {
        return valoare;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        Contor contor = new Contor();
        for (int i = 0; i < n; i++) {
            String comanda = sc.nextLine().trim();
            switch (comanda) {
                case "inc":
                    contor.increment();
                    break;
                case "dec":
                    contor.decrement();
                    break;
                case "get":
                    System.out.println(contor.getValue());
                    break;
            }
        }
    }
}
```

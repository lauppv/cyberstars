```java
import java.util.Scanner;

class Contor {
    private int valoare = 0;

    void creste() {
        valoare = valoare + 1;
    }

    void scade() {
        valoare = valoare - 1;
    }

    int getValoare() {
        return valoare;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = Integer.parseInt(sc.nextLine());

        Contor contor = new Contor();

        for (int i = 0; i < n; i++) {
            String comanda = sc.nextLine();

            if (comanda.equals("creste")) {
                contor.creste();
            } else if (comanda.equals("scade")) {
                contor.scade();
            } else {
                System.out.println(contor.getValoare());
            }
        }
    }
}
```

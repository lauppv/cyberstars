```java
import java.util.Scanner;

class Nod {
    int valoare;
    Nod urmator;

    Nod(int valoare) {
        this.valoare = valoare;
    }
}

class ListaInlantuita {
    private Nod cap;

    void adauga(int valoare) {
        Nod nod = new Nod(valoare);
        if (cap == null) {
            cap = nod;
            return;
        }
        Nod cur = cap;
        while (cur.urmator != null) {
            cur = cur.urmator;
        }
        cur.urmator = nod;
    }

    boolean elimina(int valoare) {
        if (cap == null) {
            return false;
        }
        if (cap.valoare == valoare) {
            cap = cap.urmator;
            return true;
        }
        Nod cur = cap;
        while (cur.urmator != null) {
            if (cur.urmator.valoare == valoare) {
                cur.urmator = cur.urmator.urmator;
                return true;
            }
            cur = cur.urmator;
        }
        return false;
    }

    String afiseaza() {
        if (cap == null) {
            return "Empty";
        }
        StringBuilder sb = new StringBuilder();
        Nod cur = cap;
        while (cur != null) {
            if (sb.length() > 0) {
                sb.append(" -> ");
            }
            sb.append(cur.valoare);
            cur = cur.urmator;
        }
        return sb.toString();
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        ListaInlantuita lista = new ListaInlantuita();
        for (int i = 0; i < n; i++) {
            String linie = sc.nextLine().trim();
            String[] parti = linie.split("\\s+");
            switch (parti[0]) {
                case "add":
                    lista.adauga(Integer.parseInt(parti[1]));
                    break;
                case "remove":
                    int valoare = Integer.parseInt(parti[1]);
                    if (!lista.elimina(valoare)) {
                        System.out.println("Not found");
                    }
                    break;
                case "print":
                    System.out.println(lista.afiseaza());
                    break;
            }
        }
    }
}
```

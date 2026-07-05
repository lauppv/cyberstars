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

        // Lista goala: nodul nou devine capul.
        if (cap == null) {
            cap = nod;
            return;
        }

        // Mergem pana la ultimul nod si legam noul nod dupa el.
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

        // Caz special: valoarea de eliminat este chiar in cap.
        if (cap.valoare == valoare) {
            cap = cap.urmator;
            return true;
        }

        // Cautam nodul care are ca urmator un nod cu valoarea data.
        // Cand il gasim, il ocolim: cur.urmator = cur.urmator.urmator.
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
            return "Goala";
        }

        String rezultat = "";
        Nod cur = cap;
        while (cur != null) {
            if (rezultat.length() > 0) {
                rezultat = rezultat + " -> ";
            }
            rezultat = rezultat + cur.valoare;
            cur = cur.urmator;
        }
        return rezultat;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = Integer.parseInt(sc.nextLine());

        ListaInlantuita lista = new ListaInlantuita();

        for (int i = 0; i < n; i++) {
            String comanda = sc.nextLine();

            if (comanda.equals("adauga")) {
                int valoare = Integer.parseInt(sc.nextLine());
                lista.adauga(valoare);
            } else if (comanda.equals("elimina")) {
                int valoare = Integer.parseInt(sc.nextLine());
                if (!lista.elimina(valoare)) {
                    System.out.println("Negasit");
                }
            } else {
                System.out.println(lista.afiseaza());
            }
        }
    }
}
```

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
        Nod curent = cap;
        while (curent.urmator != null) {
            curent = curent.urmator;
        }
        curent.urmator = nod;
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
        // Cand il gasim, il ocolim: curent.urmator = curent.urmator.urmator.
        Nod curent = cap;
        while (curent.urmator != null) {
            if (curent.urmator.valoare == valoare) {
                curent.urmator = curent.urmator.urmator;
                return true;
            }
            curent = curent.urmator;
        }

        return false;
    }

    String afiseaza() {
        if (cap == null) {
            return "Goala";
        }

        String rezultat = "";
        Nod curent = cap;
        while (curent != null) {
            if (rezultat.length() > 0) {
                rezultat = rezultat + " -> ";
            }
            rezultat = rezultat + curent.valoare;
            curent = curent.urmator;
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

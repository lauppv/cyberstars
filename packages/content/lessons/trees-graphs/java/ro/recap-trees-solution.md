```java
import java.util.ArrayDeque;
import java.util.Queue;

class Nod {
    int valoare;
    Nod stanga;
    Nod dreapta;

    Nod(int valoare) {
        this.valoare = valoare;
    }
}

public class Main {
    static Nod insereaza(Nod nod, int valoare) {
        if (nod == null) {
            return new Nod(valoare);
        }
        if (valoare < nod.valoare) {
            nod.stanga = insereaza(nod.stanga, valoare);
        } else {
            nod.dreapta = insereaza(nod.dreapta, valoare);
        }
        return nod;
    }

    static void afiseazaFrunze(Nod nod) {
        if (nod == null) {
            return;
        }
        if (nod.stanga == null && nod.dreapta == null) {
            System.out.print(nod.valoare + " ");
        }
        afiseazaFrunze(nod.stanga);
        afiseazaFrunze(nod.dreapta);
    }

    public static void main(String[] args) {
        int[] valori = {50, 30, 70, 20, 40, 80};
        int cautat = 40;

        Nod radacina = null;
        for (int valoare : valori) {
            radacina = insereaza(radacina, valoare);
        }

        Queue<Nod> coada = new ArrayDeque<>();
        coada.add(radacina);
        int nivel = 0;
        while (!coada.isEmpty()) {
            int marime = coada.size();
            System.out.print("Nivelul " + nivel + ": ");
            for (int i = 0; i < marime; i++) {
                Nod nod = coada.poll();
                System.out.print(nod.valoare + " ");
                if (nod.stanga != null) {
                    coada.add(nod.stanga);
                }
                if (nod.dreapta != null) {
                    coada.add(nod.dreapta);
                }
            }
            System.out.println();
            nivel++;
        }

        System.out.print("Frunze: ");
        afiseazaFrunze(radacina);
        System.out.println();

        System.out.print("Drum pana la " + cautat + ": ");
        Nod nod = radacina;
        while (nod.valoare != cautat) {
            System.out.print(nod.valoare + " ");
            if (cautat < nod.valoare) {
                nod = nod.stanga;
            } else {
                nod = nod.dreapta;
            }
        }
        System.out.println(nod.valoare);
    }
}
```

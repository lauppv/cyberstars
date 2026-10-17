```java
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

    static void inordine(Nod nod) {
        if (nod == null) {
            return;
        }
        inordine(nod.stanga);
        System.out.print(nod.valoare + " ");
        inordine(nod.dreapta);
    }

    static int inaltime(Nod nod) {
        if (nod == null) {
            return -1;
        }
        return 1 + Math.max(inaltime(nod.stanga), inaltime(nod.dreapta));
    }

    static boolean cauta(Nod nod, int cautat) {
        if (nod == null) {
            return false;
        }
        if (cautat == nod.valoare) {
            return true;
        }
        if (cautat < nod.valoare) {
            return cauta(nod.stanga, cautat);
        }
        return cauta(nod.dreapta, cautat);
    }

    public static void main(String[] args) {
        int[] valori = {50, 30, 70, 20, 40, 60, 80};
        int cautat = 60;

        Nod radacina = null;
        for (int valoare : valori) {
            radacina = insereaza(radacina, valoare);
        }

        System.out.print("Sortat: ");
        inordine(radacina);
        System.out.println();
        System.out.println("Inaltime: " + inaltime(radacina));
        if (cauta(radacina, cautat)) {
            System.out.println("Cautare " + cautat + ": gasit");
        } else {
            System.out.println("Cautare " + cautat + ": negasit");
        }
    }
}
```

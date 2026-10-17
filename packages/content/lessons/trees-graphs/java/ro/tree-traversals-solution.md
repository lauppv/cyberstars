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
    static void preordine(Nod nod) {
        if (nod == null) {
            return;
        }
        System.out.print(nod.valoare + " ");
        preordine(nod.stanga);
        preordine(nod.dreapta);
    }

    static void inordine(Nod nod) {
        if (nod == null) {
            return;
        }
        inordine(nod.stanga);
        System.out.print(nod.valoare + " ");
        inordine(nod.dreapta);
    }

    static void postordine(Nod nod) {
        if (nod == null) {
            return;
        }
        postordine(nod.stanga);
        postordine(nod.dreapta);
        System.out.print(nod.valoare + " ");
    }

    public static void main(String[] args) {
        int a = 1;
        int b = 2;
        int c = 3;
        int d = 4;
        int e = 5;
        int f = 6;
        int g = 7;

        Nod radacina = new Nod(a);
        radacina.stanga = new Nod(b);
        radacina.dreapta = new Nod(c);
        radacina.stanga.stanga = new Nod(d);
        radacina.stanga.dreapta = new Nod(e);
        radacina.dreapta.dreapta = new Nod(f);
        radacina.stanga.dreapta.stanga = new Nod(g);

        System.out.print("Preordine: ");
        preordine(radacina);
        System.out.println();
        System.out.print("Inordine: ");
        inordine(radacina);
        System.out.println();
        System.out.print("Postordine: ");
        postordine(radacina);
        System.out.println();
    }
}
```

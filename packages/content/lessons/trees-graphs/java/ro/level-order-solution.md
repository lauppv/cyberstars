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
        radacina.dreapta.stanga = new Nod(e);
        radacina.dreapta.dreapta = new Nod(f);
        radacina.dreapta.stanga.dreapta = new Nod(g);

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
    }
}
```

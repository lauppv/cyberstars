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
    public static void main(String[] args) {
        int a = 8;
        int b = 3;
        int c = 10;
        int d = 1;
        int e = 6;

        Nod radacina = new Nod(a);
        radacina.stanga = new Nod(b);
        radacina.dreapta = new Nod(c);
        radacina.stanga.stanga = new Nod(d);
        radacina.stanga.dreapta = new Nod(e);

        System.out.println("Radacina: " + radacina.valoare);
        System.out.println("Copii: " + radacina.stanga.valoare + " " + radacina.dreapta.valoare);
        System.out.println("Frunze: " + radacina.stanga.stanga.valoare + " " + radacina.stanga.dreapta.valoare + " " + radacina.dreapta.valoare);
    }
}
```

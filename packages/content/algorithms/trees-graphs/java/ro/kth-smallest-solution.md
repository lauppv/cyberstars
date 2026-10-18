```java
class Solutie {
    static int aKaCeaMaiMica(Nod radacina, int k) {
        ArrayDeque<Nod> stiva = new ArrayDeque<>();
        Nod nod = radacina;
        while (true) {
            while (nod != null) {
                stiva.push(nod);
                nod = nod.stanga;
            }
            nod = stiva.pop();
            k--;
            if (k == 0) {
                return nod.valoare;
            }
            nod = nod.dreapta;
        }
    }
}
```

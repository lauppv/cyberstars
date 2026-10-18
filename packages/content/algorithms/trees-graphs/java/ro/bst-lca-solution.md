```java
class Solutie {
    static int stramosComun(Nod radacina, int p, int q) {
        Nod nod = radacina;
        while (true) {
            if (p < nod.valoare && q < nod.valoare) {
                nod = nod.stanga;
            } else if (p > nod.valoare && q > nod.valoare) {
                nod = nod.dreapta;
            } else {
                return nod.valoare;
            }
        }
    }
}
```

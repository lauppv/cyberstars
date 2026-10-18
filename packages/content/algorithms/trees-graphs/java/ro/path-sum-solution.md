```java
class Solutie {
    static boolean areDrumCuSuma(Nod radacina, int suma) {
        if (radacina == null) {
            return false;
        }
        int rest = suma - radacina.valoare;
        if (radacina.stanga == null && radacina.dreapta == null) {
            return rest == 0;
        }
        return areDrumCuSuma(radacina.stanga, rest) || areDrumCuSuma(radacina.dreapta, rest);
    }
}
```

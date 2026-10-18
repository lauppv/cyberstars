```java
class Solutie {
    static int adancimeMaxima(Nod radacina) {
        if (radacina == null) {
            return 0;
        }
        return 1 + Math.max(adancimeMaxima(radacina.stanga), adancimeMaxima(radacina.dreapta));
    }
}
```

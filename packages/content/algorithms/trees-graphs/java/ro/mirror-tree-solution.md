```java
class Solutie {
    static Nod oglindeste(Nod radacina) {
        if (radacina == null) {
            return null;
        }
        Nod stanga = oglindeste(radacina.stanga);
        radacina.stanga = oglindeste(radacina.dreapta);
        radacina.dreapta = stanga;
        return radacina;
    }
}
```

```java
class Solutie {
    // jos si sus sunt nodurile ale caror valori marginesc subarborele; null inseamna fara margine.
    static boolean incape(Nod nod, Nod jos, Nod sus) {
        if (nod == null) {
            return true;
        }
        if (jos != null && nod.valoare <= jos.valoare) {
            return false;
        }
        if (sus != null && nod.valoare >= sus.valoare) {
            return false;
        }
        return incape(nod.stanga, jos, nod) && incape(nod.dreapta, nod, sus);
    }

    static boolean esteArboreDeCautare(Nod radacina) {
        return incape(radacina, null, null);
    }
}
```

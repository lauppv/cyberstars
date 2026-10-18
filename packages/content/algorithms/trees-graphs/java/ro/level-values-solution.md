```java
class Solutie {
    static void afiseazaNivelurile(Nod radacina) {
        if (radacina == null) {
            return;
        }
        Queue<Nod> coada = new ArrayDeque<>();
        coada.add(radacina);
        while (!coada.isEmpty()) {
            int marimeNivel = coada.size();
            StringBuilder valori = new StringBuilder();
            for (int i = 0; i < marimeNivel; i++) {
                Nod nod = coada.remove();
                if (i > 0) {
                    valori.append(" ");
                }
                valori.append(nod.valoare);
                if (nod.stanga != null) {
                    coada.add(nod.stanga);
                }
                if (nod.dreapta != null) {
                    coada.add(nod.dreapta);
                }
            }
            System.out.println(valori);
        }
    }
}
```

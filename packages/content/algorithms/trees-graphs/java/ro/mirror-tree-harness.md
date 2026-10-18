```java
import java.util.*; import java.io.*; {{code: oglindeste}}

class Nod {
    int valoare;
    Nod stanga;
    Nod dreapta;

    Nod(int valoare) {
        this.valoare = valoare;
    }
}

public class Main {
    // Face dintr-o linie ca "8 4 11 2 null 9 15" noduri legate, nivel cu nivel.
    static Nod construiesteArbore(String linie) {
        String[] bucati = linie.trim().split("\\s+");
        if (bucati[0].isEmpty() || bucati[0].equals("null")) {
            return null;
        }
        Nod radacina = new Nod(Integer.parseInt(bucati[0]));
        Queue<Nod> coada = new ArrayDeque<>();
        coada.add(radacina);
        int i = 1;
        while (i < bucati.length) {
            Nod nod = coada.remove();
            if (!bucati[i].equals("null")) {
                nod.stanga = new Nod(Integer.parseInt(bucati[i]));
                coada.add(nod.stanga);
            }
            i++;
            if (i < bucati.length && !bucati[i].equals("null")) {
                nod.dreapta = new Nod(Integer.parseInt(bucati[i]));
                coada.add(nod.dreapta);
            }
            i++;
        }
        return radacina;
    }

    // Scrie un arbore inapoi pe o linie, nivel cu nivel, ca la intrare.
    static String arboreInLinie(Nod radacina) {
        if (radacina == null) {
            return "null";
        }
        StringBuilder linie = new StringBuilder(String.valueOf(radacina.valoare));
        // Unde se termina ultima valoare: null-urile de dupa ea se lasa deoparte.
        int pastrat = linie.length();
        Queue<Nod> coada = new ArrayDeque<>();
        coada.add(radacina);
        while (!coada.isEmpty()) {
            Nod nod = coada.remove();
            for (Nod copil : new Nod[] {nod.stanga, nod.dreapta}) {
                if (copil == null) {
                    linie.append(" null");
                } else {
                    linie.append(" ").append(copil.valoare);
                    pastrat = linie.length();
                    coada.add(copil);
                }
            }
        }
        return linie.substring(0, pastrat);
    }

    public static void main(String[] args) throws Exception {
        BufferedReader cititor = new BufferedReader(new InputStreamReader(System.in));
        Nod radacina = construiesteArbore(cititor.readLine());
        System.out.println(arboreInLinie(new Solutie().oglindeste(radacina)));
    }
}
```

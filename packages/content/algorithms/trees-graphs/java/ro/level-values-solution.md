```java
import java.io.BufferedReader;
import java.io.InputStreamReader;
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

    public static void main(String[] args) throws Exception {
        BufferedReader cititor = new BufferedReader(new InputStreamReader(System.in));
        Nod radacina = construiesteArbore(cititor.readLine());
        afiseazaNivelurile(radacina);
    }
}
```

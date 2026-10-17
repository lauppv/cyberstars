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

    public static void main(String[] args) throws Exception {
        BufferedReader cititor = new BufferedReader(new InputStreamReader(System.in));
        Nod radacina = construiesteArbore(cititor.readLine());
        System.out.println(esteArboreDeCautare(radacina));
    }
}
```

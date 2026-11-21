```java
import java.util.LinkedList;
import java.util.Queue;

class LocException extends Exception {
    LocException(String mesaj) {
        super(mesaj);
    }
}

class Avion {
    String[][] locuri;
    Queue<String> asteptare = new LinkedList<>();

    Avion(int randuri, int locuriPeRand) {
        locuri = new String[randuri][locuriPeRand];
    }

    void rezerva(String nume, String cod) throws LocException {
        int rand = Integer.parseInt(cod.substring(0, cod.length() - 1)) - 1;
        int coloana = cod.charAt(cod.length() - 1) - 'A';
        if (rand < 0 || rand >= locuri.length || coloana < 0 || coloana >= locuri[0].length) {
            throw new LocException("Nu exista locul " + cod);
        }
        if (locuri[rand][coloana] != null) {
            throw new LocException("Locul " + cod + " e ocupat");
        }
        locuri[rand][coloana] = nume;
    }

    String rezervaOricare(String nume) {
        for (int r = 0; r < locuri.length; r++) {
            for (int c = 0; c < locuri[r].length; c++) {
                if (locuri[r][c] == null) {
                    locuri[r][c] = nume;
                    return (r + 1) + "" + (char) ('A' + c);
                }
            }
        }
        asteptare.offer(nume);
        return null;
    }

    void afiseazaHarta() {
        for (int r = 0; r < locuri.length; r++) {
            StringBuilder linie = new StringBuilder();
            linie.append(r + 1).append(" ");
            for (String l : locuri[r]) {
                linie.append(l == null ? "." : "X");
            }
            System.out.println(linie);
        }
    }
}

public class Main {
    public static void main(String[] args) {
        int randuri = 2;
        int locuriPeRand = 2;
        String[] rezervari = {
            "Tommy:1A", "Kent:1A", "Lance:oricare", "Mitch:3A",
            "Kent:2B", "Phil:oricare", "Candy:oricare", "Diaz:oricare"
        };

        Avion avion = new Avion(randuri, locuriPeRand);
        for (String rezervare : rezervari) {
            String[] parti = rezervare.split(":");
            String nume = parti[0];
            if (parti[1].equals("oricare")) {
                String loc = avion.rezervaOricare(nume);
                if (loc == null) {
                    System.out.println(nume + " asteapta un loc");
                } else {
                    System.out.println(nume + " primeste " + loc);
                }
            } else {
                try {
                    avion.rezerva(nume, parti[1]);
                    System.out.println(nume + " primeste " + parti[1]);
                } catch (LocException e) {
                    System.out.println("Refuzat: " + e.getMessage());
                }
            }
        }

        avion.afiseazaHarta();
        if (avion.asteptare.isEmpty()) {
            System.out.println("Asteapta: nimeni");
        } else {
            System.out.println("Asteapta: " + String.join(", ", avion.asteptare));
        }
    }
}
```

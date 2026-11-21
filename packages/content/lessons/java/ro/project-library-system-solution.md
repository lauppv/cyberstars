```java
import java.util.TreeMap;

class BibliotecaException extends Exception {
    BibliotecaException(String mesaj) {
        super(mesaj);
    }
}

class Carte {
    String titlu;
    String cititor;

    Carte(String titlu) {
        this.titlu = titlu;
    }
}

class Biblioteca {
    TreeMap<String, Carte> raft = new TreeMap<>();

    void adaugaCarte(String titlu) {
        raft.put(titlu, new Carte(titlu));
    }

    Carte gaseste(String titlu) throws BibliotecaException {
        Carte carte = raft.get(titlu);
        if (carte == null) {
            throw new BibliotecaException("Nicio carte numita " + titlu);
        }
        return carte;
    }

    void imprumuta(String titlu, String nume) throws BibliotecaException {
        Carte carte = gaseste(titlu);
        if (carte.cititor != null) {
            throw new BibliotecaException(titlu + " e deja imprumutata");
        }
        carte.cititor = nume;
    }

    void returneaza(String titlu) throws BibliotecaException {
        Carte carte = gaseste(titlu);
        if (carte.cititor == null) {
            throw new BibliotecaException(titlu + " nu era imprumutata");
        }
        carte.cititor = null;
    }

    void afiseazaCatalog() {
        for (Carte carte : raft.values()) {
            if (carte.cititor == null) {
                System.out.println(carte.titlu + ": pe raft");
            } else {
                System.out.println(carte.titlu + ": la " + carte.cititor);
            }
        }
    }
}

public class Main {
    public static void main(String[] args) {
        String[] carti = {"Insula comorii", "Dracula", "Moby Dick"};
        String[] cereri = {
            "imprumuta:Dracula:Lance",
            "imprumuta:Dracula:Kent",
            "imprumuta:Scarface:Tommy",
            "returneaza:Moby Dick",
            "returneaza:Dracula",
            "imprumuta:Dracula:Phil"
        };

        Biblioteca biblioteca = new Biblioteca();
        for (String titlu : carti) {
            biblioteca.adaugaCarte(titlu);
        }

        for (String cerere : cereri) {
            String[] parti = cerere.split(":");
            try {
                if (parti[0].equals("imprumuta")) {
                    biblioteca.imprumuta(parti[1], parti[2]);
                    System.out.println(parti[2] + " a luat " + parti[1]);
                } else {
                    biblioteca.returneaza(parti[1]);
                    System.out.println(parti[1] + " s-a intors");
                }
            } catch (BibliotecaException e) {
                System.out.println("Refuzat: " + e.getMessage());
            }
        }

        System.out.println("Catalog:");
        biblioteca.afiseazaCatalog();
    }
}
```

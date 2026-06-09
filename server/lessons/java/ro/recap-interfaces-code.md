interface Forma {
    double arie();
    String descrie();
}

// implementează Cerc, Dreptunghi, Triunghi

public class Main {
    static void afiseazaForma(Forma s) {
        System.out.println(String.format("%s — Arie: %.2f", s.descrie(), s.arie()));
    }

    public static void main(String[] args) {
        Forma[] forme = {
            new Cerc(5),
            new Dreptunghi(4, 6),
            new Triunghi(3, 8)
        };

        for (Forma s : forme) {
            afiseazaForma(s);
        }

        // încearcă să convertești forme[0] la Cerc, afișează raza
        // încearcă să convertești forme[1] la Cerc, prinde excepția
    }

}

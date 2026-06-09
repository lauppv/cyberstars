class Animal {
    String nume;

    Animal(String nume) {
        this.nume = nume;
    }

    void vorbeste() {
        System.out.println("...");
    }

}

// Creează o clasă Caine care extinde Animal
// Suprascrie vorbeste() ca să afișeze "Ham! Mă cheamă " + nume

// Creează o clasă Pisica care extinde Animal
// Suprascrie vorbeste() ca să afișeze "Miau! Mă cheamă " + nume

public class Main {
    public static void main(String[] args) {
        // Creează un Caine numit "Tommy" și o Pisica numită "Lance"
        // Apelează vorbeste() pe amândoi
    }
}

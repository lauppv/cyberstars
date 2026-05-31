public class Main {
    public static void main(String[] args) {
        int totalDecks = 20;
        int cursedDeck = 13;
        int lockdownDeck = 17;

        for (int i = 1; i <= totalDecks; i++) {
            // skip cursedDeck with continue
            // stop at lockdownDeck with break (don't print it)
            System.out.println(i);
        }
    }

}

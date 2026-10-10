public class Main {
    public static void main(String[] args) {
        int secretCombination = 3;
        int attempt = 1;
        while (true) {
            System.out.println("Trying " + attempt);
            if (attempt == secretCombination) {
                System.out.println("Safe open");
                break;
            }
            attempt++;
        }
    }
}

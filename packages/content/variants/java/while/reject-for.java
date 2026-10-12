public class Main {
    public static void main(String[] args) {
        int secretCombination = 3;
        for (int i = 1; ; i++) {
            if (i == secretCombination) {
                System.out.println("Safe open");
                break;
            }
            System.out.println("Trying " + i);
        }
    }
}

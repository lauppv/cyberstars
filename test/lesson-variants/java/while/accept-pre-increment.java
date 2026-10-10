public class Main {
    public static void main(String[] args) {
        int secretCombination = 3;
        int n = 0;
        while (true) {
            n++;
            if (n == secretCombination) {
                System.out.println("Safe open");
                break;
            }
            System.out.println("Trying " + n);
        }
    }
}

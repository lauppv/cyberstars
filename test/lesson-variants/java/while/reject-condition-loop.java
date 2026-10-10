public class Main {
    static void tryCode(int code) {
        System.out.println("Trying " + code);
    }

    public static void main(String[] args) {
        int secretCombination = 3;
        int guess = 1;
        while (guess != secretCombination) {
            tryCode(guess);
            guess += 1;
        }
        System.out.println("Safe open");
    }
}

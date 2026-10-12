public class Main {
    public static void main(String[] args) {
        int temperature = -5;
        boolean aboveZero = temperature >= 0;
        if (aboveZero) {
            System.out.println("water does not freeze");
        } else {
            System.out.println("it's freezing outside");
        }
    }
}

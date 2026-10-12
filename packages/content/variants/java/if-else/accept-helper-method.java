public class Main {
    static String status(int t) {
        if (t >= 0) {
            return "water does not freeze";
        } else {
            return "it's freezing outside";
        }
    }

    public static void main(String[] args) {
        int temperature = 12;
        System.out.println(status(temperature));
    }
}

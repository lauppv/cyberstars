public class Main {
    public static void main(String[] args) {
        int mileage = 4072;
        String text = "" + mileage;
        for (int i = text.length() - 1; i >= 0; i--) {
            System.out.println(text.charAt(i));
        }
        System.out.println("Digits: " + text.length());
    }
}

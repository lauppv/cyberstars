public class Main {
    public static void main(String[] args) {
        String plate = "VC 4-28";
        int letters = 0, digits = 0, sum = 0;
        for (int i = 0; i < plate.length(); i++) {
            char c = plate.charAt(i);
            if (Character.isDigit(c)) {
                digits++;
                sum += c - '0';
            }
            if (Character.isLetter(c)) {
                letters++;
            }
        }
        System.out.println("Letters: " + letters);
        System.out.println("Digits: " + digits);
        System.out.println("Other: " + (plate.length() - letters - digits));
        System.out.println("Digit sum: " + sum);
    }
}

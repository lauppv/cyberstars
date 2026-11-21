public class Main {
    public static void main(String[] args) {
        String plate = "VC 4-28";
        int letters = 0, digits = 0, other = 0, sum = 0;
        for (int i = 0; i < plate.length(); i++) {
            char c = plate.charAt(i);
            if (Character.isLetter(c)) {
                letters++;
            } else if (Character.isDigit(c)) {
                digits++;
                sum += c;
            } else {
                other++;
            }
        }
        System.out.println("Letters: " + letters);
        System.out.println("Digits: " + digits);
        System.out.println("Other: " + other);
        System.out.println("Digit sum: " + sum);
    }
}

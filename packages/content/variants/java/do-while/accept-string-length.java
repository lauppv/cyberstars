public class Main {
    public static void main(String[] args) {
        int mileage = 4072;
        int count = 0;
        int left = mileage;
        do {
            int digit = left % 10;
            System.out.println(digit);
            left /= 10;
            count += 1;
        } while (left != 0);
        System.out.println("Digits: " + count);
    }
}

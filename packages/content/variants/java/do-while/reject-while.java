public class Main {
    public static void main(String[] args) {
        int mileage = 4072;
        int digits = 0;
        while (mileage > 0) {
            System.out.println(mileage % 10);
            mileage = mileage / 10;
            digits++;
        }
        System.out.println("Digits: " + digits);
    }
}

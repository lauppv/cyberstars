public class Main {
    public static void main(String[] args) {
        int mileage = 4072;
        int digits = 0;
        do {
            if (mileage == 0) {
                break;
            }
            System.out.println(mileage % 10);
            mileage = mileage / 10;
            digits++;
        } while (mileage > 0);
        System.out.println("Digits: " + digits);
    }
}

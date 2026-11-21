public class Main {
    public static void main(String[] args) {
        String[] days = {"Monday", "Tuesday", "Wednesday"};
        int[] earnings = {1200, 800, 2500};
        int total = 0;
        for (int i = 0; i < days.length; i++) {
            System.out.println(days[i] + ": " + earnings[i]);
            total += earnings[i];
        }
        System.out.println("Total: " + total);
    }
}

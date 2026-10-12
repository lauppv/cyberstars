public class Main {
    static String action(int t) {
        if (t == 10) return "Starting the main engines";
        if (t == 20) return "Starting secondary engines";
        if (t == 60) return "Checking connection with the control tower";
        if (t == 100) return "Starting all onboard computers";
        return "Standing by...";
    }

    public static void main(String[] args) {
        int seconds = 60;
        System.out.println(action(seconds));
    }
}

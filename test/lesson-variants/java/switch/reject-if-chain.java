public class Main {
    public static void main(String[] args) {
        String day = "Monday";
        if (day.equals("Saturday") || day.equals("Sunday")) {
            System.out.println("Weekend");
        } else if (day.equals("Monday") || day.equals("Tuesday") || day.equals("Wednesday")
                || day.equals("Thursday") || day.equals("Friday")) {
            System.out.println("Weekday");
        } else {
            System.out.println("Unknown day");
        }
    }
}

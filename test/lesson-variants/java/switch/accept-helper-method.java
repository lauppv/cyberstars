public class Main {
    static String classify(String d) {
        switch (d) {
            case "Saturday":
            case "Sunday":
                return "Weekend";
            case "Monday":
            case "Tuesday":
            case "Wednesday":
            case "Thursday":
            case "Friday":
                return "Weekday";
            default:
                return "Unknown day";
        }
    }

    public static void main(String[] args) {
        String day = "Monday";
        System.out.println(classify(day));
    }
}

public class Main {
    static String handle(String raw) {
        try {
            return "Payment: " + Integer.parseInt(raw);
        } catch (NumberFormatException ex) {
            return "Invalid report: " + raw;
        }
    }

    public static void main(String[] args) {
        String[] reports = {"7500", "dunno", "23000", "error"};
        for (int i = 0; i < reports.length; i++) {
            System.out.println(handle(reports[i]));
        }
    }
}

public class Main {
    public static void main(String[] args) {
        String[] reports = {"7500", "dunno", "23000", "error"};
        for (String r : reports) {
            if (r.matches("[0-9]+")) {
                System.out.println("Payment: " + r);
            } else {
                System.out.println("Invalid report: " + r);
            }
        }
    }
}

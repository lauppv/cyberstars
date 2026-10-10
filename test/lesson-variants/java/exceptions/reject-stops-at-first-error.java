public class Main {
    public static void main(String[] args) {
        String[] reports = {"7500", "dunno", "23000", "error"};
        String current = "";
        try {
            for (String r : reports) {
                current = r;
                System.out.println("Payment: " + Integer.parseInt(r));
            }
        } catch (NumberFormatException e) {
            System.out.println("Invalid report: " + current);
        }
    }
}

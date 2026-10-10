public class Main {
    static boolean fitsInt(String r) {
        if (!r.matches("[+-]?[0-9]{1,10}")) return false;
        long v = Long.parseLong(r);
        return v >= Integer.MIN_VALUE && v <= Integer.MAX_VALUE;
    }

    public static void main(String[] args) {
        String[] reports = {"7500", "dunno", "23000", "error"};
        for (String r : reports) {
            if (fitsInt(r)) {
                System.out.println("Payment: " + Integer.parseInt(r));
            } else {
                System.out.println("Invalid report: " + r);
            }
        }
    }
}

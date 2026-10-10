public class Main {
    public static void main(String[] args) {
        String[] reports = {"7500", "dunno", "23000", "error"};
        StringBuilder log = new StringBuilder();
        int idx = 0;
        while (idx < reports.length) {
            String r = reports[idx++];
            try {
                int value = Integer.parseInt(r);
                log.append("Payment: ").append(value).append('\n');
            } catch (IllegalArgumentException bad) {
                log.append("Invalid report: ").append(r).append('\n');
            }
        }
        System.out.print(log);
    }
}

public class Main {
    public static void main(String[] args) {
        int[] takings = { 1200, 3400, 800, 2600 };
        StringBuilder report = new StringBuilder();
        int acc = 0;
        for (int t : takings) {
            report.append(t).append(System.lineSeparator());
            acc += t;
        }
        double avg = acc;
        avg /= takings.length;
        report.append(acc).append(System.lineSeparator()).append(avg);
        System.out.println(report);
    }
}

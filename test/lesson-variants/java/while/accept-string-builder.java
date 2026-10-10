public class Main {
    public static void main(String[] args) {
        int secretCombination = 3;
        StringBuilder log = new StringBuilder();
        int attempt = 1;
        while (true) {
            if (attempt == secretCombination) {
                log.append("Safe open");
                break;
            }
            log.append("Trying ").append(attempt).append("\n");
            attempt += 1;
        }
        System.out.println(log);
    }
}

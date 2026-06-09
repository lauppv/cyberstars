public class Main {
    static String[] filtreazaCuvinte(String[] cuvinte) {
        return new String[0];
    }

    public static void main(String[] args) {
        String[] cuvinte = {"hello", "SPAM", "world", "SPAM", "java", "SPAM", "rocks", "exit", "bonus"};
        String[] rezultat = filtreazaCuvinte(cuvinte);

        for (String c : rezultat) {
            System.out.println(c);
        }
        System.out.println("Total: " + rezultat.length + " cuvinte");
    }
}

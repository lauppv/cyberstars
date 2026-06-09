public class Main {
    static String[] filterWords(String[] words) {
        // filtrează, sari peste SPAM, oprește-te la exit, majuscule
        return new String[0];
    }

    public static void main(String[] args) {
        String[] words = {"hello", "SPAM", "world", "SPAM", "java", "SPAM", "rocks", "exit", "bonus"};
        String[] result = filterWords(words);

        for (String w : result) {
            System.out.println(w);
        }
        System.out.println("Total: " + result.length + " words");
    }

}

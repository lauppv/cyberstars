public class Main {
    static String[] filterWords(String[] words) {
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

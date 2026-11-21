public class Main {
    static int count(String[] items, String target) {
        int found = 0;
        for (String item : items) if (item.equals(target)) found++;
        return found;
    }

    static int count(Integer[] items, Integer target) {
        int found = 0;
        for (Integer item : items) if (item.equals(target)) found++;
        return found;
    }

    static Object lastOf(Object[] items) {
        return items[items.length - 1];
    }

    public static void main(String[] args) {
        String[] words = { "cash", "gun", "cash" };
        String word = "cash";
        Integer[] numbers = { 1000, 5, 1000, 1000 };
        Integer number = 1000;
        System.out.println(word + ": " + count(words, word) + " times");
        System.out.println(number + ": " + count(numbers, number) + " times");
        System.out.println("Last word: " + lastOf(words));
        System.out.println("Last number: " + lastOf(numbers));
    }
}

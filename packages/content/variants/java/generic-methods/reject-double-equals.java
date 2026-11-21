public class Main {
    static <T> int count(T[] items, T target) {
        int found = 0;
        for (T item : items) {
            if (item == target) found++;
        }
        return found;
    }

    static <T> T lastOf(T[] items) {
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

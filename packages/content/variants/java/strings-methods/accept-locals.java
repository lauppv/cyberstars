public class Main {
    public static void main(String[] args) {
        String name = "lance vance";

        int len = name.length();
        String upper = name.toUpperCase();
        String lower = name.toLowerCase();
        String first = name.substring(0, 1);
        String head = name.substring(0, 5);
        String tail = name.substring(len - 5, len);
        System.out.println(upper + "\n" + lower + "\n" + len + "\n" + first + "\n" + head + "\n" + tail);
    }
}

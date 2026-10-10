public class Main {
    static String lastFive(String s) {
        return s.substring(s.length() - 5);
    }

    public static void main(String[] args) {
        String name = "lance vance";

        System.out.println(name.toUpperCase());
        System.out.println(name.toLowerCase());
        System.out.println(name.length());
        System.out.println(name.charAt(0));
        System.out.println(name.substring(0, 5));
        System.out.println(lastFive(name));
    }
}

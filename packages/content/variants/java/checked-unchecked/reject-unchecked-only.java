public class Main {
    static int checkCode(String code) {
        if (code.length() != 4) throw new IllegalArgumentException("needs 4 characters");
        return Integer.parseInt(code);
    }

    public static void main(String[] args) {
        String[] codes = {"1986", "12345", "19x6", "0042"};
        int good = 0;
        for (String c : codes) {
            try {
                checkCode(c);
                System.out.println("Code ok: " + c);
                good++;
            } catch (NumberFormatException e) {
                System.out.println("Not a number: " + c);
            } catch (IllegalArgumentException e) {
                System.out.println("Bad code: " + e.getMessage());
            }
        }
        System.out.println("Good codes: " + good);
    }
}

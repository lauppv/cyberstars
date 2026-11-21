public class Main {
    static int checkCode(String code) throws Exception {
        if (code.length() != 4) throw new Exception("needs 4 characters");
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
            } catch (Exception e) {
                System.out.println("Bad code: " + e.getMessage());
            }
        }
        System.out.println("Good codes: " + good);
    }
}

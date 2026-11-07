```java
import java.util.*;

public class Main {
    static abstract class Piece {
        final boolean white;
        Piece(boolean white) { this.white = white; }
        abstract char letter();
        abstract String name();
        // Whether the piece's own way of moving takes it from (fr, fc) to (tr, tc) on this board
        abstract boolean canMove(Piece[][] b, int fr, int fc, int tr, int tc);
        char symbol() { return white ? letter() : Character.toLowerCase(letter()); }
    }

    static boolean clear(Piece[][] b, int fr, int fc, int tr, int tc) {
        int dr = Integer.signum(tr - fr), dc = Integer.signum(tc - fc);
        for (int r = fr + dr, c = fc + dc; r != tr || c != tc; r += dr, c += dc)
            if (b[r][c] != null) return false;
        return true;
    }

    static class King extends Piece {
        King(boolean w) { super(w); }
        char letter() { return 'K'; }
        String name() { return "king"; }
        boolean canMove(Piece[][] b, int fr, int fc, int tr, int tc) { return Math.abs(tr - fr) <= 1 && Math.abs(tc - fc) <= 1; }
    }
    static class Rook extends Piece {
        Rook(boolean w) { super(w); }
        char letter() { return 'R'; }
        String name() { return "rook"; }
        boolean canMove(Piece[][] b, int fr, int fc, int tr, int tc) { return (fr == tr || fc == tc) && clear(b, fr, fc, tr, tc); }
    }
    static class Bishop extends Piece {
        Bishop(boolean w) { super(w); }
        char letter() { return 'B'; }
        String name() { return "bishop"; }
        boolean canMove(Piece[][] b, int fr, int fc, int tr, int tc) { return Math.abs(tr - fr) == Math.abs(tc - fc) && clear(b, fr, fc, tr, tc); }
    }
    static class Queen extends Piece {
        Queen(boolean w) { super(w); }
        char letter() { return 'Q'; }
        String name() { return "queen"; }
        boolean canMove(Piece[][] b, int fr, int fc, int tr, int tc) {
            return (fr == tr || fc == tc || Math.abs(tr - fr) == Math.abs(tc - fc)) && clear(b, fr, fc, tr, tc);
        }
    }
    static class Knight extends Piece {
        Knight(boolean w) { super(w); }
        char letter() { return 'N'; }
        String name() { return "knight"; }
        boolean canMove(Piece[][] b, int fr, int fc, int tr, int tc) {
            int r = Math.abs(tr - fr), c = Math.abs(tc - fc);
            return r * c == 2;
        }
    }
    static class Pawn extends Piece {
        Pawn(boolean w) { super(w); }
        char letter() { return 'P'; }
        String name() { return "pawn"; }
        boolean canMove(Piece[][] b, int fr, int fc, int tr, int tc) {
            int dir = white ? -1 : 1;           // row 0 is rank 8
            int start = white ? 6 : 1;
            if (tc == fc && b[tr][tc] == null) {
                if (tr == fr + dir) return true;
                return fr == start && tr == fr + 2 * dir && b[fr + dir][fc] == null;
            }
            return Math.abs(tc - fc) == 1 && tr == fr + dir && b[tr][tc] != null;
        }
    }

    static Piece make(char ch) {
        boolean w = Character.isUpperCase(ch);
        return switch (Character.toUpperCase(ch)) {
            case 'K' -> new King(w);
            case 'Q' -> new Queen(w);
            case 'R' -> new Rook(w);
            case 'B' -> new Bishop(w);
            case 'N' -> new Knight(w);
            case 'P' -> new Pawn(w);
            default -> null;
        };
    }

    static Piece[][] board = new Piece[8][8];

    static boolean attacked(Piece[][] b, int r, int c, boolean byWhite) {
        for (int i = 0; i < 8; i++)
            for (int j = 0; j < 8; j++) {
                Piece p = b[i][j];
                if (p == null || p.white != byWhite) continue;
                if (p instanceof Pawn) {
                    if (r == i + (p.white ? -1 : 1) && Math.abs(c - j) == 1) return true;
                } else if (p.canMove(b, i, j, r, c)) return true;
            }
        return false;
    }

    static boolean inCheck(Piece[][] b, boolean white) {
        for (int i = 0; i < 8; i++)
            for (int j = 0; j < 8; j++)
                if (b[i][j] instanceof King && b[i][j].white == white) return attacked(b, i, j, !white);
        return false;
    }

    // Whether the side has any move that doesn't leave its own king in check
    static boolean hasLegalMove(boolean white) {
        for (int fr = 0; fr < 8; fr++)
            for (int fc = 0; fc < 8; fc++) {
                Piece p = board[fr][fc];
                if (p == null || p.white != white) continue;
                for (int tr = 0; tr < 8; tr++)
                    for (int tc = 0; tc < 8; tc++) {
                        Piece target = board[tr][tc];
                        if ((fr == tr && fc == tc) || (target != null && target.white == white)) continue;
                        if (!p.canMove(board, fr, fc, tr, tc)) continue;
                        board[tr][tc] = p;
                        board[fr][fc] = null;
                        boolean safe = !inCheck(board, white);
                        board[fr][fc] = p;
                        board[tr][tc] = target;
                        if (safe) return true;
                    }
            }
        return false;
    }

    static int[] square(String s) {
        if (s.length() != 2 || s.charAt(0) < 'a' || s.charAt(0) > 'h' || s.charAt(1) < '1' || s.charAt(1) > '8')
            throw new IllegalArgumentException("Not a square: " + s);
        return new int[] {'8' - s.charAt(1), s.charAt(0) - 'a'};
    }

    static void show() {
        for (int r = 0; r < 8; r++) {
            StringBuilder sb = new StringBuilder().append(8 - r).append(' ');
            for (int c = 0; c < 8; c++) sb.append(board[r][c] == null ? '.' : board[r][c].symbol()).append(c < 7 ? " " : "");
            System.out.println(sb);
        }
        System.out.println("  a b c d e f g h");
    }

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        for (int r = 0; r < 8; r++) {
            String row = in.nextLine().trim();
            for (int c = 0; c < 8; c++) board[r][c] = make(row.charAt(c));
        }
        show();
        boolean whiteToMove = true;
        int moveNumber = 1;
        List<String> takenByWhite = new ArrayList<>(), takenByBlack = new ArrayList<>();
        while (in.hasNextLine()) {
            String line = in.nextLine().trim();
            if (line.isEmpty()) continue;
            String[] w = line.split("\\s+");
            try {
                if (w[0].equals("quit")) { System.out.println("Bye"); return; }
                if (w[0].equals("board")) { show(); continue; }
                if (w[0].equals("captured")) {
                    System.out.println("White took: " + (takenByWhite.isEmpty() ? "nothing" : String.join(", ", takenByWhite)));
                    System.out.println("Black took: " + (takenByBlack.isEmpty() ? "nothing" : String.join(", ", takenByBlack)));
                    continue;
                }
                if (w.length != 2) throw new IllegalArgumentException("Usage: <from> <to>, like e2 e4");
                int[] f = square(w[0]), t = square(w[1]);
                Piece p = board[f[0]][f[1]];
                String side = whiteToMove ? "White" : "Black";
                if (p == null) { System.out.println("No piece on " + w[0]); continue; }
                if (p.white != whiteToMove) { System.out.println("It's " + side + "'s turn"); continue; }
                Piece target = board[t[0]][t[1]];
                if (target != null && target.white == p.white) { System.out.println("Can't take your own " + target.name()); continue; }
                if ((f[0] == t[0] && f[1] == t[1]) || !p.canMove(board, f[0], f[1], t[0], t[1])) {
                    System.out.println("A " + p.name() + " can't move from " + w[0] + " to " + w[1]);
                    continue;
                }
                board[t[0]][t[1]] = p;
                board[f[0]][f[1]] = null;
                if (inCheck(board, whiteToMove)) {
                    board[f[0]][f[1]] = p;
                    board[t[0]][t[1]] = target;
                    System.out.println("That leaves your king in check");
                    continue;
                }
                String text = (whiteToMove ? moveNumber + ". " : moveNumber + "... ") + side + " " + p.name() + " " + w[0] + "-" + w[1];
                if (target != null) {
                    text += ", takes " + target.name();
                    (whiteToMove ? takenByWhite : takenByBlack).add(target.name());
                }
                if (p instanceof Pawn && (t[0] == 0 || t[0] == 7)) {
                    board[t[0]][t[1]] = new Queen(p.white);
                    text += ", becomes a queen";
                }
                boolean check = inCheck(board, !whiteToMove);
                boolean stuck = !hasLegalMove(!whiteToMove);
                if (check && stuck) text += ", checkmate! " + side + " wins";
                else if (stuck) text += ", stalemate! It's a draw";
                else if (check) text += ", check!";
                System.out.println(text);
                if (stuck) {
                    show();
                    return;
                }
                if (!whiteToMove) moveNumber++;
                whiteToMove = !whiteToMove;
            } catch (IllegalArgumentException e) {
                System.out.println(e.getMessage());
            }
        }
    }
}
```

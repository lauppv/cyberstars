// Trusted judge runner for Java lessons, executed inside the owner's sandbox
// container (eclipse-temurin:21-jdk-alpine, --network=none, pids/memory
// capped). Compiled once per container into /tmp/_judge by the service, then
// invoked as `java Runner /work/_payload.json` per test run.
//
// Mirrors lesson-tests.runner.py: reads a payload JSON ({userCode,
// solutionCode, structure, cases}), checks the user code's structure via the
// Compiler Tree API, injects each case's values into the lesson's input
// variables (in BOTH the user code and the reference solution) by splicing
// the initializer/rhs source ranges, and/or feeds the case's stdin to both,
// compiles and runs the two programs per case, and prints a single JSON
// verdict to stdout. Expected outputs never enter this container: the server
// compares the two stdouts on its side.
//
// Divergences from the Python runner, by necessity of the language:
// - "syntax error" covers all compile errors of the pristine user code (Java
//   surfaces semantic errors at compile time, not runtime).
// - Injection targets variable declarations/assignments that are direct
//   statements of a method body, plus field declarations (the closest analog
//   of Python's module-level assignments). A never-declared inject name is
//   skipped — Java needs a type to prepend a declaration; structure rules and
//   output comparison catch that case anyway.
// - Values are rendered as typed literals using the declared type as a hint
//   (char/long/float; $list -> `new T[]{...}` or `new ArrayList<>(List.of())`;
//   $dict -> LinkedHashMap subclass so iteration order follows insertion).

import com.sun.source.tree.AssignmentTree;
import com.sun.source.tree.BlockTree;
import com.sun.source.tree.ClassTree;
import com.sun.source.tree.CompilationUnitTree;
import com.sun.source.tree.DoWhileLoopTree;
import com.sun.source.tree.EnhancedForLoopTree;
import com.sun.source.tree.ExpressionStatementTree;
import com.sun.source.tree.ExpressionTree;
import com.sun.source.tree.ForLoopTree;
import com.sun.source.tree.IdentifierTree;
import com.sun.source.tree.LiteralTree;
import com.sun.source.tree.MemberSelectTree;
import com.sun.source.tree.MethodInvocationTree;
import com.sun.source.tree.MethodTree;
import com.sun.source.tree.NewClassTree;
import com.sun.source.tree.Tree;
import com.sun.source.tree.VariableTree;
import com.sun.source.tree.WhileLoopTree;
import com.sun.source.util.JavacTask;
import com.sun.source.util.SourcePositions;
import com.sun.source.util.TreePathScanner;
import com.sun.source.util.Trees;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.StringWriter;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import javax.tools.Diagnostic;
import javax.tools.DiagnosticCollector;
import javax.tools.JavaCompiler;
import javax.tools.JavaFileObject;
import javax.tools.SimpleJavaFileObject;
import javax.tools.StandardJavaFileManager;
import javax.tools.ToolProvider;

public class Runner {
  static final int CASE_TIMEOUT_SEC = 5;
  static final int OUTPUT_CAP = 64 * 1024;
  static final Path WORK_ROOT = Path.of("/tmp/_judge_work");
  static final JavaCompiler COMPILER = ToolProvider.getSystemJavaCompiler();

  public static void main(String[] args) throws Exception {
    Object payloadRaw = Json.parse(Files.readString(Path.of(args[0]), StandardCharsets.UTF_8));
    Map<String, Object> payload = asMap(payloadRaw);
    String userCode = (String) payload.get("userCode");
    String solutionCode = (String) payload.get("solutionCode");
    Map<String, Object> structure = asMap(payload.getOrDefault("structure", new LinkedHashMap<>()));
    List<Object> cases = asList(payload.getOrDefault("cases", new ArrayList<>()));

    Map<String, Object> result = new LinkedHashMap<>();
    result.put("syntaxError", null);
    result.put("structureFailures", new ArrayList<>());
    result.put("cases", new ArrayList<>());

    resetWorkRoot();

    Parsed user = Parsed.of(userCode);
    if (user.error != null) {
      result.put("syntaxError", user.error);
      System.out.println(Json.write(result));
      return;
    }
    result.put("structureFailures", Structure.check(user, structure));

    Parsed solution = Parsed.of(solutionCode);

    // Java surfaces semantic errors (unknown variable, bad types) only at
    // compile time — compile the pristine user code once so those become the
    // "syntax error" verdict instead of a misleading per-case failure. The
    // compiled classes are cached, so inject-free cases reuse them.
    CompiledCache cache = new CompiledCache();
    if (solution.error == null) {
      Compiled pristine = cache.compile(user);
      if (pristine.error != null) {
        result.put("syntaxError", pristine.error);
        System.out.println(Json.write(result));
        return;
      }
    }

    List<Object> caseResults = asList(result.get("cases"));
    for (Object caseRaw : cases) {
      Map<String, Object> testCase = asMap(caseRaw);
      Map<String, Object> inject = asMap(testCase.getOrDefault("inject", new LinkedHashMap<>()));
      String stdin = testCase.get("stdin") instanceof String s ? s : "";

      Compiled userProg;
      Compiled solutionProg;
      if (solution.error != null) {
        userProg = null;
        solutionProg = null;
      } else {
        userProg = cache.compile(user.withInjected(inject));
        solutionProg = cache.compile(solution.withInjected(inject));
      }
      if (userProg == null || solutionProg == null || solutionProg.error != null) {
        caseResults.add(Map.of("injectError", true));
        continue;
      }
      // The pristine user code compiled, so a per-case failure means injection
      // broke it — a spec/solution mismatch on our side, not the student's.
      if (userProg.error != null) {
        caseResults.add(Map.of("injectError", true));
        continue;
      }

      Map<String, Object> userRun = runProgram(userProg, stdin);
      Map<String, Object> caseResult = new LinkedHashMap<>();
      caseResult.put("user", userRun);
      caseResult.put("solution", runProgram(solutionProg, stdin));
      caseResults.add(caseResult);
      // A hung program would burn 5s on every remaining case too — stop here.
      if (Boolean.TRUE.equals(userRun.get("timedOut"))) break;
    }

    System.out.println(Json.write(result));
  }

  static void resetWorkRoot() throws IOException {
    if (Files.exists(WORK_ROOT)) {
      try (var walk = Files.walk(WORK_ROOT)) {
        walk.sorted(Comparator.reverseOrder())
            .forEach(
                p -> {
                  try {
                    Files.delete(p);
                  } catch (IOException ignored) {
                    // best-effort cleanup; stale files only waste tmpfs space
                  }
                });
      }
    }
    Files.createDirectories(WORK_ROOT);
  }

  @SuppressWarnings("unchecked")
  static Map<String, Object> asMap(Object o) {
    return o instanceof Map ? (Map<String, Object>) o : new LinkedHashMap<>();
  }

  @SuppressWarnings("unchecked")
  static List<Object> asList(Object o) {
    return o instanceof List ? (List<Object>) o : new ArrayList<>();
  }

  // ---------------------------------------------------------------- parsing

  static class StringSource extends SimpleJavaFileObject {
    final String code;

    StringSource(String className, String code) {
      super(URI.create("string:///" + className + ".java"), Kind.SOURCE);
      this.code = code;
    }

    @Override
    public CharSequence getCharContent(boolean ignoreEncodingErrors) {
      return code;
    }
  }

  /** One eligible injection point: a declaration initializer or an assignment rhs. */
  record InjectPoint(String name, String type, long start, long end) {}

  /** A parsed program: source, syntax verdict, structure facts, injection points. */
  static class Parsed {
    String source;
    String error; // first parse error, or null
    String mainClass = "Main";
    final List<InjectPoint> points = new ArrayList<>();
    final java.util.Set<String> callNames = new java.util.HashSet<>();
    final java.util.Set<String> variableNames = new java.util.HashSet<>();
    final java.util.Set<String> methodNames = new java.util.HashSet<>();
    final java.util.Set<Long> intLiterals = new java.util.HashSet<>();
    final List<String> comments = new ArrayList<>();
    boolean hasLoop;

    // javac's tree drops comments, so they're collected lexically: walk the
    // source skipping string/char literals (and text blocks), record // and
    // /* */ comment bodies.
    void collectComments() {
      int i = 0;
      int n = source.length();
      while (i < n) {
        char c = source.charAt(i);
        if (c == '"' && i + 2 < n && source.charAt(i + 1) == '"' && source.charAt(i + 2) == '"') {
          i += 3; // text block
          while (i + 2 < n
              && !(source.charAt(i) == '"'
                  && source.charAt(i + 1) == '"'
                  && source.charAt(i + 2) == '"')) {
            i++;
          }
          i = Math.min(i + 3, n);
        } else if (c == '"' || c == '\'') {
          i++;
          while (i < n && source.charAt(i) != c) {
            if (source.charAt(i) == '\\') i++;
            i++;
          }
          i++;
        } else if (c == '/' && i + 1 < n && source.charAt(i + 1) == '/') {
          int end = source.indexOf('\n', i);
          if (end < 0) end = n;
          comments.add(source.substring(i + 2, end));
          i = end;
        } else if (c == '/' && i + 1 < n && source.charAt(i + 1) == '*') {
          int end = source.indexOf("*/", i + 2);
          if (end < 0) end = n;
          comments.add(source.substring(i + 2, Math.min(end, n)));
          i = Math.min(end + 2, n);
        } else {
          i++;
        }
      }
    }

    static Parsed of(String source) {
      Parsed parsed = new Parsed();
      parsed.source = source;
      DiagnosticCollector<JavaFileObject> diags = new DiagnosticCollector<>();
      // -Xjcov makes javac record end positions, needed to splice initializers.
      JavacTask task =
          (JavacTask)
              COMPILER.getTask(
                  new StringWriter(),
                  null,
                  diags,
                  List.of("-Xjcov"),
                  null,
                  List.of(new StringSource("Main", source)));
      Iterable<? extends CompilationUnitTree> units;
      try {
        units = task.parse();
      } catch (Exception e) {
        parsed.error = "parse failed: " + e.getMessage();
        return parsed;
      }
      for (Diagnostic<? extends JavaFileObject> d : diags.getDiagnostics()) {
        if (d.getKind() == Diagnostic.Kind.ERROR) {
          parsed.error = "line " + d.getLineNumber() + ": " + d.getMessage(Locale.ENGLISH);
          return parsed;
        }
      }
      Trees trees = Trees.instance(task);
      SourcePositions positions = trees.getSourcePositions();
      for (CompilationUnitTree unit : units) {
        parsed.scan(unit, positions);
      }
      parsed.collectComments();
      return parsed;
    }

    void scan(CompilationUnitTree unit, SourcePositions positions) {
      Map<String, String> declaredTypes = new LinkedHashMap<>();
      new TreePathScanner<Void, Void>() {
        @Override
        public Void visitClass(ClassTree node, Void unused) {
          if (mainClass.equals("Main") && node.getMembers() != null) {
            for (Tree member : node.getMembers()) {
              if (member instanceof MethodTree m && m.getName().contentEquals("main")) {
                mainClass = node.getSimpleName().toString();
              }
            }
          }
          return super.visitClass(node, unused);
        }

        @Override
        public Void visitMethod(MethodTree node, Void unused) {
          methodNames.add(node.getName().toString());
          return super.visitMethod(node, unused);
        }

        @Override
        public Void visitMethodInvocation(MethodInvocationTree node, Void unused) {
          ExpressionTree select = node.getMethodSelect();
          if (select instanceof IdentifierTree id) callNames.add(id.getName().toString());
          if (select instanceof MemberSelectTree ms) callNames.add(ms.getIdentifier().toString());
          return super.visitMethodInvocation(node, unused);
        }

        @Override
        public Void visitNewClass(NewClassTree node, Void unused) {
          // `new Player(...)` counts as a call to `Player` so OOP lessons can
          // require object creation via { kind: "call", name: "<ClassName>" }.
          if (node.getIdentifier() != null) callNames.add(node.getIdentifier().toString());
          return super.visitNewClass(node, unused);
        }

        @Override
        public Void visitVariable(VariableTree node, Void unused) {
          String name = node.getName().toString();
          Tree parent = getCurrentPath().getParentPath().getLeaf();
          // Params (parent = MethodTree) are not "variables" for structure rules.
          if (!(parent instanceof MethodTree)) variableNames.add(name);
          // `var` declarations have a null type tree.
          String type = node.getType() == null ? "" : node.getType().toString();
          declaredTypes.put(name, type);
          if (node.getInitializer() != null && isEligible(parent)) {
            long start = positions.getStartPosition(unit, node.getInitializer());
            long end = positions.getEndPosition(unit, node.getInitializer());
            if (start >= 0 && end > start) {
              points.add(new InjectPoint(name, type, start, end));
            }
          }
          return super.visitVariable(node, unused);
        }

        @Override
        public Void visitAssignment(AssignmentTree node, Void unused) {
          if (node.getVariable() instanceof IdentifierTree id) {
            String name = id.getName().toString();
            variableNames.add(name);
            Tree parent = getCurrentPath().getParentPath().getLeaf();
            if (parent instanceof ExpressionStatementTree
                && isEligible(getCurrentPath().getParentPath().getParentPath().getLeaf())) {
              long start = positions.getStartPosition(unit, node.getExpression());
              long end = positions.getEndPosition(unit, node.getExpression());
              if (start >= 0 && end > start) {
                points.add(new InjectPoint(name, declaredTypes.get(name), start, end));
              }
            }
          }
          return super.visitAssignment(node, unused);
        }

        // Direct statements of a method body, or fields — the Java analog of
        // Python's module-level assignments. Nested blocks (if/loop bodies)
        // are deliberately not injectable, same as Python.
        private boolean isEligible(Tree parent) {
          if (parent instanceof ClassTree) return true;
          if (parent instanceof BlockTree) {
            Tree grandparent = findParentOf(parent);
            return grandparent instanceof MethodTree;
          }
          return false;
        }

        private Tree findParentOf(Tree tree) {
          var path = getCurrentPath();
          while (path != null && path.getLeaf() != tree) path = path.getParentPath();
          return path != null && path.getParentPath() != null
              ? path.getParentPath().getLeaf()
              : null;
        }

        @Override
        public Void visitForLoop(ForLoopTree node, Void unused) {
          hasLoop = true;
          return super.visitForLoop(node, unused);
        }

        @Override
        public Void visitEnhancedForLoop(EnhancedForLoopTree node, Void unused) {
          hasLoop = true;
          return super.visitEnhancedForLoop(node, unused);
        }

        @Override
        public Void visitWhileLoop(WhileLoopTree node, Void unused) {
          hasLoop = true;
          return super.visitWhileLoop(node, unused);
        }

        @Override
        public Void visitDoWhileLoop(DoWhileLoopTree node, Void unused) {
          hasLoop = true;
          return super.visitDoWhileLoop(node, unused);
        }

        @Override
        public Void visitLiteral(LiteralTree node, Void unused) {
          if (node.getValue() instanceof Integer i) intLiterals.add(i.longValue());
          if (node.getValue() instanceof Long l) intLiterals.add(l);
          return super.visitLiteral(node, unused);
        }
      }.scan(unit, null);
      points.sort(Comparator.comparingLong(InjectPoint::start));
    }

    /** Splices the case's values into this program's injection points. */
    Injected withInjected(Map<String, Object> inject) {
      if (inject.isEmpty()) return new Injected(source, mainClass);
      Map<String, List<Object>> remaining = new LinkedHashMap<>();
      for (Map.Entry<String, Object> e : inject.entrySet()) {
        // A bare JSON array = per-occurrence values (reassignment lessons);
        // a whole list is spelled { "$list": [...] }, same as Python.
        if (e.getValue() instanceof List<?> list) {
          remaining.put(e.getKey(), new ArrayList<>(list));
        } else {
          List<Object> single = new ArrayList<>();
          single.add(e.getValue());
          remaining.put(e.getKey(), single);
        }
      }
      record Splice(long start, long end, String text) {}
      List<Splice> splices = new ArrayList<>();
      for (InjectPoint point : points) {
        List<Object> values = remaining.get(point.name());
        if (values == null || values.isEmpty()) continue;
        splices.add(new Splice(point.start(), point.end(), Render.value(values.remove(0), point.type())));
      }
      StringBuilder out = new StringBuilder(source);
      for (int i = splices.size() - 1; i >= 0; i--) {
        Splice s = splices.get(i);
        out.replace((int) s.start(), (int) s.end(), s.text());
      }
      return new Injected(out.toString(), mainClass);
    }
  }

  record Injected(String source, String mainClass) {}

  // ------------------------------------------------------- structure checks

  static class Structure {
    static List<Object> check(Parsed parsed, Map<String, Object> structure) {
      List<Object> failures = new ArrayList<>();
      for (Object rule : asList(structure.getOrDefault("requires", new ArrayList<>()))) {
        if (!holds(parsed, asMap(rule))) failures.add(failure("require", rule));
      }
      for (Object rule : asList(structure.getOrDefault("forbids", new ArrayList<>()))) {
        if (holds(parsed, asMap(rule))) failures.add(failure("forbid", rule));
      }
      return failures;
    }

    static Map<String, Object> failure(String type, Object rule) {
      Map<String, Object> f = new LinkedHashMap<>();
      f.put("type", type);
      f.put("rule", rule);
      return f;
    }

    static boolean holds(Parsed parsed, Map<String, Object> rule) {
      String kind = rule.get("kind") instanceof String s ? s : "";
      String name = rule.get("name") instanceof String s ? s : "";
      switch (kind) {
        case "call":
          return parsed.callNames.contains(name);
        case "variable":
          return parsed.variableNames.contains(name);
        case "function":
          return parsed.methodNames.contains(name);
        case "loop":
          return parsed.hasLoop;
        case "int_literal":
          for (Object v : asList(rule.getOrDefault("values", new ArrayList<>()))) {
            if (v instanceof Long l && parsed.intLiterals.contains(l)) return true;
          }
          return false;
        case "comment":
          {
            String rawNeedle = rule.get("contains") instanceof String s ? s : "";
            String needle = rawNeedle.replaceAll("\\s+", "");
            for (String comment : parsed.comments) {
              if (needle.isEmpty() || comment.replaceAll("\\s+", "").contains(needle)) return true;
            }
            return false;
          }
        default:
          // Unknown kinds behave like the Python runner: a require passes, a
          // forbid always fires (so a typo'd spec is caught while authoring).
          return true;
      }
    }
  }

  // ------------------------------------------------------- value rendering

  static class Render {
    /** Renders a JSON inject value as a Java literal, guided by the declared type. */
    static String value(Object v, String declaredType) {
      String type = declaredType == null ? "" : declaredType;
      if (v instanceof Map<?, ?> m && m.containsKey("$list")) {
        return list(Runner.asList(m.get("$list")), type);
      }
      if (v instanceof Map<?, ?> m && m.containsKey("$dict")) {
        return dict(Runner.asMap(m.get("$dict")), type);
      }
      if (v instanceof String s) {
        if (type.equals("char") && s.length() == 1) {
          return "'" + escapeChar(s.charAt(0)) + "'";
        }
        return quote(s);
      }
      if (v instanceof Boolean b) return b.toString();
      if (v instanceof Long l) {
        if (type.equals("long")) return l + "L";
        if (type.equals("float")) return l + "f";
        return l.toString();
      }
      if (v instanceof Double d) {
        return type.equals("float") ? d + "f" : d.toString();
      }
      return "null";
    }

    static String list(List<Object> elements, String type) {
      StringBuilder rendered = new StringBuilder();
      if (type.endsWith("[]")) {
        String elementType = type.substring(0, type.length() - 2);
        rendered.append("new ").append(type).append("{");
        for (int i = 0; i < elements.size(); i++) {
          if (i > 0) rendered.append(", ");
          rendered.append(value(elements.get(i), elementType));
        }
        return rendered.append("}").toString();
      }
      String elementType = genericArg(type, 0);
      rendered.append("new java.util.ArrayList<>(java.util.List.of(");
      for (int i = 0; i < elements.size(); i++) {
        if (i > 0) rendered.append(", ");
        rendered.append(value(elements.get(i), elementType));
      }
      return rendered.append("))").toString();
    }

    // LinkedHashMap keeps insertion order — it matters for lessons that loop
    // over keys/values, and it subclasses HashMap so the declaration still
    // typechecks. Double-brace init is the only expression-position way to
    // build an ordered map without imports.
    static String dict(Map<String, Object> pairs, String type) {
      String keyType = genericArg(type, 0);
      String valueType = genericArg(type, 1);
      StringBuilder rendered = new StringBuilder("new java.util.LinkedHashMap<>() {{ ");
      for (Map.Entry<String, Object> e : pairs.entrySet()) {
        Object key =
            (keyType.equals("Integer") || keyType.equals("Long")) ? Long.valueOf(e.getKey()) : e.getKey();
        rendered
            .append("put(")
            .append(value(key, keyType))
            .append(", ")
            .append(value(e.getValue(), valueType))
            .append("); ");
      }
      return rendered.append("}}").toString();
    }

    static String genericArg(String type, int index) {
      int open = type.indexOf('<');
      int close = type.lastIndexOf('>');
      if (open < 0 || close <= open) return "";
      String[] args = type.substring(open + 1, close).split(",");
      return index < args.length ? args[index].trim() : "";
    }

    static String quote(String s) {
      StringBuilder out = new StringBuilder("\"");
      for (int i = 0; i < s.length(); i++) out.append(escapeChar(s.charAt(i)));
      return out.append("\"").toString();
    }

    static String escapeChar(char c) {
      switch (c) {
        case '"':
          return "\\\"";
        case '\'':
          return "\\'";
        case '\\':
          return "\\\\";
        case '\n':
          return "\\n";
        case '\r':
          return "\\r";
        case '\t':
          return "\\t";
        default:
          return c < 0x20 ? String.format("\\u%04x", (int) c) : String.valueOf(c);
      }
    }
  }

  // ------------------------------------------------------------ compilation

  record Compiled(Path classDir, String mainClass, String error) {}

  /** Compiles sources into per-source /tmp dirs, memoized so inject-free cases reuse classes. */
  static class CompiledCache {
    final Map<String, Compiled> bySource = new LinkedHashMap<>();
    int next;

    Compiled compile(Parsed parsed) {
      return compile(new Injected(parsed.source, parsed.mainClass));
    }

    Compiled compile(Injected program) {
      Compiled cached = bySource.get(program.source());
      if (cached != null) return cached;
      Compiled compiled = doCompile(program);
      bySource.put(program.source(), compiled);
      return compiled;
    }

    Compiled doCompile(Injected program) {
      Path dir = WORK_ROOT.resolve("c" + next++);
      try {
        Files.createDirectories(dir);
      } catch (IOException e) {
        return new Compiled(dir, program.mainClass(), "internal: " + e.getMessage());
      }
      DiagnosticCollector<JavaFileObject> diags = new DiagnosticCollector<>();
      StandardJavaFileManager fm =
          COMPILER.getStandardFileManager(diags, null, StandardCharsets.UTF_8);
      boolean ok =
          COMPILER
              .getTask(
                  new StringWriter(),
                  fm,
                  diags,
                  List.of("-d", dir.toString()),
                  null,
                  List.of(new StringSource(program.mainClass(), program.source())))
              .call();
      if (!ok) {
        for (Diagnostic<? extends JavaFileObject> d : diags.getDiagnostics()) {
          if (d.getKind() == Diagnostic.Kind.ERROR) {
            return new Compiled(
                dir,
                program.mainClass(),
                "line " + d.getLineNumber() + ": " + d.getMessage(Locale.ENGLISH));
          }
        }
        return new Compiled(dir, program.mainClass(), "compilation failed");
      }
      return new Compiled(dir, program.mainClass(), null);
    }
  }

  // -------------------------------------------------------------- execution

  static class Gobbler extends Thread {
    final InputStream in;
    final ByteArrayOutputStream buffer = new ByteArrayOutputStream();

    Gobbler(InputStream in) {
      this.in = in;
      setDaemon(true);
    }

    @Override
    public void run() {
      byte[] chunk = new byte[8192];
      try {
        int n;
        while ((n = in.read(chunk)) != -1) {
          int room = OUTPUT_CAP - buffer.size();
          if (room > 0) buffer.write(chunk, 0, Math.min(n, room));
          // past the cap: keep draining so the child never blocks on a full pipe
        }
      } catch (IOException ignored) {
        // stream closed by process death — whatever was read still counts
      }
    }

    String text() {
      return buffer.toString(StandardCharsets.UTF_8);
    }
  }

  static Map<String, Object> runProgram(Compiled program, String stdin) {
    Map<String, Object> out = new LinkedHashMap<>();
    try {
      Process proc =
          new ProcessBuilder(
                  "java",
                  "-XX:+UseSerialGC",
                  "-XX:TieredStopAtLevel=1",
                  "-Xmx48m",
                  "-cp",
                  program.classDir().toString(),
                  program.mainClass())
              .start();
      Gobbler stdout = new Gobbler(proc.getInputStream());
      Gobbler stderr = new Gobbler(proc.getErrorStream());
      stdout.start();
      stderr.start();
      try (OutputStream stdinPipe = proc.getOutputStream()) {
        stdinPipe.write(stdin.getBytes(StandardCharsets.UTF_8));
      } catch (IOException ignored) {
        // the program exited without reading its stdin — that's fine
      }
      boolean finished = proc.waitFor(CASE_TIMEOUT_SEC, TimeUnit.SECONDS);
      if (!finished) {
        proc.descendants().forEach(ProcessHandle::destroyForcibly);
        proc.destroyForcibly();
        proc.waitFor(2, TimeUnit.SECONDS);
      }
      stdout.join(1000);
      stderr.join(1000);
      out.put("stdout", stdout.text());
      out.put("stderr", stderr.text());
      out.put("exit", finished ? (long) proc.exitValue() : -1L);
      out.put("timedOut", !finished);
    } catch (IOException | InterruptedException e) {
      out.put("stdout", "");
      out.put("stderr", "internal: " + e.getMessage());
      out.put("exit", -1L);
      out.put("timedOut", false);
    }
    return out;
  }

  // ------------------------------------------------------------------- JSON

  /** Minimal JSON parse/emit — the runtime image ships no JSON library. */
  static class Json {
    final String text;
    int pos;

    Json(String text) {
      this.text = text;
    }

    static Object parse(String text) {
      Json p = new Json(text);
      p.skipWhitespace();
      Object value = p.readValue();
      p.skipWhitespace();
      return value;
    }

    Object readValue() {
      char c = text.charAt(pos);
      switch (c) {
        case '{':
          return readObject();
        case '[':
          return readArray();
        case '"':
          return readString();
        case 't':
          expect("true");
          return Boolean.TRUE;
        case 'f':
          expect("false");
          return Boolean.FALSE;
        case 'n':
          expect("null");
          return null;
        default:
          return readNumber();
      }
    }

    Map<String, Object> readObject() {
      Map<String, Object> map = new LinkedHashMap<>();
      pos++; // {
      skipWhitespace();
      if (text.charAt(pos) == '}') {
        pos++;
        return map;
      }
      while (true) {
        skipWhitespace();
        String key = readString();
        skipWhitespace();
        pos++; // :
        skipWhitespace();
        map.put(key, readValue());
        skipWhitespace();
        char c = text.charAt(pos++);
        if (c == '}') return map;
        // else ',' — continue
      }
    }

    List<Object> readArray() {
      List<Object> list = new ArrayList<>();
      pos++; // [
      skipWhitespace();
      if (text.charAt(pos) == ']') {
        pos++;
        return list;
      }
      while (true) {
        skipWhitespace();
        list.add(readValue());
        skipWhitespace();
        char c = text.charAt(pos++);
        if (c == ']') return list;
        // else ',' — continue
      }
    }

    String readString() {
      StringBuilder out = new StringBuilder();
      pos++; // opening quote
      while (true) {
        char c = text.charAt(pos++);
        if (c == '"') return out.toString();
        if (c != '\\') {
          out.append(c);
          continue;
        }
        char esc = text.charAt(pos++);
        switch (esc) {
          case 'n' -> out.append('\n');
          case 't' -> out.append('\t');
          case 'r' -> out.append('\r');
          case 'b' -> out.append('\b');
          case 'f' -> out.append('\f');
          case 'u' -> {
            out.append((char) Integer.parseInt(text.substring(pos, pos + 4), 16));
            pos += 4;
          }
          default -> out.append(esc); // \" \\ \/
        }
      }
    }

    Object readNumber() {
      int start = pos;
      while (pos < text.length() && "+-0123456789.eE".indexOf(text.charAt(pos)) >= 0) pos++;
      String raw = text.substring(start, pos);
      if (raw.contains(".") || raw.contains("e") || raw.contains("E")) {
        return Double.parseDouble(raw);
      }
      return Long.parseLong(raw);
    }

    void expect(String literal) {
      pos += literal.length();
    }

    void skipWhitespace() {
      while (pos < text.length() && Character.isWhitespace(text.charAt(pos))) pos++;
    }

    static String write(Object value) {
      StringBuilder out = new StringBuilder();
      writeValue(value, out);
      return out.toString();
    }

    static void writeValue(Object value, StringBuilder out) {
      if (value == null) {
        out.append("null");
      } else if (value instanceof String s) {
        writeString(s, out);
      } else if (value instanceof Boolean || value instanceof Long || value instanceof Integer) {
        out.append(value);
      } else if (value instanceof Double d) {
        out.append(d.doubleValue());
      } else if (value instanceof Map<?, ?> map) {
        out.append('{');
        boolean first = true;
        for (Map.Entry<?, ?> e : map.entrySet()) {
          if (!first) out.append(',');
          first = false;
          writeString(String.valueOf(e.getKey()), out);
          out.append(':');
          writeValue(e.getValue(), out);
        }
        out.append('}');
      } else if (value instanceof List<?> list) {
        out.append('[');
        for (int i = 0; i < list.size(); i++) {
          if (i > 0) out.append(',');
          writeValue(list.get(i), out);
        }
        out.append(']');
      } else {
        writeString(String.valueOf(value), out);
      }
    }

    static void writeString(String s, StringBuilder out) {
      out.append('"');
      for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        switch (c) {
          case '"' -> out.append("\\\"");
          case '\\' -> out.append("\\\\");
          case '\n' -> out.append("\\n");
          case '\r' -> out.append("\\r");
          case '\t' -> out.append("\\t");
          default -> {
            if (c < 0x20) out.append(String.format("\\u%04x", (int) c));
            else out.append(c);
          }
        }
      }
      out.append('"');
    }
  }
}

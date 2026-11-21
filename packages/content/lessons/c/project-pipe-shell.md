The Mini Shell project ran one command at a time. Now you know enough to build a real one: pipelines, redirection to and from files, exit statuses, and commands that change the shell itself. This project uses the whole OS part of the course: fork, exec, wait, pipe, dup2, open and errno

There is no code to copy, only a plan. Build it step by step, and test each step before the next

---

**Step 1: one command.** Read a line, split it into words with strtok, fork, execvp in the child, waitpid in the parent. Keep the exit status of the last command

**Step 2: built-in commands.** Some commands can't be separate programs, because they must change the shell itself. A child that calls chdir changes only its own folder, then ends, and the shell stays where it was. So the shell runs these itself, without fork

- `cd dir`: call **chdir**, from unistd.h. When it fails, print the reason
- `status`: print the exit status of the last command, like `$?` in a real shell
- `exit`: stop the shell

**Step 3: redirection.** Before exec, the child opens the file and moves it onto 0 or 1 with dup2, as in the dup2 lesson. `>` makes the file new and empty, `>>` adds to its end with O_APPEND

**Step 4: pipelines.** Split the words into stages at every `|`. With k stages you need k - 1 pipes. Stage i reads from pipe i - 1 and writes to pipe i. Remember the big rule from the pipeline lesson: every process closes every pipe end it doesn't use, and the parent closes all of them. Then wait for all the stages. The status is the last stage's

---

A good way to keep it tidy is to first turn a line into stages, and only then run them

```c
#include <stdio.h>

struct stage {
    char *args[16];
    char *in;
    char *out;
    int append;
};

int main(void) {
    // sort -r < names.txt >> sorted.txt
    struct stage s = { { "sort", "-r", NULL }, "names.txt", "sorted.txt", 1 };
    printf("run: %s %s\n", s.args[0], s.args[1]);
    printf("in: %s, out: %s, append: %d\n", s.in, s.out, s.append);
    return 0;
}
```

Output

```text
run: sort -r
in: names.txt, out: sorted.txt, append: 1
```

in and out stay NULL when there's no redirection

---

## Mission: The Pipe Shell

1. Read lines until the input ends or until `exit`. Skip empty lines. Words are separated by single spaces, and `|`, `<`, `>`, `>>` are always words of their own
2. Built-ins, always alone on their line
   - `cd dir`: change the shell's folder. If it fails, print `cd: `, the folder, `: ` and the reason from strerror, and set the status to 1. Otherwise the status is 0
   - `status`: print the last status
   - `exit`: stop
3. Any other line is a pipeline of 1 to 4 commands, separated by `|`
   - `< file` can come only in the first command, `> file` or `>> file` only in the last one
   - If the input file can't be opened, print the file name, `: ` and the reason, set the status to 1, and run nothing
   - If exec fails, the child prints the name and `: command not found` to **stderr**, and exits with 127
   - The status is the exit status of the last command
4. Call fflush(stdout) before every fork

The commands never read input unless it comes from `<` or from a pipe. Lines have at most 200 characters. At the start, the status is 0

**Example**

Input

```text
echo hello tape room | tr a-z A-Z
seq 5 > nums.txt
sort -rn < nums.txt | head -n 2
seq 3 >> nums.txt
wc -l < nums.txt
nosuchcmd
status
cd nowhere
status
```

Output

```text
HELLO TAPE ROOM
5
4
8
127
cd: nowhere: No such file or directory
1
```

nosuchcmd prints its error to stderr, so it's not part of the output. The tests check only what goes to stdout

Let's build a **quiz game**! We'll store questions, possible answers, and the correct answer in a data structure, then loop through them and keep score

This project teaches us how to **organize data**, **loop through it**, and **track state** — skills that show up in every real program

---

How do we store a quiz question? A **dictionary** is perfect

```py
question = {
    "text": "What is the capital of Vice City's state?",
    "options": ["A) New York", "B) Miami", "C) Los Angeles", "D) Chicago"],
    "answer": "B"
}
```

And a full quiz? A **list of dictionaries**

```py
quiz = [
    {
        "text": "What does print() do?",
        "options": ["A) Reads input", "B) Displays output", "C) Creates a variable", "D) Loops"],
        "answer": "B"
    },
    {
        "text": "What symbol is used for comments in Python?",
        "options": ["A) //", "B) /*", "C) #", "D) --"],
        "answer": "C"
    },
    {
        "text": "What does len() return?",
        "options": ["A) The type", "B) The value", "C) The length", "D) Nothing"],
        "answer": "C"
    }
]
```

---

Now let's build the game logic

```py
score = 0

for i, q in enumerate(quiz):
    print(f"\nQuestion {i + 1}: {q['text']}")
    for option in q["options"]:
        print(f"  {option}")

    answer = input("Your answer (A/B/C/D): ").upper()

    if answer == q["answer"]:
        print("Correct!")
        score += 1
    else:
        print(f"Wrong! The answer was {q['answer']}")

print(f"\nYou scored {score}/{len(quiz)}")
```

Notice what we used: **list of dictionaries**, **enumerate**, **for loops**, **if/else**, **input**, **string methods** (.upper()), **f-strings**, and the **counter pattern**. All the tools from this curriculum, working together

---

Let's make it even better with a function

```py
def run_quiz(questions):
    score = 0

    for i, q in enumerate(questions):
        print(f"\nQuestion {i + 1}: {q['text']}")
        for option in q["options"]:
            print(f"  {option}")

        answer = input("Your answer: ").upper()

        if answer == q["answer"]:
            print("Correct!")
            score += 1
        else:
            print(f"Wrong! The answer was {q['answer']}")

    return score, len(questions)

score, total = run_quiz(quiz)
percentage = round(score / total * 100)
print(f"\nFinal score: {score}/{total} ({percentage}%)")
```

---

## Mission: Crew Certification Quiz

New crew must pass a certification quiz. The questions and the candidate's answers are already recorded (on the right), so no `input()` is needed — you just grade and report.

1. Write a function **grade_quiz(questions, answers)** that returns how many of the candidate's answers match the `"answer"` field of the matching question.
2. Print `Score: ` followed by the number correct, a `/`, and the total number of questions.
3. Print `Percentage: ` followed by the score as a whole-number percentage (use `round(score / total * 100)`), then a `%`.
4. Print `PASS` if the percentage is `50` or more, otherwise `FAIL`.

**Output**

```text
Score: 3/4
Percentage: 75%
PASS
```

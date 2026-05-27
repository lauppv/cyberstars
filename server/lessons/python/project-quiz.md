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
def runQuiz(questions):
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

score, total = runQuiz(quiz)
percentage = round(score / total * 100)
print(f"\nFinal score: {score}/{total} ({percentage}%)")
```

---

For testing, write a function **gradeQuiz** that takes a list of questions and a list of the player's answers (strings), and returns the **number of correct answers**. No input() needed — the answers are passed as a parameter

```py
quiz = [
    {"text": "1+1?", "options": ["A) 1", "B) 2"], "answer": "B"},
    {"text": "2+2?", "options": ["A) 4", "B) 5"], "answer": "A"},
    {"text": "3+3?", "options": ["A) 5", "B) 6"], "answer": "B"}
]

print(gradeQuiz(quiz, ["B", "A", "B"]))   # 3 (all correct)
print(gradeQuiz(quiz, ["A", "A", "A"]))   # 1 (only second is correct)
print(gradeQuiz(quiz, ["A", "B", "A"]))   # 0 (all wrong)
```

Expected output

```text
3
1
0
```

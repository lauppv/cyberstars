```py
quiz = [
{"text": "Which command shows output?", "answer": "B"},
{"text": "What starts a comment?", "answer": "C"},
{"text": "What does len() return?", "answer": "A"},
{"text": "Which keyword defines a function?", "answer": "D"},
]
player_answers = ["B", "C", "A", "B"]

def grade_quiz(questions, answers):
    correct = 0
    for i in range(len(questions)):
        if questions[i]["answer"] == answers[i]:
            correct += 1
    return correct

score = grade_quiz(quiz, player_answers)
total = len(quiz)
percentage = round(score / total * 100)
print(f"Score: {score}/{total}")
print(f"Percentage: {percentage}%")
if percentage >= 50:
    print("PASS")
else:
    print("FAIL")
```

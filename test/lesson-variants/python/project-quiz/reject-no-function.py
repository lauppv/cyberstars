quiz = [
    {"text": "Which command shows output?", "answer": "B"},
    {"text": "What starts a comment?", "answer": "C"},
    {"text": "What does len() return?", "answer": "A"},
    {"text": "Which keyword defines a function?", "answer": "D"},
]
player_answers = ["B", "C", "A", "B"]

score = 0
for i in range(len(quiz)):
    if quiz[i]["answer"] == player_answers[i]:
        score += 1
pct = round(score / len(quiz) * 100)
print(f"Score: {score}/{len(quiz)}")
print(f"Percentage: {pct}%")
print("PASS" if pct >= 50 else "FAIL")

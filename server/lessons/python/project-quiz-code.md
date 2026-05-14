quiz = [
    {"text": "1+1?", "options": ["A) 1", "B) 2"], "answer": "B"},
    {"text": "2+2?", "options": ["A) 4", "B) 5"], "answer": "A"},
    {"text": "3+3?", "options": ["A) 5", "B) 6"], "answer": "B"}
]

def gradeQuiz(questions, playerAnswers):
    # count how many answers are correct
    pass

print(gradeQuiz(quiz, ["B", "A", "B"]))
print(gradeQuiz(quiz, ["A", "A", "A"]))
print(gradeQuiz(quiz, ["A", "B", "A"]))

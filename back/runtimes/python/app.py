from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)

@app.route("/run", methods=["POST"])
def run_code():
    data = request.get_json()
    code = data.get("code", "")

    # Scriem codul într-un fișier temporar user_code.py
    code_file_path = os.path.join(os.getcwd(), "user_code.py")
    with open(code_file_path, "w") as f:
        f.write(code)

    try:
        # Rulăm codul cu timeout 5 secunde
        result = subprocess.run(
            ["python3", code_file_path],
            capture_output=True,
            text=True,
            timeout=5
        )
        output = result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        output = "Timeout: Codul tău rulează prea mult!"

    return jsonify({"output": output})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

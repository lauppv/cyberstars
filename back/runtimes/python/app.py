from flask import Flask, request, jsonify
import subprocess
import tempfile
import os

app = Flask(__name__)

@app.route("/", methods=["POST"])
def run_code():
    data = request.get_json()
    code = data.get("code", "")
    language = data.get("language", "python").lower()

    # Debug logs
    print("Received code:", code)
    print("Language:", language)

    if language != "python":
        return jsonify({"output": "Only Python is supported in this runner"}), 400

    # Folosim fișier temporar pentru cod
    with tempfile.NamedTemporaryFile(suffix=".py", delete=False) as tmp_file:
        tmp_file.write(code.encode("utf-8"))
        tmp_file_path = tmp_file.name

    try:
        # Rulează codul cu timeout 5 secunde, output unbuffered
        result = subprocess.run(
            ["python3", "-u", tmp_file_path],
            capture_output=True,
            text=True,
            timeout=5
        )
        output = result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        output = "Error: Execution timed out"
    except Exception as e:
        output = f"Error: {str(e)}"
    finally:
        os.remove(tmp_file_path)

    return jsonify({"output": output})

if __name__ == "__main__":
    # Folosește portul asignat de Railway
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting Python runner on port {port}")
    app.run(host="0.0.0.0", port=port)

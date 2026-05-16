
# AI-Powered-Platform-For-Democratizing-Sports-Talent-Assessment

Compact desktop prototype demonstrating basic sports talent assessment using pose-based video analysis and a simple role-based dashboard.

> NOTE: This project is a learning/prototype implementation. Do not use it to store real user credentials or deploy as-is.

## What this repository contains
- A Tkinter-based GUI for user registration and login (`register.py`, `login.py`).
- A role-aware dashboard with player/coach views and tournament listings (`dashboard.py`).
- A video analysis tool that uses MediaPipe pose estimation and OpenCV to compute angles and generate coaching suggestions (`main.py`).
- A simple, plain-text user database: `users.txt` (CSV format: `username,password,role,location,phone`).

## How the app runs (execution path)
1. Typical start: `python login.py` — opens the Login UI.
2. On successful login the app launches `dashboard.launch_dashboard(...)` from `dashboard.py`.
3. Players may fill the player form and click **Launch Video Analysis**, which calls `main.run_app()` to open the analyzer window.
4. The analyzer loads video files, processes frames with MediaPipe, computes angles with NumPy, and overlays suggestions on frames using OpenCV and PIL for display.

## Techniques and design choices
- Pose estimation: MediaPipe Pose for landmark extraction.
- Video processing: OpenCV for reading frames, drawing shapes, and resizing.
- Numeric math: NumPy for vector arithmetic and angle calculations.
- GUI: Tkinter + Pillow for desktop UI and image widgets.
- Persistence: Plain-text CSV file (`users.txt`) for quick demonstration.
- Suggestion logic: Rule-based heuristics (thresholds and angle rules) implemented in `main.py`.

## Dependencies (install before running)
Install into a virtual environment. Minimal packages used in this project:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install mediapipe opencv-python numpy Pillow
```

Optional but recommended tools for development:
- `bcrypt` or `passlib` for secure password hashing (not currently used).

## Project structure (key files)
- [login.py](login.py) — Login UI and authentication flow (entrypoint).
- [register.py](register.py) — User registration with validation and role selection.
- [dashboard.py](dashboard.py) — Role-based dashboard, player forms, tournament listings, and links to video analysis.
- [main.py](main.py) — Video analyzer: MediaPipe setup, frame processing, and suggestion rules.
- [users.txt](users.txt) — Plain-text user store (CSV lines).
- [logo.png](logo.png) — Optional logo shown in UIs.

## How to use (quick start)
1. Create and activate a virtual environment (PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies:

```powershell
pip install mediapipe opencv-python numpy Pillow
```

3. Register a user (optional) and login:

```powershell
python register.py   # create an account (or edit users.txt manually)
python login.py      # start the app and login
```

4. From the dashboard, for Players: fill the form and click **Launch Video Analysis**, then upload a video file (mp4/mov/avi).

## Security & limitations
- Passwords are stored in plain text in `users.txt`. This is insecure — do not store real user credentials here.
- There is no server-side validation, rate limiting, or secure transport (TLS) — this is a local desktop prototype.
- The analysis logic is heuristic and not a substitute for professional coaching or validated biomechanical metrics.

## Recommended next steps (prioritized)
1. Add `requirements.txt` with pinned package versions.
2. Replace `users.txt` with an SQLite database and hash passwords with `bcrypt`/`passlib`.
3. Separate UI from analysis logic (move MediaPipe/OpenCV processing to a module) and add unit tests for math/heuristics.
4. Add logging, input validation, and basic error handling for video formats.
5. Optionally wrap as a minimal web service (Flask/FastAPI) for easier testing and integration.

## Notes from current repository
- `users.txt` contains test users (example entries present). See `users.txt` for sample CSV lines.
- The analyzer (`main.py`) expects MediaPipe and OpenCV to be available and uses a Tkinter window for interaction.

---



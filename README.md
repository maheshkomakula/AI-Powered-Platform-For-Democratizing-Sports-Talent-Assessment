
# SIH — Authentication Demo (Updated)

Professional, minimal demonstration of a local authentication flow implemented in plain Python. This repository is intended for learning and prototyping only — it is not designed for production use.

## Contents
- Overview
- Requirements
- Installation
- Running the application
- Usage examples
- Project structure
- Security & limitations
- Suggested improvements
- Contributing

## Overview
This project provides a compact example of user registration, authentication, and a post-login dashboard using a file-based user store. The code is intentionally small and readable to facilitate study and extension.

## Requirements
- Python 3.8 or later
- Optional: `pip` to install extra dependencies when adding libraries

## Installation
1. Clone or copy the project to your local machine.
2. From the project root create and activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

3. If you add external libraries, record them in `requirements.txt` and install with:

```powershell
pip install -r requirements.txt
```

## Running the application
Run the primary entry point from the project root:

```powershell
python main.py
```

Depending on the implementation, `main.py` will route to the registration or login flow, or you can run the flow scripts directly:

```powershell
python register.py
python login.py
```

## Usage examples
- Register a user: run `python register.py` and follow the prompts to create a username and password.
- Authenticate: run `python login.py` and provide the registered credentials; on success you will be shown the dashboard implemented by `dashboard.py`.

Example (CLI):

```powershell
python register.py
# Enter username: alice
# Enter password: ********

python login.py
# Username: alice
# Password: ********
# Login successful — launching dashboard
```

## Project structure
- `main.py` — application entry point
- `register.py` — user registration script
- `login.py` — authentication script
- `dashboard.py` — post-login interface
- `users.txt` — local, plain-text user store (one record per line)

## Security & limitations
- The current implementation uses a plaintext file (`users.txt`) to store credentials. This is insecure and suitable only for demonstrations.
- No rate-limiting, account lockout, or input sanitization is enforced.

Recommendations for production readiness:
- Use a database (SQLite for small deployments, PostgreSQL/MySQL for larger systems).
- Hash passwords with a modern algorithm (e.g., `bcrypt`) and use per-password salts.
- Use secure transport (TLS) when credentials are sent over a network.
- Add input validation, logging, and brute-force protections.

## Suggested improvements
- Add `requirements.txt` and pin dependency versions.
- Replace `users.txt` with an SQLite-backed user table and parameterized queries.
- Integrate `bcrypt` for password hashing (`pip install bcrypt`).
- Add unit tests for the register/login flows and CI configuration.
- Provide a minimal web interface (Flask/FastAPI) for learning web authentication patterns.

## Contributing
Contributions and suggestions are welcome. When contributing:
- Do not commit real user credentials or secrets.
- Provide tests for new behavior.
- Open an issue to discuss larger changes before implementing.

---

If you would like, I can also create a `requirements.txt`, add password hashing, or scaffold an SQLite migration and example. Tell me which improvement you'd like next.


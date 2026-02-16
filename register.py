import tkinter as tk
from tkinter import ttk, messagebox
from PIL import Image, ImageTk
import re
import os
import login  # to redirect to login page

USER_FILE = "users.txt"

TELANGANA_DISTRICTS = [
    "Adilabad", "Bhadradri Kothagudem", "Hanamkonda", "Hyderabad", "Jagtial",
    "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar",
    "Khammam", "Kumuram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial",
    "Medak", "Medchal–Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda",
    "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla",
    "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad",
    "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"
]

# ---------------- Utilities ----------------
def load_users():
    users = {}
    if os.path.exists(USER_FILE):
        with open(USER_FILE, "r") as f:
            for line in f:
                parts = line.strip().split(",")
                if len(parts) == 5:
                    username, password, role, location, phone = parts
                    users[username] = (password, role, location, phone)
    return users

def save_user(username, password, role, location, phone="-"):
    with open(USER_FILE, "a") as f:
        f.write(f"{username},{password},{role},{location},{phone}\n")

def toggle_password(entry, btn):
    if entry.cget("show") == "":
        entry.config(show="*")
        btn.config(text="Show")
    else:
        entry.config(show="")
        btn.config(text="Hide")

def validate_password(password):
    if len(password) < 6:
        return "Password must be at least 6 characters."
    if not re.search(r"[A-Z]", password):
        return "Password must contain at least one uppercase letter."
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return "Password must contain at least one special character."
    return None

# ---------------- Registration Logic ----------------
def register_user():
    username = entry_username.get().strip()
    password = entry_password.get()
    confirm = entry_confirm.get()
    role = combo_role.get()
    location = combo_location.get()
    phone = entry_phone.get().strip() if role == "Player" else "-"

    users = load_users()
    if not username or not password or not confirm or not role or not location:
        messagebox.showerror("Error", "All fields are required!")
        return
    if username in users:
        messagebox.showerror("Error", "Username already exists!")
        return
    pwd_error = validate_password(password)
    if pwd_error:
        messagebox.showerror("Error", pwd_error)
        return
    if password != confirm:
        messagebox.showerror("Error", "Passwords do not match!")
        return
    if role == "Player" and (not phone.isdigit() or len(phone) != 10):
        messagebox.showerror("Error", "Phone number must be 10 digits!")
        return

    save_user(username, password, role, location, phone)
    messagebox.showinfo("Success", f"User {username} registered successfully as {role}!")
    root.destroy()
    login.launch_login()

# ---------------- UI Setup -----------------
def launch_register():
    global root, entry_username, entry_password, entry_confirm, combo_role, combo_location, entry_phone
    root = tk.Tk()
    root.title("Register - Sports Talent Platform")
    root.state("zoomed")
    root.configure(bg="#FFE5B4")

    # Center card
    card = tk.Frame(root, bg="#ffffff", bd=0, relief=tk.RAISED)
    card.place(relx=0.5, rely=0.5, anchor="center", relwidth=0.45, relheight=0.90)

    # Logo
    try:
        logo_img = Image.open("logo.png")
        ratio = 150 / float(logo_img.size[0])
        logo_img = logo_img.resize((150, int(logo_img.size[1] * ratio)), Image.Resampling.LANCZOS)
        logo_img = ImageTk.PhotoImage(logo_img)
        tk.Label(card, image=logo_img, bg="#ffffff").pack(pady=20)
    except:
        tk.Label(card, text="Logo", font=("Arial", 24, "bold"), bg="#ffffff").pack(pady=20)

    # Heading
    tk.Label(card, text="Register for Sports Talent Platform", font=("Arial", 22, "bold"), bg="#ffffff").pack(pady=10)

    # Form
    form_frame = tk.Frame(card, bg="#ffffff")
    form_frame.pack(pady=10, padx=30)
    label_font = ("Arial", 12)
    entry_font = ("Arial", 12)

    def create_entry(label_text, row, show=None):
        tk.Label(form_frame, text=label_text, bg="#ffffff", font=label_font).grid(row=row, column=0, sticky="e", pady=8)
        entry = tk.Entry(form_frame, width=30, font=entry_font, show=show, relief=tk.FLAT, bg="#f1f3f6")
        entry.grid(row=row, column=1, pady=8, ipady=5)
        entry.config(highlightthickness=1, highlightbackground="#cccccc", highlightcolor="#00796b")
        return entry

    entry_username = create_entry("Username:", 0)
    entry_password = create_entry("Password:", 1, show="*")
    entry_confirm = create_entry("Confirm Password:", 2, show="*")

    btn_show_password = tk.Button(form_frame, text="Show", command=lambda: toggle_password(entry_password, btn_show_password), bg="#b2dfdb", font=("Arial", 10))
    btn_show_password.grid(row=1, column=2, padx=5)
    btn_show_confirm = tk.Button(form_frame, text="Show", command=lambda: toggle_password(entry_confirm, btn_show_confirm), bg="#b2dfdb", font=("Arial", 10))
    btn_show_confirm.grid(row=2, column=2, padx=5)

    tk.Label(form_frame, text="Role:", bg="#ffffff", font=label_font).grid(row=3, column=0, sticky="e", pady=8)
    combo_role = ttk.Combobox(form_frame, values=["Player", "Coach"], width=27, font=entry_font, state="readonly")
    combo_role.grid(row=3, column=1, pady=8)

    tk.Label(form_frame, text="Location:", bg="#ffffff", font=label_font).grid(row=4, column=0, sticky="e", pady=8)
    combo_location = ttk.Combobox(form_frame, values=TELANGANA_DISTRICTS, width=27, font=entry_font, state="readonly")
    combo_location.grid(row=4, column=1, pady=8)

    entry_phone = create_entry("Phone (Only Player):", 5)

    # Buttons
    button_frame = tk.Frame(card, bg="#ffffff")
    button_frame.pack(pady=20)

    tk.Button(button_frame, text="Register", command=register_user, bg="#006400", fg="white", font=("Times", 14, "bold"), width=15).grid(row=0, column=0, padx=10)
    tk.Button(button_frame, text="Login", command=lambda:[root.destroy(), login.launch_login()], bg="#00008B", fg="white", font=("Times", 14, "bold"), width=15).grid(row=0, column=1, padx=10)
    tk.Button(card, text="Exit", command=root.destroy, bg="#FA0404", fg="white", font=("Times", 14, "bold"), width=15).pack(pady=10)

    root.mainloop()

if __name__ == "__main__":
    launch_register()

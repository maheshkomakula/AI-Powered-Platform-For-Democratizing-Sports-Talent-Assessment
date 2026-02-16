import tkinter as tk
from tkinter import ttk, messagebox
from PIL import Image, ImageTk
import dashboard
import os

USER_FILE = "users.txt"

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

def toggle_password(entry, btn):
    if entry.cget("show") == "":
        entry.config(show="*")
        btn.config(text="Show")
    else:
        entry.config(show="")
        btn.config(text="Hide")

def clear_fields():
    """Logout: clear username and password fields"""
    entry_username.delete(0, tk.END)
    entry_password.delete(0, tk.END)
    messagebox.showinfo("Logged Out", "You have been logged out!")

# ---------------- Login Logic ----------------
def login_user():
    username = entry_username.get().strip()
    password = entry_password.get()

    users = load_users()
    if username not in users:
        messagebox.showerror("Error", "User not registered!")
        return
    if users[username][0] != password:
        messagebox.showerror("Error", "Incorrect password!")
        return

    role, location, phone = users[username][1], users[username][2], users[username][3]
    messagebox.showinfo("Login Successful", f"Welcome {role} {username}!")
    root.destroy()
    dashboard.launch_dashboard(username, role, location, phone)

# ---------------- UI Setup ----------------
def launch_login():
    global root, entry_username, entry_password, btn_pw, logo_img
    root = tk.Tk()
    root.title("Login - Sports Talent Platform")
    root.state("zoomed")
    root.configure(bg="#FFE5B4")

    # Center card
    card = tk.Frame(root, bg="#ffffff", bd=0, relief=tk.RAISED)
    card.place(relx=0.5, rely=0.5, anchor="center", relwidth=0.45, relheight=0.7)

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
    tk.Label(card, text="Login to Sports Talent Platform", font=("Arial", 22, "bold"), bg="#ffffff").pack(pady=10)

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

    btn_pw = tk.Button(form_frame, text="Show", command=lambda: toggle_password(entry_password, btn_pw), bg="#b2dfdb", font=("Arial", 10))
    btn_pw.grid(row=1, column=2, padx=5)

    # Buttons
    button_frame = tk.Frame(card, bg="#ffffff")
    button_frame.pack(pady=20)

    tk.Button(button_frame, text="Login", command=login_user, bg="#006400", fg="white", font=("Times", 14, "bold"), width=15).grid(row=0, column=0, padx=10)
    tk.Button(button_frame, text="Logout", command=clear_fields, bg="#00008B", fg="white", font=("Times", 14, "bold"), width=15).grid(row=0, column=1, padx=10)
    tk.Button(card, text="Exit", command=root.destroy, bg="#FA0404", fg="white", font=("Times", 14, "bold"), width=15).pack(pady=10)

    root.mainloop()

if __name__ == "__main__":
    launch_login()

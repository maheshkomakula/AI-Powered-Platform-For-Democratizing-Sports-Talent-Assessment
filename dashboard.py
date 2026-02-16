import os
import warnings
import tkinter as tk
from tkinter import ttk, messagebox
from PIL import Image, ImageTk
import main
import login
from register import TELANGANA_DISTRICTS
import webbrowser

USER_FILE = "users.txt"

UPCOMING_TOURNAMENTS = [
    ("Hyderabad", "Hyderabad Premier League", "25 Sep 2025"),
    ("Warangal", "Warangal Cricket Cup", "10 Oct 2025"),
    ("Karimnagar", "Karimnagar Football Tournament", "20 Oct 2025"),
    ("Nizamabad", "Nizamabad Hockey Challenge", "05 Nov 2025"),
    ("Khammam", "Khammam Open Tennis", "15 Nov 2025"),
]

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
warnings.filterwarnings("ignore", category=UserWarning)

# ------------------- Video Analysis -------------------
def launch_video_analysis():
    analysis_window = main.run_app()
    analysis_window.lift()
    analysis_window.focus_force()

def submit_form():
    name = entry_name.get()
    age = entry_age.get()
    sport = combo_sport.get()
    locality = combo_locality.get()

    if not name or not age or not sport or not locality:
        messagebox.showerror("Error", "Please fill all the fields before submitting!")
        return

    messagebox.showinfo(
        "Form Submitted",
        f"Name: {name}\nAge: {age}\nSport: {sport}\nLocality: {locality}\n\nLaunching video analysis..."
    )
    launch_video_analysis()

# ------------------- Load Players -------------------
def load_sports_persons():
    persons = []
    try:
        with open(USER_FILE, "r") as f:
            for line in f:
                parts = line.strip().split(",")
                if len(parts) == 5:
                    username, password, role, location, phone = parts
                    if role in ["Player", "Sports Person"]:
                        persons.append((username, location, phone))
    except FileNotFoundError:
        pass
    return persons

def logout(root):
    root.destroy()
    login.launch_login()

# ------------------- Tournament Popup -------------------
def show_registration_popup(tournament, link, parent):
    popup = tk.Toplevel(parent)
    popup.title("Tournament Registration Link")
    popup.geometry("500x200")
    popup.configure(bg="#ffffff")

    tk.Label(popup, text=f"Tournament: {tournament}", font=("Arial", 14, "bold"), bg="#ffffff").pack(pady=10)
    tk.Label(popup, text="Registration Link:", font=("Arial", 12), bg="#ffffff").pack()

    entry_link = tk.Entry(popup, width=50, font=("Arial", 12))
    entry_link.pack(pady=5)
    entry_link.insert(0, link)
    entry_link.config(state="readonly")

    button_frame = tk.Frame(popup, bg="#ffffff")
    button_frame.pack(pady=20)

    tk.Button(button_frame, text="Copy", bg="green", fg="white", width=12,
              command=lambda: [parent.clipboard_clear(), parent.clipboard_append(link),
                               messagebox.showinfo("Copied", "Link copied!")]).grid(row=0, column=0, padx=10)
    tk.Button(button_frame, text="Share", bg="blue", fg="white", width=12,
              command=lambda: webbrowser.open(f"mailto:?subject={tournament}&body=Register here: {link}")).grid(row=0, column=1, padx=10)
    tk.Button(button_frame, text="Close", bg="red", fg="white", width=12, command=popup.destroy).grid(row=0, column=2, padx=10)

# ------------------- Upcoming Tournaments -------------------
def show_upcoming_tournaments(username, role, location, dashboard_root):
    dashboard_root.withdraw()
    top = tk.Toplevel()
    top.title(" Upcoming Tournaments")
    top.state("zoomed")
    top.configure(bg="#FFE5B4")

    card = tk.Frame(top, bg="#ffffff")
    card.pack(fill="both", expand=True, padx=30, pady=30)

    tk.Label(card, text="⚡Upcoming Tournaments", font=("Times", 22, "bold"), bg="#ffea02").pack(pady=20)

    container = tk.Frame(card, bg="#ffffff")
    container.pack(fill="both", expand=True, padx=20, pady=10)

    canvas = tk.Canvas(container, bg="#ffffff", highlightthickness=0)
    scrollbar = ttk.Scrollbar(container, orient="vertical", command=canvas.yview)
    scroll_frame = tk.Frame(canvas, bg="#ffffff")
    scroll_frame.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))
    canvas.create_window((0, 0), window=scroll_frame, anchor="nw")
    canvas.configure(yscrollcommand=scrollbar.set)
    canvas.pack(side="left", fill="both", expand=True)
    scrollbar.pack(side="right", fill="y")

    def create_tournament_table(parent, title, tournaments, fg_color):
        tk.Label(parent, text=title, font=("Arial", 16, "bold"), bg="#ffffff", fg=fg_color).pack(pady=10)
        frame = tk.Frame(parent, bg="#ffffff")
        frame.pack(pady=5)

        tree = ttk.Treeview(frame, columns=("District", "Tournament", "Date"), show="headings", height=6)
        vsb = ttk.Scrollbar(frame, orient="vertical", command=tree.yview)
        tree.configure(yscrollcommand=vsb.set)
        tree.grid(row=0, column=0, sticky="nsew")
        vsb.grid(row=0, column=1, sticky="ns")

        for col, w in zip(("District", "Tournament", "Date"), (150, 300, 150)):
            tree.heading(col, text=col, anchor="center")
            tree.column(col, width=w, anchor="center")

        for dist, tour, date in tournaments:
            link = f"https://register.com/{tour.replace(' ', '_')}"
            tree.insert("", tk.END, values=(dist, tour, date, link))

        tree.bind("<Double-1>", lambda e: on_tree_double_click(tree, top))
        return tree

    def on_tree_double_click(tree, parent):
        selected_item = tree.focus()
        if selected_item:
            values = tree.item(selected_item, "values")
            dist, tour, date, link = values
            show_registration_popup(tour, link, parent)

    my_tourneys = [t for t in UPCOMING_TOURNAMENTS if t[0] == location]
    create_tournament_table(scroll_frame, f"🏆 Tournaments in {location}", my_tourneys, "purple")

    other_tourneys = [t for t in UPCOMING_TOURNAMENTS if t[0] != location]
    create_tournament_table(scroll_frame, "🏆 Tournaments in Other Districts", other_tourneys, "brown")

    tk.Button(
        card,
        text="Back to Dashboard",
        command=lambda: [top.destroy(), dashboard_root.deiconify(), dashboard_root.state("zoomed")],
        bg="blue", fg="white", font=("Arial", 14, "bold"), width=20
    ).pack(pady=30)

# ------------------- Dashboard -------------------
def launch_dashboard(username, role, location, phone="-"):
    global entry_name, entry_age, combo_sport, combo_locality, logo_img, root

    root = tk.Tk()
    root.title("Sports Talent Dashboard")
    root.state("zoomed")
    root.configure(bg="#FFE5B4")

    card = tk.Frame(root, bg="#ffffff", bd=0, relief=tk.RAISED)
    card.place(relx=0.5, rely=0.5, anchor="center", relwidth=0.8, relheight=0.98)

    # Logo
    try:
        logo_img = Image.open("logo.png")
        ratio = 150 / float(logo_img.size[0])
        logo_img = logo_img.resize((150, int(logo_img.size[1] * ratio)), Image.Resampling.LANCZOS)
        logo_img = ImageTk.PhotoImage(logo_img)
        tk.Label(card, image=logo_img, bg="#ffffff").pack(pady=20)
    except:
        tk.Label(card, text="Logo", font=("Arial", 24, "bold"), bg="#ffffff").pack(pady=20)

    # Welcome label
    tk.Label(card, text=f"Welcome {username}!\n📍 Location: {location}",
             font=("Arial", 20, "bold"), bg="#ffffff", fg="blue").pack(pady=10)

    container = tk.Frame(card, bg="#ffffff")
    container.pack(fill="both", expand=True, padx=20, pady=(10, 60))

    style = ttk.Style()
    style.configure("Sport.TCombobox", fieldbackground="#C1F0F6", background="#C1F0F6", foreground="black")
    style.configure("District.TCombobox", fieldbackground="#F6E2C1", background="#F6E2C1", foreground="black")

    # ---------------- Player Form & Buttons ----------------
    if role in ["Player", "Sports Person"]:
        form_frame = tk.Frame(container, bg="#ffffff")
        form_frame.pack(pady=10)

        label_font = ("Arial", 14)
        entry_font = ("Arial", 12)

        tk.Label(form_frame, text="Name:", font=label_font, bg="#ffffff").grid(row=0, column=0, padx=10, pady=10, sticky="e")
        entry_name = tk.Entry(form_frame, width=30, font=entry_font, bg="#f1f3f6")
        entry_name.grid(row=0, column=1, pady=10, sticky="w")

        tk.Label(form_frame, text="Age:", font=label_font, bg="#ffffff").grid(row=1, column=0, padx=10, pady=10, sticky="e")
        entry_age = tk.Entry(form_frame, width=30, font=entry_font, bg="#f1f3f6")
        entry_age.grid(row=1, column=1, pady=10, sticky="w")

        # Select Sport
        tk.Label(form_frame, text="Select Sport:", font=label_font, bg="#ffffff").grid(row=2, column=0, padx=10, pady=10, sticky="e")
        combo_sport = ttk.Combobox(
            form_frame,
            values=["Cricket", "Badminton"],
            width=28,
            font=entry_font,
            style="Sport.TCombobox",
            state="readonly"
        )
        combo_sport.grid(row=2, column=1, pady=10, sticky="w")

        # District
        tk.Label(form_frame, text="District:", font=label_font, bg="#ffffff").grid(row=3, column=0, padx=10, pady=10, sticky="e")
        combo_locality = ttk.Combobox(
            form_frame,
            values=TELANGANA_DISTRICTS,
            width=28,
            font=entry_font,
            style="District.TCombobox",
            state="readonly"
        )
        combo_locality.grid(row=3, column=1, pady=10, sticky="w")

        # Buttons frame
        btn_frame = tk.Frame(container, bg="#ffffff")
        btn_frame.pack(pady=20)
        tk.Button(btn_frame, text="Launch Video Analysis", command=submit_form,
                  bg="green", fg="white", font=("Arial", 14, "bold"), width=20, height=2).pack(side="left", padx=20)
        tk.Button(btn_frame, text="Upcoming Tournaments",
                  command=lambda: show_upcoming_tournaments(username, role, location, root),
                  bg="brown", fg="white", font=("Arial", 14, "bold"), width=20, height=2).pack(side="left", padx=20)

    # ---------------- Coach Tables & Button ----------------
    if role == "Coach":
        persons = load_sports_persons()
        same_district = [p for p in persons if p[1] == location]
        other_districts = [p for p in persons if p[1] != location]

        scroll_container = tk.Frame(container, bg="#ffffff")
        scroll_container.pack(fill="both", expand=True)

        canvas = tk.Canvas(scroll_container, bg="#ffffff", highlightthickness=0)
        vsb = ttk.Scrollbar(scroll_container, orient="vertical", command=canvas.yview)
        scroll_frame = tk.Frame(canvas, bg="#ffffff")
        scroll_frame.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))
        canvas.create_window((0, 0), window=scroll_frame, anchor="nw")
        canvas.configure(yscrollcommand=vsb.set)
        canvas.pack(side="left", fill="both", expand=True)
        vsb.pack(side="right", fill="y")

        def create_tree(parent, title, data, columns):
            tk.Label(parent, text=title, font=("Arial", 16, "bold"), bg="#ffffff", fg="purple").pack(pady=10)
            frame = tk.Frame(parent, bg="#ffffff")
            frame.pack(pady=5)
            tree = ttk.Treeview(frame, columns=columns, show="headings", height=5)
            tree_vsb = ttk.Scrollbar(frame, orient="vertical", command=tree.yview)
            tree.configure(yscrollcommand=tree_vsb.set)
            tree.grid(row=0, column=0, sticky="nsew")
            tree_vsb.grid(row=0, column=1, sticky="ns")
            for col in columns:
                tree.heading(col, text=col, anchor="center")
                tree.column(col, width=200, anchor="center")
            for item in data:
                tree.insert("", tk.END, values=item)
            return tree

        create_tree(scroll_frame, f"Players from {location}", same_district, ("Username", "Location", "Phone"))
        create_tree(scroll_frame, "Players from Other Districts", other_districts, ("Username", "Location", "Phone"))

        coach_btn_frame = tk.Frame(scroll_frame, bg="#ffffff")
        coach_btn_frame.pack(pady=20)
        tk.Button(coach_btn_frame, text="Upcoming Tournaments",
                  command=lambda: show_upcoming_tournaments(username, role, location, root),
                  bg="brown", fg="white", font=("Arial", 14, "bold"), width=25, height=1).pack()

    # ---------------- Logout & Exit ----------------
    button_frame = tk.Frame(card, bg="#ffffff")
    button_frame.place(relx=0.5, rely=0.97, anchor="s")
    tk.Button(button_frame, text="Logout", command=lambda: logout(root),
              bg="blue", fg="white", font=("Times", 14, "bold"), width=12, height=1).grid(row=0, column=0, padx=20)
    tk.Button(button_frame, text="Exit", command=root.quit,
              bg="red", fg="white", font=("Times", 14, "bold"), width=12, height=1).grid(row=0, column=1, padx=20)

    root.mainloop()

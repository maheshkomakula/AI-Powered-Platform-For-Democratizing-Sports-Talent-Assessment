import os
import warnings
import tkinter as tk
from tkinter import filedialog, messagebox
import cv2
import PIL.Image, PIL.ImageTk
import mediapipe as mp
import numpy as np

# ---------------- Suppress warnings ----------------
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
warnings.filterwarnings("ignore", category=UserWarning)

# ---------------- Mediapipe Setup ----------------
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5)

# ---------------- Global Variables ----------------
paused = True
play_speed = 1.0
cap = None
frame_count = 0
fps = 0
slider_update = True
mode = None
all_video_suggestions = set()

# ---------------- Utility Functions ----------------
def calculate_angle(a, b, c):
    a, b, c = np.array(a), np.array(b), np.array(c)
    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians*180.0/np.pi)
    if angle > 180:
        angle = 360 - angle
    return angle

# ---------------- Video Functions ----------------
def open_file():
    global cap, frame_count, fps, all_video_suggestions, paused
    file_path = filedialog.askopenfilename(filetypes=[("Video files", "*.mp4;*.avi;*.mov")])
    if not file_path:
        return
    
    if cap is not None:
        cap.release()

    cap = cv2.VideoCapture(file_path)
    if not cap.isOpened():
        messagebox.showerror("Error", "Could not open video file.")
        return

    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = int(cap.get(cv2.CAP_PROP_FPS)) or 30
    timeline_slider.config(to=frame_count)

    # Reset UI
    update_suggestions_box([])
    timeline_slider.set(0)
    all_video_suggestions.clear()
    video_label.config(image="")
    video_label.imgtk = None
    paused = True
    print("✅ Video loaded. Click Play to start.")

def update_suggestions_box(suggestions):
    suggestions_text.config(state=tk.NORMAL)
    suggestions_text.delete(1.0, tk.END)
    if suggestions:
        for s in suggestions:
            suggestions_text.insert(tk.END, f"- {s}\n")
    else:
        suggestions_text.insert(tk.END, "No major errors detected yet...")
    suggestions_text.config(state=tk.DISABLED)

def play_video():
    global paused
    if cap is None:
        messagebox.showwarning("Warning", "Please upload a video first!")
        return
    paused = False
    process_frame()

def pause_video():
    global paused
    paused = True

def stop_video():
    global cap, all_video_suggestions, paused
    if cap is not None:
        cap.release()
        cap = None
    video_label.config(image="")
    video_label.imgtk = None
    update_suggestions_box([])
    all_video_suggestions.clear()
    paused = True

def exit_app():
    stop_video()
    root.destroy()

def change_speed(value):
    global play_speed
    play_speed = float(value)

def seek_video(value):
    global cap, slider_update
    if cap is not None:
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(value))
        slider_update = False

def process_frame():
    global cap, paused, slider_update, all_video_suggestions
    if cap is None or paused:
        return

    ret, frame = cap.read()
    if not ret:
        summary_text = "\n".join(f"- {s}" for s in all_video_suggestions) if all_video_suggestions else "No major errors detected. Great job!"
        messagebox.showinfo("Summary Report", summary_text)
        return

    # Keep original resolution, limit height
    h, w, _ = frame.shape
    max_height = 600
    if h > max_height:
        scale = max_height / h
        frame = cv2.resize(frame, (int(w*scale), int(h*scale)))
        h, w, _ = frame.shape

    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(rgb_frame)
    new_suggestions = []

    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark

        if mode.get() == "batting":
            # Cricket Batting Suggestions
            right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
            right_wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value]
            left_wrist = landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value]
            left_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value]
            right_ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value]
            left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
            left_knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value]
            nose = landmarks[mp_pose.PoseLandmark.NOSE.value]
            right_elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value]

            if right_wrist.y < right_shoulder.y or left_wrist.y < right_shoulder.y:
                new_suggestions.append("Lower your hands, keep bat closer to hip.")
                cv2.circle(frame, (int(right_wrist.x*w), int(right_wrist.y*h)), 10, (0,0,255), -1)
                cv2.circle(frame, (int(left_wrist.x*w), int(left_wrist.y*h)), 10, (0,0,255), -1)

            stance_width = abs(left_ankle.x - right_ankle.x)
            if stance_width < 0.15:
                new_suggestions.append("Widen your stance for better balance.")
                cv2.line(frame, (int(left_ankle.x*w), int(left_ankle.y*h)),
                         (int(right_ankle.x*w), int(right_ankle.y*h)), (0,0,255), 4)

            knee_angle = calculate_angle((left_hip.x, left_hip.y),
                                         (left_knee.x, left_knee.y),
                                         (left_ankle.x, left_ankle.y))
            if knee_angle < 160:
                new_suggestions.append("Keep your front knee stable at impact.")
                cv2.circle(frame, (int(left_knee.x*w), int(left_knee.y*h)), 10, (0,0,255), -1)

            if abs(nose.x - 0.5) > 0.2:
                new_suggestions.append("Keep your head steady during swing.")

            if right_elbow.y > right_shoulder.y + 0.2:
                new_suggestions.append("Keep your back elbow higher during swing.")

        elif mode.get() == "bowling":
            # Cricket Bowling Suggestions
            right_ankle_px = (int(landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x*w),
                              int(landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y*h))
            right_wrist_px = (int(landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x*w),
                              int(landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y*h))
            nose_px = (int(landmarks[mp_pose.PoseLandmark.NOSE.value].x*w),
                       int(landmarks[mp_pose.PoseLandmark.NOSE.value].y*h))
            left_shoulder_px = (int(landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x*w),
                                int(landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y*h))
            right_shoulder_px = (int(landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x*w),
                                 int(landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y*h))
            right_knee_px = (int(landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x*w),
                             int(landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y*h))
            right_hip_px = (int(landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x*w),
                            int(landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y*h))

            if right_ankle_px[0] < w*0.05:
                new_suggestions.append("Front foot over the line - Possible No Ball!")
                cv2.circle(frame, right_ankle_px, 10, (0,0,255), -1)

            if right_wrist_px[1] > nose_px[1]:
                new_suggestions.append("Release the ball higher near your head!")
                cv2.circle(frame, right_wrist_px, 10, (0,0,255), -1)

            shoulder_diff = abs(left_shoulder_px[1] - right_shoulder_px[1])
            if shoulder_diff > 0.2*w:
                new_suggestions.append("Rotate shoulders more evenly during delivery.")

            leg_angle = calculate_angle((right_hip_px[0], right_hip_px[1]),
                                        (right_knee_px[0], right_knee_px[1]),
                                        (right_ankle_px[0], right_ankle_px[1]))
            if leg_angle > 175:
                new_suggestions.append("Bend your front leg for better follow-through.")
                cv2.line(frame, right_hip_px, right_ankle_px, (0,0,255), 4)

        elif mode.get() == "badminton":
            # Badminton Suggestions
            right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
            right_elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value]
            right_wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value]
            left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
            right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value]
            left_knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value]
            left_ankle = landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value]
            nose = landmarks[mp_pose.PoseLandmark.NOSE.value]

            arm_angle = calculate_angle(
                (right_shoulder.x, right_shoulder.y),
                (right_elbow.x, right_elbow.y),
                (right_wrist.x, right_wrist.y)
            )
            if arm_angle < 150:
                new_suggestions.append("Extend your arm fully during smash for more power.")

            knee_angle = calculate_angle(
                (left_hip.x, left_hip.y),
                (left_knee.x, left_knee.y),
                (left_ankle.x, left_ankle.y)
            )
            if knee_angle > 170:
                new_suggestions.append("Bend your knees slightly to generate power.")

            if abs(nose.x - 0.5) > 0.2:
                new_suggestions.append("Keep your head steady and watch the shuttle.")

        # Draw landmarks
        mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

    img = PIL.ImageTk.PhotoImage(image=PIL.Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)))
    video_label.imgtk = img
    video_label.config(image=img)

    current_frame = int(cap.get(cv2.CAP_PROP_POS_FRAMES))
    if slider_update:
        timeline_slider.set(current_frame)
    else:
        slider_update = True

    update_suggestions_box(new_suggestions)
    for s in new_suggestions:
        all_video_suggestions.add(s)

    video_label.after(int(1000/(fps*play_speed)), process_frame)

# ---------------- Tkinter UI ----------------
def run_app():
    global root, video_label, suggestions_text, timeline_slider, speed_slider, mode
    root = tk.Toplevel()
    root.title("SkillScope - Sports Coaching Dashboard")
    root.geometry("1300x850")
    root.configure(bg="#f0f8ff")

    mode = tk.StringVar(root, value="batting")

    # Mode selection
    mode_frame = tk.Frame(root, bg="#f0f8ff")
    mode_frame.pack(pady=10)
    tk.Label(mode_frame, text="Select Mode", bg="#93c3ed", font=("Arial", 12, "bold")).pack(side=tk.LEFT, padx=5)
    tk.Radiobutton(mode_frame, text="Batting", variable=mode, value="batting",
                   bg="#d1f0c4", indicatoron=0, width=12, font=("Arial", 12, "bold")).pack(side=tk.LEFT, padx=5)
    tk.Radiobutton(mode_frame, text="Bowling", variable=mode, value="bowling",
                   bg="#fcd5b4", indicatoron=0, width=12, font=("Arial", 12, "bold")).pack(side=tk.LEFT, padx=5)
    tk.Radiobutton(mode_frame, text="Badminton", variable=mode, value="badminton",
                   bg="#ffe066", indicatoron=0, width=12, font=("Arial", 12, "bold")).pack(side=tk.LEFT, padx=5)

    # Main frame
    main_frame = tk.Frame(root, bg="#f0f8ff")
    main_frame.pack(pady=10)

    video_label = tk.Label(main_frame, bg="#d3e4f1")
    video_label.grid(row=0, column=0, padx=10, pady=10)

    suggestions_text = tk.Text(main_frame, height=25, width=50, state=tk.DISABLED, wrap=tk.WORD, bg="#fdf5e6")
    suggestions_text.grid(row=0, column=1, padx=10, pady=10)

    # Control buttons
    control_frame = tk.Frame(root, bg="#f0f8ff")
    control_frame.pack(pady=10)
    tk.Button(control_frame, text="Upload Video", command=open_file, bg="#a8dadc", width=12, font=("Arial", 12)).grid(row=0, column=0, padx=5)
    tk.Button(control_frame, text="Play", command=play_video, bg="#90be6d", width=12, font=("Arial", 12)).grid(row=0, column=1, padx=5)
    tk.Button(control_frame, text="Pause", command=pause_video, bg="#f4a261", width=12, font=("Arial", 12)).grid(row=0, column=2, padx=5)
    tk.Button(control_frame, text="Stop", command=stop_video, bg="#e63946", width=12, font=("Arial", 12)).grid(row=0, column=3, padx=5)
    tk.Button(control_frame, text="Exit", command=exit_app, bg="#457b9d", width=12, font=("Arial", 12)).grid(row=0, column=4, padx=5)

    # Slider and speed
    timeline_slider = tk.Scale(root, from_=0, to=100, orient=tk.HORIZONTAL, length=1000, command=seek_video, bg="#f0f8ff")
    timeline_slider.pack(pady=5)

    speed_slider = tk.Scale(root, from_=0.5, to=2.0, resolution=0.1,
                            orient=tk.HORIZONTAL, label="Speed", command=change_speed, bg="#f0f8ff")
    speed_slider.set(1.0)
    speed_slider.pack(pady=5)

    return root

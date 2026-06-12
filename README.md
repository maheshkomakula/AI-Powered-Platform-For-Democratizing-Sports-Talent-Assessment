# 🏆 AI-Powered Sports Talent Platform

![Status](https://img.shields.io/badge/Status-Prototype-blue)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)
![MediaPipe](https://img.shields.io/badge/MediaPipe-Pose-orange)

## Overview

The **Sports Talent Platform** is an AI-powered solution designed to identify, assess, nurture, and showcase athletic talent across multiple sports. Developed as part of the **Smart India Hackathon (SIH)**, the platform combines modern web technologies with advanced computer vision techniques to provide athletes and coaches with actionable performance insights.

Athletes can create profiles, track their experience levels, upload performance videos, and receive AI-generated coaching feedback. Using **MediaPipe Pose**, **OpenCV**, and biomechanical analysis techniques, the platform evaluates player movements and mechanics directly from uploaded videos.

The platform currently supports sports such as:

* 🏏 Cricket Batting
* 🏏 Cricket Bowling
* 🏸 Badminton

---

## 🎯 Key Features

### 1. AI-Powered Video Analysis

* Browser-based pose estimation using **MediaPipe Pose**.
* No server-side video processing required for basic analysis.
* Extracts 33 body landmarks in real time.
* Calculates biomechanical angles and posture alignment.
* Generates coaching feedback using sports-specific heuristics.
* Visual skeleton overlay on uploaded videos.

### 2. Athlete & Coach Management

#### Players

* Register and maintain profiles.
* Upload performance videos.
* View personalized analysis reports.
* Track performance improvements.

#### Coaches

* Access athlete data.
* Review performance metrics.
* Provide additional guidance and evaluations.

### 3. Multi-Sport Analysis

#### Cricket Batting

* Batting stance assessment
* Head stability tracking
* Back elbow positioning
* Wrist alignment evaluation

#### Cricket Bowling

* Potential no-ball detection
* Release height analysis
* Shoulder rotation tracking
* Front-leg bend measurement

#### Badminton

* Smash arm extension analysis
* Knee bend evaluation
* Head stability monitoring
* Power generation assessment

### 4. Modern Responsive UI

* Glassmorphism-inspired design.
* Fully responsive layout.
* Smooth animations and transitions.
* Lightweight implementation using Vanilla CSS.

### 5. Talent Discovery & Showcase

* Athlete profiles with experience details.
* Performance tracking.
* Talent identification through AI-based assessments.
* Centralized platform for talent visibility.

---

# 🏗️ System Architecture

The project consists of three major components:

## Frontend (`webapp`)

A React-based web application providing:

* Authentication system
* Athlete dashboard
* Coach dashboard
* Video upload interface
* Analysis visualization
* Performance reporting

### Technologies

* React 19
* Vite
* React Router DOM
* Vanilla CSS
* MediaPipe Pose

---

## Backend (`backend`)

A Node.js and Express server responsible for:

* User authentication
* Role management
* Data persistence
* API services
* Athlete profile management

### Technologies

* Node.js
* Express.js
* PostgreSQL

---

## Video Analytics Engine

Python-powered analytics system using:

* MediaPipe
* OpenCV
* Pose estimation
* Biomechanical calculations
* Performance evaluation algorithms

---

# 📁 Project Structure

```text
SportsTalentPlatform/
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── config/
│   └── package.json
│
├── webapp/
│   ├── public/
│   │   └── logo.png
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   │   ├── Analysis.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── analytics/
│   ├── mediapipe_analysis.py
│   ├── opencv_processing.py
│   └── utilities.py
│
└── README.md
```

---

# 🧠 How the AI Analysis Works

The analysis workflow follows these stages:

### 1. Video Upload

The athlete uploads a sports performance video.

### 2. Frame Extraction

Video frames are processed using:

```javascript
requestAnimationFrame()
```

for efficient browser-side rendering.

### 3. Pose Detection

MediaPipe Pose identifies:

* 33 body landmarks
* X, Y, Z coordinates
* Confidence scores

### 4. Biomechanical Analysis

Custom utility functions calculate:

* Joint angles
* Limb alignment
* Body posture
* Movement efficiency

Example:

```javascript
calculateAngle(shoulder, elbow, wrist)
```

### 5. Rule-Based Evaluation

Sport-specific heuristics evaluate:

* Technique quality
* Form consistency
* Stability
* Power generation

Example feedback:

> "Extend your arm fully during the smash for maximum power."

### 6. Visualization

An HTML canvas overlays the video and renders:

* Skeleton connectors
* Landmark positions
* Real-time movement tracking

---

# 🚀 Installation & Setup

## Prerequisites

Install:

* Node.js (v18+)
* npm
* PostgreSQL
* Python (optional for advanced analytics)

---

## Backend Setup

Open a terminal:

```bash
cd backend
npm install
node server.js
```

Expected output:

```bash
Server running on port 5000
```

---

## Frontend Setup

Open another terminal:

```bash
cd webapp
npm install
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

# 🔐 Authentication

Current implementations may vary depending on branch/version.

### Prototype Version

* Uses localStorage for user data.
* Intended only for demonstration purposes.

### Production Recommendation

* JWT Authentication
* Password hashing using bcrypt
* Refresh tokens
* Secure session handling

⚠️ Do not store sensitive user credentials in localStorage in production.

---

# 🛠️ Tech Stack

| Category           | Technologies                            |
| ------------------ | --------------------------------------- |
| Frontend           | React 19, Vite, React Router            |
| Backend            | Node.js, Express                        |
| Database           | PostgreSQL                              |
| AI/Computer Vision | MediaPipe Pose, OpenCV                  |
| Styling            | Vanilla CSS                             |
| Authentication     | LocalStorage (Prototype), JWT (Planned) |

---

# ❗ Common Issues

### "Could not connect to the server"

Cause:

```text
Backend server is not running.
```

Solution:

```bash
cd backend
node server.js
```

---

### "Cannot find module 'server.js'"

Cause:

```text
Running the command from the wrong directory.
```

Solution:

```bash
cd backend
node server.js
```

---

### Frontend Not Loading

Verify:

```bash
npm run dev
```

is running inside:

```bash
webapp/
```

---

# 🔮 Future Roadmap

### Backend Enhancements

* FastAPI/Express microservices
* Scalable REST APIs
* Cloud deployment

### Security Improvements

* JWT authentication
* OAuth integration
* Role-based access control

### Advanced AI Models

* Machine learning-based technique classification
* Injury risk prediction
* Performance scoring models
* Personalized coaching recommendations

### Cloud Infrastructure

* AWS S3 / Firebase Storage
* Video archival
* Historical progress tracking

### Analytics Dashboard

* Performance trends
* Skill progression charts
* Comparative athlete benchmarking

### Mobile Support

* React Native application
* Live camera-based analysis

---

# 🎓 Smart India Hackathon Project

This project was developed as part of the **Smart India Hackathon (SIH)** with the vision of democratizing sports talent assessment by making professional-level performance analysis accessible to athletes everywhere through AI and computer vision.

import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
const { Pose, POSE_CONNECTIONS } = window;
const { drawConnectors, drawLandmarks } = window;

export default function Analysis() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [mode, setMode] = useState('batting');
  const [suggestions, setSuggestions] = useState(new Set());
  const [videoUrl, setVideoUrl] = useState(null);
  const poseRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) navigate('/login');
  }, [navigate]);

  const calculateAngle = (a, b, c) => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
  };

  const processLandmarks = useCallback((landmarks) => {
    const newSuggestions = [];

    if (mode === 'batting') {
      const right_shoulder = landmarks[12];
      const right_wrist = landmarks[16];
      const left_wrist = landmarks[15];
      const left_ankle = landmarks[27];
      const right_ankle = landmarks[28];
      const left_hip = landmarks[23];
      const left_knee = landmarks[25];
      const nose = landmarks[0];
      const right_elbow = landmarks[14];

      if (right_wrist.y < right_shoulder.y || left_wrist.y < right_shoulder.y) {
        newSuggestions.push("Lower your hands, keep bat closer to hip.");
      }

      const stance_width = Math.abs(left_ankle.x - right_ankle.x);
      if (stance_width < 0.15) {
        newSuggestions.push("Widen your stance for better balance.");
      }

      const knee_angle = calculateAngle(left_hip, left_knee, left_ankle);
      if (knee_angle < 160) {
        newSuggestions.push("Keep your front knee stable at impact.");
      }

      if (Math.abs(nose.x - 0.5) > 0.2) {
        newSuggestions.push("Keep your head steady during swing.");
      }

      if (right_elbow.y > right_shoulder.y + 0.2) {
        newSuggestions.push("Keep your back elbow higher during swing.");
      }
    } 
    else if (mode === 'bowling') {
      const right_ankle = landmarks[28];
      const right_wrist = landmarks[16];
      const nose = landmarks[0];
      const left_shoulder = landmarks[11];
      const right_shoulder = landmarks[12];
      const right_knee = landmarks[26];
      const right_hip = landmarks[24];

      if (right_ankle.x < 0.05) {
        newSuggestions.push("Front foot over the line - Possible No Ball!");
      }

      if (right_wrist.y > nose.y) { // y is inverted in screen coords
        newSuggestions.push("Release the ball higher near your head!");
      }

      const shoulder_diff = Math.abs(left_shoulder.y - right_shoulder.y);
      if (shoulder_diff > 0.2) {
        newSuggestions.push("Rotate shoulders more evenly during delivery.");
      }

      const leg_angle = calculateAngle(right_hip, right_knee, right_ankle);
      if (leg_angle > 175) {
        newSuggestions.push("Bend your front leg for better follow-through.");
      }
    } 
    else if (mode === 'badminton') {
      const right_shoulder = landmarks[12];
      const right_elbow = landmarks[14];
      const right_wrist = landmarks[16];
      const left_hip = landmarks[23];
      const left_knee = landmarks[25];
      const left_ankle = landmarks[27];
      const nose = landmarks[0];

      const arm_angle = calculateAngle(right_shoulder, right_elbow, right_wrist);
      if (arm_angle < 150) {
        newSuggestions.push("Extend your arm fully during smash for more power.");
      }

      const knee_angle = calculateAngle(left_hip, left_knee, left_ankle);
      if (knee_angle > 170) {
        newSuggestions.push("Bend your knees slightly to generate power.");
      }

      if (Math.abs(nose.x - 0.5) > 0.2) {
        newSuggestions.push("Keep your head steady and watch the shuttle.");
      }
    }

    setSuggestions(prev => {
      const updated = new Set(prev);
      newSuggestions.forEach(s => updated.add(s));
      return updated;
    });
  }, [mode]);

  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    pose.onResults((results) => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) return;

      const canvasCtx = canvas.getContext('2d');
      // Match canvas size to video actual size for correct overlay
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (results.poseLandmarks) {
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
        drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 2 });
        processLandmarks(results.poseLandmarks);
      }
      canvasCtx.restore();
    });

    poseRef.current = pose;

    return () => {
      pose.close();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [processLandmarks]);

  const startAnalysisLoop = () => {
    const video = videoRef.current;
    if (!video || video.paused || video.ended) return;

    const processFrame = async () => {
      if (video.paused || video.ended) return;
      
      if (poseRef.current && video.readyState >= 2) {
        await poseRef.current.send({ image: video });
      }
      animationRef.current = requestAnimationFrame(processFrame);
    };
    
    // Clear previous suggestions on new playback
    setSuggestions(new Set());
    processFrame();
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setSuggestions(new Set());
      // Clear canvas
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  const handleModeChange = (e) => {
    setMode(e.target.value);
    setSuggestions(new Set()); // Clear suggestions on mode change
  };

  return (
    <div className="app-container">
      <nav className="dashboard-nav">
        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          <img src="/logo.png" alt="Logo" style={{height: '40px'}} onError={(e) => {e.target.style.display='none'}} />
          <h2 style={{color: 'var(--primary)'}}>Sports Talent Analysis</h2>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </nav>

      <main className="dashboard-content animate-fade-in" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        
        <div className="glass-panel" style={{padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <label style={{fontWeight: '600'}}>Select Sport Mode:</label>
            <select className="form-select" style={{width: '200px'}} value={mode} onChange={handleModeChange}>
              <option value="batting">Cricket Batting</option>
              <option value="bowling">Cricket Bowling</option>
              <option value="badminton">Badminton</option>
            </select>
          </div>
          
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <label style={{fontWeight: '600'}}>Upload Video:</label>
            <input 
              type="file" 
              accept="video/*" 
              onChange={handleVideoUpload}
              className="form-input" 
              style={{padding: '0.5rem'}}
            />
          </div>
        </div>

        <div className="analysis-container">
          <div className="video-wrapper" style={{ position: 'relative', background: '#000' }}>
            <video 
              ref={videoRef} 
              src={videoUrl}
              controls
              onPlay={startAnalysisLoop}
              onPause={() => cancelAnimationFrame(animationRef.current)}
              onEnded={() => cancelAnimationFrame(animationRef.current)}
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: videoUrl ? 'block' : 'none' }} 
            ></video>
            
            {videoUrl && (
              <canvas 
                ref={canvasRef} 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
              ></canvas>
            )}

            {!videoUrl && (
              <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white', textAlign: 'center'}}>
                <h3 style={{marginBottom: '0.5rem'}}>No Video Uploaded</h3>
                <p>Please upload a video to begin real-time analysis.</p>
              </div>
            )}
          </div>

          <div className="suggestions-box glass-panel">
            <h3 style={{marginBottom: '1rem'}}>AI Coach Suggestions ({mode})</h3>
            {suggestions.size > 0 ? (
              <ul className="suggestions-list">
                {Array.from(suggestions).map((s, i) => (
                  <li key={i}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{color: 'var(--text-muted)'}}>No major errors detected yet... Keep going!</p>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}

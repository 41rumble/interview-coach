import React, { useRef, useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, LinearProgress, Chip } from '@mui/material';
import * as vision from '@mediapipe/tasks-vision';

const InterviewCoach = ({ showMarkers, showFaceMesh, showPose, showHands }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [faceLandmarker, setFaceLandmarker] = useState(null);
  const [webcamRunning, setWebcamRunning] = useState(false);

  useEffect(() => {
    const initializeLandmarker = async () => {
      const { FaceLandmarker, FilesetResolver } = vision;

      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );

      const face = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU"
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1
      });

      setFaceLandmarker(face);
    };

    initializeLandmarker();
  }, []);

  useEffect(() => {
    if (!faceLandmarker || !drawingUtils) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let lastVideoTime = -1;
    let results = undefined;

    const predictWebcam = async () => {
      const startTimeMs = performance.now();

      if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        
        // Clear canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (showMarkers && showFaceMesh) {
          const faceResults = faceLandmarker.detectForVideo(video, startTimeMs);
          if (faceResults.faceLandmarks) {
            // Analyze face direction and expressions
            const landmarks = faceResults.faceLandmarks[0];
            if (landmarks) {
              // Check if looking at camera (using nose direction)
              const nose = landmarks[4];
              const eyeContactScore = 1 - Math.min(Math.abs(nose.z) * 5, 1);
              
              // Update metrics less frequently to improve performance
              if (startTimeMs % 3 === 0) {
                setMetrics(prev => ({
                  ...prev,
                  eyeContact: eyeContactScore,
                  overall: eyeContactScore
                }));

                if (Math.abs(nose.z) > 0.1) {
                  setFeedback(["Try to face the camera directly"]);
                } else {
                  setFeedback(["Good eye contact!"]);
                }
              }

              // Update blend shapes if available
              if (faceResults.faceBlendshapes && faceResults.faceBlendshapes.length > 0) {
                const shapes = faceResults.faceBlendshapes[0].categories
                  .map(shape => ({
                    categoryName: shape.categoryName,
                    score: shape.score
                  }))
                  .filter(shape => shape.score > 0.1);
                
                // Update blend shapes less frequently
                if (startTimeMs % 3 === 0) {
                  setBlendShapes(shapes);
                }
              }
            }

            // Draw landmarks
            for (const landmarks of faceResults.faceLandmarks) {
              drawingUtils.drawConnectors(
                landmarks,
                vision.FaceLandmarker.FACE_LANDMARKS_TESSELATION,
                { color: "#C0C0C070", lineWidth: 1 }
              );
              drawingUtils.drawConnectors(
                landmarks,
                vision.FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
                { color: "#FF3030" }
              );
              drawingUtils.drawConnectors(
                landmarks,
                vision.FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
                { color: "#FF3030" }
              );
              drawingUtils.drawConnectors(
                landmarks,
                vision.FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
                { color: "#30FF30" }
              );
              drawingUtils.drawConnectors(
                landmarks,
                vision.FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
                { color: "#30FF30" }
              );
              drawingUtils.drawConnectors(
                landmarks,
                vision.FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
                { color: "#E0E0E0" }
              );
              drawingUtils.drawConnectors(
                landmarks,
                vision.FaceLandmarker.FACE_LANDMARKS_LIPS,
                { color: "#E0E0E0" }
              );
            }
          }
      }

      if (webcamRunning) {
        window.requestAnimationFrame(predictWebcam);
      }
    };

    if (!webcamRunning) {
      const constraints = {
        video: { width: 1280, height: 720 }
      };

      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", () => {
          setWebcamRunning(true);
          predictWebcam();
        });
      });
    }

    return () => {
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
      setWebcamRunning(false);
    };
  }, [faceLandmarker, drawingUtils, showMarkers, showFaceMesh]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box sx={{ position: 'relative', width: '100%', maxWidth: '1280px', margin: '0 auto' }}>
            <video
              ref={videoRef}
              style={{
                width: '100%',
                height: 'auto',
                visibility: 'hidden',
                position: 'absolute'
              }}
              autoPlay
              playsInline
            />
            <canvas
              ref={canvasRef}
              style={{
                width: '100%',
                height: 'auto'
              }}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Interview Performance Metrics
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <BlendShapeBar label="Overall Score" value={metrics.overall} />
              <BlendShapeBar label="Eye Contact" value={metrics.eyeContact} />
              <BlendShapeBar label="Posture" value={metrics.posture} />
              <BlendShapeBar label="Hand Gestures" value={metrics.handGestures} />
            </Box>

            <Typography variant="h6" color="primary" gutterBottom>
              Real-time Feedback
            </Typography>
            <Box sx={{ mb: 3 }}>
              {feedback.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {feedback.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                "Looking good! Keep it up!"
              )}
            </Box>

            {blendShapes.length > 0 && (
              <>
                <Typography variant="h6" color="primary" gutterBottom>
                  Expression Analysis
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {blendShapes.map((shape, index) => (
                    <Chip
                      key={index}
                      label={`${shape.categoryName}: ${(shape.score * 100).toFixed(0)}%`}
                      color={shape.score > 0.5 ? "success" : "warning"}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InterviewCoach;
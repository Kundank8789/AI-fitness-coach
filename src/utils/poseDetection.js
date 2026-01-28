import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';

let detector = null;

export async function initPoseDetector() {
  try {
    // Load the model
    await tf.ready();
    
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
      enableSmoothing: true,
      minPoseScore: 0.3
    };
    
    detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfig
    );
    
    console.log('Pose detector initialized successfully');
    return detector;
  } catch (error) {
    console.error('Error initializing pose detector:', error);
    throw error;
  }
}

export async function detectPose(video) {
  if (!detector) {
    throw new Error('Detector not initialized');
  }
  
  try {
    const poses = await detector.estimatePoses(video);
    return poses;
  } catch (error) {
    console.error('Error detecting pose:', error);
    return [];
  }
}

export function drawKeypoints(ctx, keypoints, confidence = 0.3) {
  keypoints.forEach(keypoint => {
    if (keypoint.score > confidence) {
      const { x, y } = keypoint;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#00ff00';
      ctx.fill();
    }
  });
}

export function drawSkeleton(ctx, keypoints, confidence = 0.3) {
  const adjacentKeyPoints = poseDetection.util.getAdjacentPairs(
    poseDetection.SupportedModels.MoveNet
  );
  
  adjacentKeyPoints.forEach(([i, j]) => {
    const kp1 = keypoints[i];
    const kp2 = keypoints[j];
    
    if (kp1.score > confidence && kp2.score > confidence) {
      ctx.beginPath();
      ctx.moveTo(kp1.x, kp1.y);
      ctx.lineTo(kp2.x, kp2.y);
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });
}

// Exercise detection logic
export function detectExercise(keypoints) {
  if (!keypoints || keypoints.length === 0) {
    return { exercise: 'None', confidence: 0 };
  }
  
  // Simple squat detection (knees bend)
  const leftHip = keypoints.find(kp => kp.name === 'left_hip');
  const leftKnee = keypoints.find(kp => kp.name === 'left_knee');
  const leftAnkle = keypoints.find(kp => kp.name === 'left_ankle');
  
  if (leftHip && leftKnee && leftAnkle) {
    const hipKneeDistance = Math.abs(leftHip.y - leftKnee.y);
    const kneeAnkleDistance = Math.abs(leftKnee.y - leftAnkle.y);
    
    if (hipKneeDistance < kneeAnkleDistance * 1.5) {
      return { exercise: 'Squat', confidence: 85 };
    }
  }
  
  // Add more exercise detection logic here
  
  return { exercise: 'Standing', confidence: 90 };
}

export function calculateAngle(pointA, pointB, pointC) {
  const radians = Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) - 
                  Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  
  return angle;
}
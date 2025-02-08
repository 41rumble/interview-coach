# Interview Coach AI

An innovative real-time interview coaching application that uses computer vision and AI to help you improve your interview performance. The app analyzes your facial expressions, eye contact, and body language in real-time, providing instant feedback to help you present yourself more confidently during interviews.

## Why This Matters

During interviews, non-verbal communication plays a crucial role:
- 55% of first impressions are based on body language and facial expressions
- Maintaining appropriate eye contact increases your chances of success by 41%
- Confident posture can improve both interviewer perception and your own performance

This tool helps you practice and improve these critical aspects of interviewing.

## Core Features

### Real-time Analysis
- **Face Tracking**: Advanced facial landmark detection
- **Eye Contact Monitoring**: Tracks gaze direction and engagement
- **Expression Analysis**: Identifies and measures facial expressions
- **Performance Metrics**: Real-time scoring of key interview behaviors

### Smart Feedback
- Instant suggestions for improvement
- Eye contact quality assessment
- Expression appropriateness guidance
- Overall performance scoring

### Interactive Interface
- Live video feed with optional visual guides
- Real-time performance metrics
- Expression analysis dashboard
- Toggle-able visual markers for different tracking features

## Technical Implementation

### Technology Stack
- **Frontend**: React with Material-UI
- **Computer Vision**: MediaPipe Tasks Vision
- **Performance**: GPU-accelerated processing
- **Real-time Processing**: WebGL and optimized rendering

### Key Technical Features
- GPU-accelerated face detection and tracking
- Efficient canvas rendering
- Throttled state updates for smooth performance
- Separated visualization from analysis pipeline

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Modern web browser with WebGL support
- Webcam access

### Installation

1. Clone the repository:
```bash
git clone https://github.com/41rumble/interview-coach.git
cd interview-coach
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage Guide

1. **Initial Setup**
   - Grant camera access when prompted
   - Position yourself in good lighting
   - Ensure your face is clearly visible

2. **Using the Interface**
   - Toggle visual guides with the switches at the top
   - Monitor your metrics in the right panel
   - Review real-time feedback
   - Check expression analysis

3. **Practice Sessions**
   - Start with visual guides enabled to understand the tracking
   - Practice maintaining eye contact
   - Work on appropriate expressions
   - Review your performance metrics

## Performance Optimization

The application is optimized for real-time performance:
- Face detection runs continuously for analysis
- Visual overlays can be toggled without affecting analysis
- State updates are throttled to maintain smooth performance
- GPU acceleration for computer vision tasks

## Future Enhancements

Planned features include:
- Full body language analysis
- Voice tone analysis
- Question practice mode
- Session recording and playback
- Detailed performance reports
- AI-powered interview simulation

## Contributing

We welcome contributions! Whether it's:
- Bug reports
- Feature suggestions
- Code contributions
- Documentation improvements

Please feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- MediaPipe team for their excellent computer vision tools
- React community for the robust framework
- Material-UI team for the beautiful components

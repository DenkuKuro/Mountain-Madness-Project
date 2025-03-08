import cv2  # OpenCV for image/video processing
from deepface import DeepFace  # DeepFace for facial emotion recognition

# Initialize the webcam
cap = cv2.VideoCapture(0)

# Loop to continuously capture frames
while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame.")
        break

    # Detect emotions using DeepFace
    try:
        result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
        # Get the dominant emotion
        dominant_emotion = result[0]['dominant_emotion']
        
        # Display the emotion on the frame
        cv2.putText(frame, f'Emotion: {dominant_emotion}', (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
    except Exception as e:
        print(f"Error in emotion detection: {e}")
    
    # Display the resulting frame
    cv2.imshow("Emotion Recognition", frame)

    # Exit if the user presses the 'q' key
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the webcam and close the OpenCV window
cap.release()
cv2.destroyAllWindows()

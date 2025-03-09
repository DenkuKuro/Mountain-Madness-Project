import cv2
from deepface import DeepFace
from collections import deque
import time
from collections import Counter
from sound_player import play_sound, stop_sound

# Initialize the webcam
cap = cv2.VideoCapture(0)

# Create a deque with a fixed size of 10 (queue)
emotion_history = deque(maxlen=10)

# Time tracking variables
last_print_time = time.time()
last_add_time = time.time()

# Music variables
# Flag to check if music is selected
music_selected = True
# Music start time
music_start_time = None  
# Flag to check if music is playing
music_playing = False

# Set the sample rate (0.1 seconds)
sample_rate = 0.1
print_rate = 1.0  # Print most frequent emotion every 1 second

# Variable to hold current emotion
current_playing_emotion = None

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

    # Add the current emotion to the history every 0.1 seconds
    if time.time() - last_add_time >= sample_rate:
        # Add the current emotion to the history (deque with max size 10)
        emotion_history.append(dominant_emotion)
        last_add_time = time.time()  # Update the time for the next 0.1 second interval

    # Print the most frequent emotion every 1 second
    if time.time() - last_print_time >= print_rate:
        if len(emotion_history) > 0:
            # Find the most frequent emotion in the queue (deque)
            most_frequent_emotion = Counter(emotion_history).most_common(1)[0][0]

            # Print the most frequent emotion
            print(f"Current Most Frequent Emotion: {most_frequent_emotion}")

            if music_selected and most_frequent_emotion is not None:
                # If a new emotion appears and either no music is playing or previous emotion was neutral, start playing immediately
                if not music_playing or current_playing_emotion == "neutral":
                    play_sound(most_frequent_emotion)
                    music_playing = True
                    music_start_time = time.time()
                    current_playing_emotion = most_frequent_emotion
                elif music_start_time is not None and time.time() - music_start_time >= 5:
                    # Ensure the previous emotion plays for at least 5 seconds before switching
                    stop_sound()
                    play_sound(most_frequent_emotion)
                    music_start_time = time.time()
                    current_playing_emotion = most_frequent_emotion

        last_print_time = time.time()  # Update the time for the next 1 second interval

    # Exit if the user presses the 'q' key
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the webcam and close the OpenCV window
cap.release()
cv2.destroyAllWindows()

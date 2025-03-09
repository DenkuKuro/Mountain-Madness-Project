from flask import Flask, request, jsonify
import cv2
from deepface import DeepFace
import numpy as np
import base64
from collections import deque, Counter
from sound_player import play_sound, stop_sound
import time

app = Flask(__name__)

# Variable to hold the current dominant emotion
current_emotion = None

# Create a deque with a fixed size of 10 (queue)
emotion_history = deque(maxlen=10)

# Time tracking variables
last_print_time = time.time()
last_add_time = time.time()

# Set the sample rate (0.1 seconds)
sample_rate = 0.1
print_rate = 1.0  # Print most frequent emotion every 1 second


@app.route('/detect_emotion', methods=['POST'])
def detect_emotion():
    global current_emotion, emotion_history, last_print_time, last_add_time

    # Get the image data from the request
    data = request.json['image']
    image_data = base64.b64decode(data)
    nparr = np.frombuffer(image_data, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Detect emotions using DeepFace
    try:
        result = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
        dominant_emotion = result[0]['dominant_emotion']
        current_emotion = dominant_emotion
        print(current_emotion)

        # Add the current emotion to the history every 0.1 seconds
        if time.time() - last_add_time >= sample_rate:
            emotion_history.append(dominant_emotion)
            last_add_time = time.time()

        # Print the most frequent emotion every 1 second
        if time.time() - last_print_time >= print_rate:
            if len(emotion_history) > 0:
                most_frequent_emotion = Counter(emotion_history).most_common(1)[0][0]
                print(f"Current Most Frequent Emotion: {most_frequent_emotion}")
            last_print_time = time.time()

        return jsonify({'emotion': dominant_emotion})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
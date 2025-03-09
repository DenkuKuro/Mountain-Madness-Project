# sound_player.py
import pygame

# Initialize pygame mixer for audio
pygame.mixer.init()

fade_ms = 500

# Dictionary to map emotions to their sound file paths
emotion_sounds = {
    "angry": "sounds/angry.wav",
    "disgust": "sounds/disgust.flac",
    "fear": "sounds/fear.mp3",
    "happy": "sounds/happy.wav",
    "neutral": None,  # No sound for neutral
    "sad": "sounds/sad.wav",
    "surprise": "sounds/surprised.wav"
}

def play_sound(emotion):
    sound_path = emotion_sounds.get(emotion)
    if sound_path:
        pygame.mixer.music.load(sound_path)
        pygame.mixer.music.play(fade_ms=fade_ms)

def stop_sound():
    pygame.mixer.music.fadeout(fade_ms)

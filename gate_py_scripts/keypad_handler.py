import time
import RPi.GPIO as GPIO
from keypad import keypad
 
GPIO.setwarnings(False)

kp = keypad()

while True:
    print(kp.getKey())
    time.sleep(0.5)

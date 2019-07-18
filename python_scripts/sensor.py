import RPi.GPIO as GPIO
import time
import sys

GPIO.setmode(GPIO.BCM)

args = sys.argv
port = None

if len(args) == 2:
    try:
        port = int(args[1])
        GPIO.setup(port, GPIO.IN, pull_up_down=GPIO.PUD_UP)

        while True:
            state = GPIO.input(port)
            if state == False:
                print('laser obstacle detected')
                time.sleep(0.2)
    except:
        sys.exit(0)
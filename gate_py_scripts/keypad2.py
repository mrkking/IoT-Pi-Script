import time
import json
from pad4pi import rpi_gpio
import RPi.GPIO as GPIO
import requests
GPIO.setwarnings(False)

KEYPAD = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    ["*", 0, "#"]
]

ROW_PINS = [6,13,16,19] # BCM numbering
COL_PINS = [0,5,12] # BCM numbering

entered_pin = ''

def enterPin(num):
    global entered_pin
    if len(entered_pin) >= 6:
        reset()
    else:
        entered_pin += str(num)

def reset():
    global entered_pin
    entered_pin = ''

def submit():
    global entered_pin
    if len(entered_pin) is 6:
        r = requests.get(url='http://localhost:4000/kp/'+entered_pin, params=None)
    reset()

def printKey(key):
    try:
        num_key = int(key)
        if num_key >= 0 and num_key <= 9:
            enterPin(num_key)
    except ValueError:
        if key == '*':
            reset()
        if key == '#':
            submit()

def cleanup():
    global keypad
    keypad.cleanup()

try:
    factory = rpi_gpio.KeypadFactory()
    keypad = factory.create_keypad(keypad=KEYPAD, row_pins=ROW_PINS, col_pins=COL_PINS) 
    keypad.registerKeyPressHandler(printKey)
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    cleanup()
finally:
    cleanup()

keypad.cleanup()

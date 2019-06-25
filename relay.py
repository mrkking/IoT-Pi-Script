import RPi.GPIO as GPIO

class Relay:
    
    def __init__(self, relay_port):
        GPIO.setwarnings(False)
        GPIO.setmode(GPIO.BCM)
        self.port = relay_port
        GPIO.setup(self.port ,GPIO.OUT)
        
        
    def close(self):
        GPIO.output(self.port,GPIO.HIGH)
        
    def open(self):
        GPIO.output(self.port,GPIO.LOW)

    def get_value(self):
       return GPIO.input(self.port)

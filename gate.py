from relay import Relay
import time

class Gate:
    
    def __init__(self, relay_port):
        self.relay = Relay(relay_port)
        
    def open(self):
        self.relay.open()
        self.print_state()
        
    def close(self):
        self.relay.close()
        self.print_state()
        
    def toggle(self):
        self.relay.open()
        self.print_state()
        time.sleep(10)
        self.relay.close()
        self.print_state()
        
    def print_state(self):
        val = self.relay.get_value();
        if val == 0:
            print("{\"state\":\"open\"}")
        elif val == 1:
            print("{\"state\":\"close\"}")
        else:
            print("{\"error\":\"unable to determine state\"}")

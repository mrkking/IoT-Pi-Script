#!/usr/bin/env python

import pigpio

class decoder:

   def __init__(self, pi, gpio_0, gpio_1, callback, bit_timeout=5):
      self.pi = pi
      self.gpio_0 = gpio_0
      self.gpio_1 = gpio_1

      self.callback = callback

      self.bit_timeout = bit_timeout

      self.in_code = False

      self.pi.set_mode(gpio_0, pigpio.INPUT)
      self.pi.set_mode(gpio_1, pigpio.INPUT)

      self.pi.set_pull_up_down(gpio_0, pigpio.PUD_UP)
      self.pi.set_pull_up_down(gpio_1, pigpio.PUD_UP)

      self.cb_0 = self.pi.callback(gpio_0, pigpio.FALLING_EDGE, self._cb)
      self.cb_1 = self.pi.callback(gpio_1, pigpio.FALLING_EDGE, self._cb)

   def _cb(self, gpio, level, tick):

      if level < pigpio.TIMEOUT:
         if self.in_code == False:
            self.bits = 1
            self.num = 0

            self.in_code = True
            self.code_timeout = 0
            self.pi.set_watchdog(self.gpio_0, self.bit_timeout)
            self.pi.set_watchdog(self.gpio_1, self.bit_timeout)
         else:
            self.bits += 1
            self.num = self.num << 1

         if gpio == self.gpio_0:
            self.code_timeout = self.code_timeout  & 2 # clear gpio 0 timeout
         else:
            self.code_timeout = self.code_timeout  & 1 # clear gpio 1 timeout
            self.num = self.num | 1

      else:

         if self.in_code:
            if gpio == self.gpio_0:
               self.code_timeout = self.code_timeout | 1 # timeout gpio 0
            else:
               self.code_timeout = self.code_timeout | 2 # timeout gpio 1

            if self.code_timeout == 3: # both gpios timed out
               self.pi.set_watchdog(self.gpio_0, 0)
               self.pi.set_watchdog(self.gpio_1, 0)
               self.in_code = False
               self.callback(self.bits, self.num)

   def cancel(self):
      self.cb_0.cancel()
      self.cb_1.cancel()


if __name__ == "__main__":

   import time

   import pigpio

   import wiegand

   import requests

   def convert_val_pin(value):
      value ='{:26b}'.format(value)
      value = value[:25]
      value = value[5:25]
      return int(value,2)

   def callback(bits, value):
      #print('bits={} value={:026b}'.format(bits, value))
      pin = convert_val_pin(value)
      try:
        requests.get(url='http://localhost:4000/kp/'+str(pin))
      except:
          print(pin)


   pi = pigpio.pi()

   w = wiegand.decoder(pi, 14, 15, callback)

   time.sleep(300)

   #w.cancel()

   #pi.stop()


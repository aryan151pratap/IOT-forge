import network
import time

class WiFiManager:

    def __init__(self, ssid, password):
        self.ssid = ssid
        self.password = password
        self.wifi = network.WLAN(network.STA_IF)

    def connect(self):
        self.wifi.active(True)
        
        if self.wifi.isconnected():
            print("Already Connected")
            return

        print("Connecting WiFi...", end="")
        self.wifi.connect(self.ssid, self.password)

        while not self.wifi.isconnected():
            time.sleep(1)
            print(".", end="")

        print("\nConnected")
        print(self.wifi.ifconfig())

    def ip(self):
        return self.wifi.ifconfig()[0]

    def isconnected(self):
        return self.wifi.isconnected()
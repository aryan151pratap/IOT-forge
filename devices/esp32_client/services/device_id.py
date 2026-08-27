import network
import machine
import os
import gc

DEVICE_FILE = "device_id.txt"

def get_device_id():
    try:
        with open(DEVICE_FILE, "r") as file:
            return file.read().strip()

    except OSError:
        wlan = network.WLAN(network.STA_IF)
        wlan.active(True)

        mac = wlan.config("mac")

        device_id = "esp32_" + "".join(
            "{:02x}".format(x) for x in mac
        )

        with open(DEVICE_FILE, "w") as file:
            file.write(device_id)

        return device_id

def get_device_info():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)

    mac = wlan.config("mac")

    gc.collect()

    free_memory = gc.mem_free()
    allocated_memory = gc.mem_alloc()

    return {
        "device_id": get_device_id(),
        "mac": ":".join("{:02x}".format(x) for x in mac),
        "name": os.uname().sysname,
        "platform": os.uname().machine,
        "firmware": os.uname().release,
        "free_memory": free_memory,
        "allocated_memory": allocated_memory,
        "heap_total": free_memory + allocated_memory,
    }
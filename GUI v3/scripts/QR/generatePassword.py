#/bin/bash/python3

import string
import random
import pyqrcode
import sys

passwd = ''

for i in range(40):
    passwd += random.choice(string.ascii_letters + string.digits)

with open("pass.txt", "w") as text_file:
    print(passwd, file=text_file)

passqr = pyqrcode.create(passwd)

passqr.png('qr.png', scale=5)

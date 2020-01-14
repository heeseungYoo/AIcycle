import serial
#print('serial' + serial.__version__)

PORT = 'COM8'
BaudRate = 9600

ser = serial.Serial(PORT, BaudRate)

while True:
    print("insert value : ", end='')
    op = input()
    ser.write(op.encode())
    

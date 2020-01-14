#include<Servo.h>
Servo servo1, servo2, servo3;
int value = 0;

void setup() {
  servo1.attach(7);
  servo2.attach(8);
  servo3.attach(9);
  Serial.begin(9600);
}

void loop() {
  if (Serial.available())
  {
    char in_data;
    in_data = Serial.read();
    if(in_data == '1')
    {
      value = 180;
      servo1.write(value);
      delay(3000);
      value=0;
      servo1.write(value);
    }
    else if(in_data == '2')
    {
      value = 180;
      servo2.write(value);
      delay(3000);
      value = 0;
      servo2.write(value);
    }
    else if(in_data == '3')
    {
      value = 180;
      servo3.write(value);
      delay(3000);
      value = 0;
      servo3.write(value);
    }
  }
}

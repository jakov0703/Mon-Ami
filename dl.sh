#!/bin/bash
B="https://www.monami.hr/wp-content"
dl(){ curl -sS -k --max-time 60 -o "raw/$2" "$1" && echo "OK $2 $(stat -c%s raw/$2)" || echo "FAIL $2"; }
for n in 01 02 03 05 08 12 14 18 21 25 28 30 33 37 40; do
  dl "$B/gallery/monami/$n.jpg" "g$n.jpg" &
done
dl "$B/uploads/2020/02/onama1.jpg" "onama1.jpg" &
dl "$B/uploads/2020/02/onama2.jpg" "onama2.jpg" &
dl "$B/uploads/2019/11/0010.jpg" "p0010.jpg" &
dl "$B/uploads/2024/08/bg3D3-08-24.jpg" "chef.jpg" &
dl "$B/uploads/2019/11/logo-monami.png" "logo.png" &
wait

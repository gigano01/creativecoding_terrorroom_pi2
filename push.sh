#!/bin/bash
sudo /home/pi/project/rpi-matrix-pixelpusher/pixel-push \
-i lo \
-u 65507 \
--led-gpio-mapping=regular \
--led-rows=64 \
--led-cols=64 \
--led-chain=1 \
--led-parallel=1 \
--led-no-hardware-pulse \
--led-slowdown-gpio=4 \
--led-show-refresh \
--led-brightness=20

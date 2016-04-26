#!/bin/bash
sudo ionic build android
sudo adb install -r platforms/android/ant-build/CordovaApp-debug.apk

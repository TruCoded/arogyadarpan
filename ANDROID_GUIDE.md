# ArogyaDarpan Android Application Guide

This folder contains the complete native Android version of **ArogyaDarpan** built with React, Vite, Tailwind CSS, and Capacitor.

---

## 📱 Quick Run Options

### Option 1: Open in Android Studio (Recommended)
1. Open **Android Studio**.
2. Click **Open** and select the folder:
   ```
   e:\VS_code\sih project\arogyadarpan-android\android
   ```
3. Let Gradle sync automatically.
4. Connect your Android device via USB (with USB Debugging enabled) or start an Android Virtual Device (AVD / Emulator).
5. Click the green **Run ▶** button.

Alternatively, from the terminal:
```bash
npm run cap:open
```

---

### Option 2: Build APK via Terminal (Debug APK)
If you have Java & the Android SDK on your path, you can build an APK directly with Gradle:
```bash
cd android
./gradlew assembleDebug
```
The output APK will be generated at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```
You can transfer and install this `.apk` directly onto any Android phone.

---

### Option 3: Live Dev Server on Phone (Live Reload)
To test live code changes on your mobile phone while developing:
1. Ensure your computer and phone are connected to the same Wi-Fi network.
2. Find your computer's IP address (e.g. `192.168.1.5`).
3. In `capacitor.config.json`, add:
   ```json
   "server": {
     "url": "http://192.168.1.5:5173",
     "cleartext": true
   }
   ```
4. Run `npm run dev -- --host` in this directory.
5. Run `npx cap run android` or click Run in Android Studio.

---

## 🛠 Project Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Start Vite dev server for browser preview |
| `npm run build` | Build the optimized web production bundle |
| `npm run build:android` | Build web bundle and sync native assets to Android |
| `npm run cap:sync` | Sync plugins and assets to native Android project |
| `npm run cap:open` | Launch Android Studio for this project |
| `npm run cap:run` | Build and deploy directly to connected Android device |

---

## 🔒 Configured Native Android Permissions
Defined in `android/app/src/main/AndroidManifest.xml`:
- `android.permission.INTERNET` (Network communication)
- `android.permission.RECORD_AUDIO` (Voice input for patient intake)
- `android.permission.MODIFY_AUDIO_SETTINGS` (Microphone audio adjustments)
- `android.permission.CAMERA` (Prescription and report scanning)

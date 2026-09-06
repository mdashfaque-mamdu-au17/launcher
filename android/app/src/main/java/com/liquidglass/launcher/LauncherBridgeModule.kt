package com.liquidglass.launcher

import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.hardware.camera2.CameraManager
import android.media.AudioManager
import android.provider.Settings
import android.util.Base64
import android.view.WindowManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.ByteArrayOutputStream

class LauncherBridgeModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "LauncherBridge"

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        Thread {
            try {
                val pm = reactContext.packageManager
                val mainIntent = Intent(Intent.ACTION_MAIN, null).apply {
                    addCategory(Intent.CATEGORY_LAUNCHER)
                }

                val resolveInfos = pm.queryIntentActivities(mainIntent, 0)
                val appsArray = Arguments.createArray()

                // Sort alphabetically by label
                val sortedList = resolveInfos.sortedBy {
                    it.loadLabel(pm).toString().lowercase()
                }

                for (info in sortedList) {
                    val packageName = info.activityInfo.packageName
                    if (packageName == reactContext.packageName) {
                        // Skip launcher itself from app list
                        continue
                    }

                    val label = info.loadLabel(pm).toString()
                    val iconDrawable = info.loadIcon(pm)
                    val base64Icon = drawableToBase64(iconDrawable)

                    val appMap = Arguments.createMap().apply {
                        putString("label", label)
                        putString("packageName", packageName)
                        putString("icon", base64Icon)
                    }
                    appsArray.pushMap(appMap)
                }

                promise.resolve(appsArray)
            } catch (e: Exception) {
                promise.reject("FETCH_ERROR", "Failed to retrieve installed apps: ${e.message}", e)
            }
        }.start()
    }

    @ReactMethod
    fun launchApp(packageName: String, promise: Promise) {
        try {
            val pm = reactContext.packageManager
            val launchIntent = pm.getLaunchIntentForPackage(packageName)
            if (launchIntent != null) {
                launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                reactContext.startActivity(launchIntent)
                promise.resolve(true)
            } else {
                promise.reject("LAUNCH_FAILED", "Could not find launcher activity for package: $packageName")
            }
        } catch (e: Exception) {
            promise.reject("LAUNCH_ERROR", "Failed to launch $packageName: ${e.message}", e)
        }
    }

    @ReactMethod
    fun getVolume(promise: Promise) {
        try {
            val audioManager = reactContext.getSystemService(Context.AUDIO_SERVICE) as AudioManager
            val current = audioManager.getStreamVolume(AudioManager.STREAM_MUSIC)
            val max = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC)
            val ratio = if (max > 0) current.toDouble() / max.toDouble() else 0.5
            promise.resolve(ratio)
        } catch (e: Exception) {
            promise.reject("VOLUME_ERROR", "Could not get volume: ${e.message}", e)
        }
    }

    @ReactMethod
    fun setVolume(ratio: Double, promise: Promise) {
        try {
            val audioManager = reactContext.getSystemService(Context.AUDIO_SERVICE) as AudioManager
            val max = audioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC)
            val target = (ratio * max).toInt().coerceIn(0, max)
            audioManager.setStreamVolume(AudioManager.STREAM_MUSIC, target, 0)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("VOLUME_ERROR", "Could not set volume: ${e.message}", e)
        }
    }

    @ReactMethod
    fun getBrightness(promise: Promise) {
        try {
            val cur = Settings.System.getInt(
                reactContext.contentResolver,
                Settings.System.SCREEN_BRIGHTNESS,
                128
            )
            promise.resolve(cur.toDouble() / 255.0)
        } catch (e: Exception) {
            promise.resolve(0.5)
        }
    }

    @ReactMethod
    fun setBrightness(ratio: Double, promise: Promise) {
        try {
            val clamped = ratio.coerceIn(0.01, 1.0).toFloat()
            // Immediately adjust current activity window brightness attribute (works without WRITE_SETTINGS!)
            val activity = reactContext.currentActivity
            activity?.runOnUiThread {
                val window = activity.window
                val lp = window?.attributes
                if (lp != null) {
                    lp.screenBrightness = clamped
                    window.attributes = lp
                }
            }

            // Also persist to system brightness if WRITE_SETTINGS is granted
            if (Settings.System.canWrite(reactContext)) {
                val intVal = (clamped * 255).toInt().coerceIn(1, 255)
                Settings.System.putInt(
                    reactContext.contentResolver,
                    Settings.System.SCREEN_BRIGHTNESS,
                    intVal
                )
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("BRIGHTNESS_ERROR", "Failed to set brightness: ${e.message}", e)
        }
    }

    @ReactMethod
    fun toggleTorch(enable: Boolean, promise: Promise) {
        try {
            val cameraManager = reactContext.getSystemService(Context.CAMERA_SERVICE) as CameraManager
            val cameraId = cameraManager.cameraIdList.firstOrNull()
            if (cameraId != null) {
                cameraManager.setTorchMode(cameraId, enable)
                promise.resolve(enable)
            } else {
                promise.reject("TORCH_ERROR", "No camera flash found")
            }
        } catch (e: Exception) {
            promise.reject("TORCH_ERROR", "Failed to toggle torch: ${e.message}", e)
        }
    }

    @ReactMethod
    fun openWifiSettings(promise: Promise) {
        try {
            val intent = Intent(Settings.ACTION_WIFI_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            reactContext.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SETTINGS_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun openBluetoothSettings(promise: Promise) {
        try {
            val intent = Intent(Settings.ACTION_BLUETOOTH_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            reactContext.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SETTINGS_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun openAirplaneSettings(promise: Promise) {
        try {
            val intent = Intent(Settings.ACTION_AIRPLANE_MODE_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            reactContext.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("SETTINGS_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun openDefaultAppsSettings(promise: Promise) {
        try {
            val intent = Intent(Settings.ACTION_MANAGE_DEFAULT_APPS_SETTINGS).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            reactContext.startActivity(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            try {
                val fallbackIntent = Intent(Settings.ACTION_HOME_SETTINGS).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                reactContext.startActivity(fallbackIntent)
                promise.resolve(true)
            } catch (err: Exception) {
                promise.reject("SETTINGS_ERROR", "Failed to open settings: ${err.message}", err)
            }
        }
    }

    private fun drawableToBase64(drawable: Drawable): String {
        return try {
            val bitmap = if (drawable is BitmapDrawable && drawable.bitmap != null) {
                drawable.bitmap
            } else {
                val width = if (drawable.intrinsicWidth > 0) drawable.intrinsicWidth else 144
                val height = if (drawable.intrinsicHeight > 0) drawable.intrinsicHeight else 144
                val bmp = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
                val canvas = Canvas(bmp)
                drawable.setBounds(0, 0, canvas.width, canvas.height)
                drawable.draw(canvas)
                bmp
            }

            // Downscale to max 144x144 for optimal memory and transfer speed
            val scaledBitmap = if (bitmap.width > 144 || bitmap.height > 144) {
                Bitmap.createScaledBitmap(bitmap, 144, 144, true)
            } else {
                bitmap
            }

            val outputStream = ByteArrayOutputStream()
            scaledBitmap.compress(Bitmap.CompressFormat.PNG, 90, outputStream)
            val byteArray = outputStream.toByteArray()
            "data:image/png;base64," + Base64.encodeToString(byteArray, Base64.NO_WRAP)
        } catch (e: Exception) {
            ""
        }
    }
}

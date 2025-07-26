package app.lovable.afrikoin;

import android.os.Build;
import android.os.Bundle;
import android.content.res.Configuration;
import android.util.Log;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import androidx.annotation.NonNull;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * AfriKoin MainActivity
 * Architecture: React + Capacitor Hybrid App
 * Design System: Material Design 3
 * Category: FinTech & Social Platform
 */
@CapacitorPlugin(name = "AfriKoinMain")
public class MainActivity extends BridgeActivity {
    
    private static final String TAG = "AfriKoin.MainActivity";
    private static final String ARCHITECTURE = "React-Capacitor";
    private static final String DESIGN_SYSTEM = "Material-Design-3";
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Log architecture information for Android Studio detection
        Log.i(TAG, "Architecture: " + ARCHITECTURE);
        Log.i(TAG, "Design System: " + DESIGN_SYSTEM);
        Log.i(TAG, "App Category: FinTech & Social");
        Log.i(TAG, "Framework: React with Capacitor Bridge");
        
        // Configure theme and UI
        configureThemeAndUI();
        
        // Enable edge-to-edge display for modern Android versions
        configureEdgeToEdge();
        
        // Configure device compatibility
        configureDeviceCompatibility();
    }
    
    private void configureThemeAndUI() {
        // Apply AfriKoin Material Design theme
        setTheme(getResources().getIdentifier("AppTheme.AfriKoin", "style", getPackageName()));
        
        // Configure status bar for brand consistency
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            getWindow().setStatusBarColor(getResources().getColor(
                getResources().getIdentifier("afrikoin_primary", "color", getPackageName())
            ));
        }
    }
    
    private void configureEdgeToEdge() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            // Android 14+ edge-to-edge implementation
            WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
            
            WindowInsetsControllerCompat windowInsetsController = 
                WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
            
            if (windowInsetsController != null) {
                windowInsetsController.setSystemBarsBehavior(
                    WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                );
            }
        }
    }
    
    private void configureDeviceCompatibility() {
        // Log device capabilities for development
        Log.d(TAG, "Device API Level: " + Build.VERSION.SDK_INT);
        Log.d(TAG, "Device Model: " + Build.MODEL);
        Log.d(TAG, "Screen Density: " + getResources().getDisplayMetrics().density);
        
        // Configure responsive behavior
        if (getResources().getConfiguration().orientation == Configuration.ORIENTATION_LANDSCAPE) {
            Log.d(TAG, "Landscape mode detected");
        }
    }
    
    @Override
    public void onConfigurationChanged(@NonNull Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        
        // Handle configuration changes for responsive design
        if (newConfig.orientation == Configuration.ORIENTATION_LANDSCAPE) {
            Log.d(TAG, "Switched to landscape mode");
        } else if (newConfig.orientation == Configuration.ORIENTATION_PORTRAIT) {
            Log.d(TAG, "Switched to portrait mode");
        }
        
        // Handle dark/light mode changes
        int currentNightMode = newConfig.uiMode & Configuration.UI_MODE_NIGHT_MASK;
        switch (currentNightMode) {
            case Configuration.UI_MODE_NIGHT_NO:
                Log.d(TAG, "Light mode activated");
                break;
            case Configuration.UI_MODE_NIGHT_YES:
                Log.d(TAG, "Dark mode activated");
                break;
        }
    }
}
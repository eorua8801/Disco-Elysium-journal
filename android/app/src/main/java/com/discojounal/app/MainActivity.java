package com.discojounal.app;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(OnDeviceLLMPlugin.class);
        super.onCreate(savedInstanceState);

        // Full immersive mode: hide status bar + navigation bar.
        // Swiping from screen edge temporarily reveals them (game-style).
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        WindowInsetsControllerCompat insetsCtrl =
            WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        insetsCtrl.hide(WindowInsetsCompat.Type.systemBars());
        insetsCtrl.setSystemBarsBehavior(
            WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        );
    }
}

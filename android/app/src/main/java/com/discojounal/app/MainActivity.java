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

        // Must be called BEFORE super.onCreate() (which calls setContentView).
        // This opts the window into edge-to-edge layout so we can hide system bars.
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);

        super.onCreate(savedInstanceState);

        // Hide status bar + navigation bar (game-style immersive).
        // Swipe from screen edge temporarily reveals them.
        WindowInsetsControllerCompat insetsCtrl =
            WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        insetsCtrl.hide(WindowInsetsCompat.Type.systemBars());
        insetsCtrl.setSystemBarsBehavior(
            WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        );
    }
}

package app.lovable.afrikoin;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import androidx.activity.EdgeToEdge;

public class HomeActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            EdgeToEdge.enable(this);
        } catch (Exception ignored) {}
        
        // Cette activité charge l'application Capacitor/Web
        // Le layout est géré par Capacitor
    }
}
package app.lovable.afrikoin;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;
import androidx.activity.EdgeToEdge;

public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            EdgeToEdge.enable(this);
        } catch (Exception ignored) {}
        
        setContentView(R.layout.activity_main);
        
        Button commencerButton = findViewById(R.id.btn_commencer);
        commencerButton.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this, HomeActivity.class);
            startActivity(intent);
            finish();
        });
    }
}
let dqStatus = {}; // Speichert, wer disqualifiziert ist (z.B. {0: true})

window.toggleDQ = function(index) {
    dqStatus[index] = !dqStatus[index];
    
    const card = document.getElementById(`card-${index}`);
    const overlay = document.getElementById(`dq-overlay-${index}`);
    const inputs = document.getElementById(`inputs-${index}`).querySelectorAll('input');
    const totalDisplay = document.getElementById(`total-${index}`);

    if (dqStatus[index]) {
        card.classList.add('opacity-50', 'grayscale');
        overlay.classList.remove('hidden');
        overlay.classList.add('flex');
        inputs.forEach(i => i.disabled = true);
        totalDisplay.innerText = "DQ";
    } else {
        card.classList.remove('opacity-50', 'grayscale');
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
        inputs.forEach(i => i.disabled = false);
    }
    updatePost(); // Post neu generieren
}

// In deiner updatePost() Funktion musst du die Logik für den Text anpassen:
function updatePost() {
    // ... bisherige KM/HM Logik ...
    
    // Beim Erstellen des Rankings:
    data.forEach((m, i) => {
        let line = "";
        if (dqStatus[m.originalIndex]) {
            line = `${i + 1}. ${m.name} → ❌ DISQUALIFIZIERT`;
        } else {
            // ... normale KM Anzeige + Strafe ...
            line = `${i + 1}. ${m.name} → ${m.totalKm.toFixed(1)}km`;
            // Strafe berechnen...
        }
        text += line + `\n`;
    });
}
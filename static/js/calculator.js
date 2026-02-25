let dqStatus = {};

// 1. Karten generieren
function renderMembers() {
    const container = document.getElementById('member-container');
    container.innerHTML = SEKKEL_MEMBERS.map((member, index) => `
        <div class="card bg-base-100 border border-base-300 shadow-sm overflow-hidden transition-all duration-300" id="card-${index}">
            <div class="card-body p-4">
                <div class="flex items-center justify-between mb-5">
                    <div class="flex items-center gap-3">
                        <div class="avatar cursor-pointer relative group" onclick="toggleDQ(${index})">
                            <div id="dq-overlay-${index}" 
                                class="absolute inset-0 z-20 bg-red-600/80 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="white" class="w-7 h-7">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div class="w-12 h-12 rounded-xl ring-2 ring-orange-600 ring-offset-2 overflow-hidden">
                                <img src="${member.image}" class="object-cover h-full w-full" />
                            </div>
                        </div>
                        <div>
                            <h3 class="text-lg font-black italic uppercase tracking-tighter leading-none">
                                ${member.name}
                            </h3>
                            <p class="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-1">${member.role}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-[10px] font-black uppercase opacity-40 leading-none mb-1 text-orange-600">Total L-KM</p>
                        <div class="text-3xl font-black italic tracking-tighter leading-none">
                            <span id="total-${index}">0.0</span>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3" id="inputs-${index}">
                    <div class="relative">
                        <span class="absolute left-3 top-[-8px] bg-base-100 px-1 text-[9px] font-bold uppercase opacity-50 z-10">Distanz</span>
                        <input type="number" step="0.1" 
                               oninput="calculateSingleTotal(${index})" 
                               class="km-input input input-bordered input-md w-full focus:outline-orange-600 font-bold bg-base-50/30" 
                               placeholder="0.0">
                    </div>
                    <div class="relative">
                        <span class="absolute left-3 top-[-8px] bg-base-100 px-1 text-[9px] font-bold uppercase opacity-50 z-10">Höhenmeter</span>
                        <input type="number" step="1" 
                               oninput="calculateSingleTotal(${index})" 
                               class="hm-input input input-bordered input-md w-full focus:outline-orange-600 font-bold bg-base-50/30" 
                               placeholder="0">
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// 2. KM Berechnung (Live Update)
window.calculateSingleTotal = function(index) {
    if (dqStatus[index]) return;

    const card = document.getElementById(`card-${index}`);
    const kmValue = parseFloat(card.querySelector('.km-input').value) || 0;
    const hmValue = parseFloat(card.querySelector('.hm-input').value) || 0;
    
    // Berechnung: KM + (HM / 100)
    const total = kmValue + (hmValue / 100);
    
    document.getElementById(`total-${index}`).innerText = total.toFixed(1);
    
    if (typeof updatePost === "function") updatePost();
};

// 3. DQ Toggle
window.toggleDQ = function(index) {
    dqStatus[index] = !dqStatus[index];
    
    const card = document.getElementById(`card-${index}`);
    const overlay = document.getElementById(`dq-overlay-${index}`);
    const inputs = card.querySelectorAll('input');
    const totalDisplay = document.getElementById(`total-${index}`);

    if (dqStatus[index]) {
        // DISQUALIFIZIERT
        card.classList.add('opacity-40', 'grayscale');
        
        // Overlay dauerhaft sichtbar machen (überschreibt hover)
        overlay.classList.remove('opacity-0');
        overlay.classList.add('opacity-100');
        
        inputs.forEach(i => i.disabled = true);
        totalDisplay.innerText = "DQ";
    } else {
        // AKTIV
        card.classList.remove('opacity-40', 'grayscale');
        
        // Overlay wieder auf Standard (nur bei Hover sichtbar)
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0');
        
        inputs.forEach(i => i.disabled = false);
        calculateSingleTotal(index);
    }
    
    if (typeof updatePost === "function") updatePost();
}

function updatePost() {
    // 1. Daten sammeln und berechnen
    let results = SEKKEL_MEMBERS.map((member, index) => {
        const card = document.getElementById(`card-${index}`);
        const kmValue = parseFloat(card.querySelector('.km-input').value) || 0;
        const hmValue = parseFloat(card.querySelector('.hm-input').value) || 0;
        const totalKm = Math.round((kmValue + (hmValue / 100)) * 10) / 10; // Auf 1 Nachkommastelle runden

        return {
            name: member.name,
            totalKm: totalKm,
            isDQ: dqStatus[index] || false
        };
    });

    // 2. Sortieren: Aktiv zuerst (nach KM absteigend), DQ am Ende
    results.sort((a, b) => {
        if (a.isDQ && !b.isDQ) return 1;
        if (!a.isDQ && b.isDQ) return -1;
        if (!a.isDQ && !b.isDQ) return b.totalKm - a.totalKm;
        return 0;
    });

    // 3. Eindeutige Werte der aktiven Läufer ermitteln für die Rang-Logik
    const activeResults = results.filter(r => !r.isDQ);
    const uniqueKmValues = [...new Set(activeResults.map(r => r.totalKm))].sort((a, b) => b - a);
    
    // Die letzten beiden KM-Werte identifizieren
    const lastValue = uniqueKmValues[uniqueKmValues.length - 1];
    const secondLastValue = uniqueKmValues[uniqueKmValues.length - 2];

    // 4. Post-Text generieren
    let text = ``;

    results.forEach((m, i) => {
        let line = `${i + 1}. ${m.name} `;
        
        if (m.isDQ) {
            line += `→ ❌ DISQUALIFIZIERT`;
        } else {
            line += `→ ${m.totalKm.toFixed(1)} L-KM`;
            
            // Gleichstands-Zahlungslogik
            if (m.totalKm === lastValue && uniqueKmValues.length >= 1) {
                line += ` 💸 10.– CHF`;
            } else if (m.totalKm === secondLastValue && uniqueKmValues.length >= 2) {
                line += ` 💸 5.– CHF`;
            }
        }
        text += line + `\n`;
    });

    const output = document.getElementById('post-output');
    if (output) output.value = text;
}

// Hilfsfunktion bleibt gleich
function getLastWeekNumber() {
    const today = new Date();
    const target = new Date(today.valueOf());
    const dayNr = (today.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    const currentKW = 1 + Math.ceil((firstThursday - target) / 604800000);
    return currentKW === 1 ? 52 : currentKW - 1;
}

// Neue Funktion: Wird NUR beim Laden der Seite ausgeführt
function initHeader() {
    const kw = getLastWeekNumber();
    const titleField = document.getElementById('post-title');
    if (titleField) {
        titleField.value = `Kalenderwoche ${kw} - Blecherliste`;
    }
}

// In deinem bestehenden Script-Ende oder DOMContentLoaded:
window.addEventListener('load', () => {
    if (typeof SEKKEL_MEMBERS !== 'undefined') {
        renderMembers(); // Karten zeichnen
        initHeader();    // Ersten Post-Entwurf generieren
    }
});

function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    // Styling: Strava-Orange (bg-orange-600), Weißer Text, Schatten und abgerundet
    toast.className = "alert shadow-2xl py-3 px-8 rounded-xl font-black uppercase text-[11px] tracking-[0.15em] border-none";
    toast.style.backgroundColor = "#ea580c"; // Tailwind orange-600
    toast.style.color = "white";
    
    // Icon + Nachricht
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Sanftes Ein- und Ausblenden
    toast.style.transition = "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    toast.style.transform = "translateY(20px)";
    toast.style.opacity = "0";

    // Animation Start
    requestAnimationFrame(() => {
        toast.style.transform = "translateY(0)";
        toast.style.opacity = "1";
    });

    // Nach 2.5 Sekunden entfernen
    setTimeout(() => {
        toast.style.transform = "translateY(20px)";
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 400);
    }, 2500);
}

// Kopier-Funktionen mit Toast-Aufruf
function copyTitle() {
    const titleField = document.getElementById('post-title');
    titleField.select();
    navigator.clipboard.writeText(titleField.value);
    showToast("Titel kopiert!");
}

function copyPost() {
    const postField = document.getElementById('post-output');
    postField.select();
    navigator.clipboard.writeText(postField.value);
    showToast("Post kopiert!");
}

window.addEventListener('load', () => {
    if (typeof SEKKEL_MEMBERS !== 'undefined') {
        renderMembers();
    } else {
        console.error("Fehler: SEKKEL_MEMBERS wurde nicht gefunden. Prüfe die Pfade deiner Scripts!");
    }
});

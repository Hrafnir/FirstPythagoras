document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('pythagoras-form');
    const unknownSelect = document.getElementById('unknown');
    const groupA = document.getElementById('group-a');
    const groupB = document.getElementById('group-b');
    const groupC = document.getElementById('group-c');
    const inputA = document.getElementById('side-a');
    const inputB = document.getElementById('side-b');
    const inputC = document.getElementById('side-c');
    const stepsPre = document.getElementById('steps');
    const finalAnswerP = document.getElementById('final-answer');
    const currentDateSpan = document.getElementById('current-date');

    // Sett dagens dato
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    // Bruk norsk lokal tid og format
    currentDateSpan.textContent = today.toLocaleDateString('nb-NO', options) + ", " + today.toLocaleTimeString('nb-NO');


    // Funksjon for å vise/skjule input-felter basert på valg
    function toggleInputs() {
        const unknown = unknownSelect.value;
        groupA.style.display = (unknown === 'a') ? 'none' : 'flex';
        groupB.style.display = (unknown === 'b') ? 'none' : 'flex';
        groupC.style.display = (unknown === 'c') ? 'none' : 'flex';

        // Nullstill verdier når felt skjules
        if (unknown === 'a') inputA.value = '';
        if (unknown === 'b') inputB.value = '';
        if (unknown === 'c') inputC.value = '';
    }

    // Formater tall for penere visning (unngå unødvendige desimaler)
    function formatNumber(num) {
        // Hvis tallet er et heltall, vis det som heltall
        if (num % 1 === 0) {
            return num.toString();
        }
        // Ellers, rund til f.eks. 3 desimaler
        return num.toFixed(3);
    }

    // Event listener for endring i select-boksen
    unknownSelect.addEventListener('change', toggleInputs);

    // Event listener for form-innsending
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Forhindre standard innsending
        stepsPre.textContent = ''; // Tøm tidligere løsning
        finalAnswerP.textContent = ''; // Tøm tidligere svar

        const unknown = unknownSelect.value;
        let a = NaN, b = NaN, c = NaN;
        let steps = ''; // String for å bygge opp løsningsstegene
        let result = NaN;
        let sideLabel = '';

        // Hent og valider input
        try {
            if (unknown !== 'a') a = parseFloat(inputA.value);
            if (unknown !== 'b') b = parseFloat(inputB.value);
            if (unknown !== 'c') c = parseFloat(inputC.value);

            // Sjekk for gyldige tall
            if ((unknown !== 'a' && (isNaN(a) || a <= 0)) ||
                (unknown !== 'b' && (isNaN(b) || b <= 0)) ||
                (unknown !== 'c' && (isNaN(c) || c <= 0))) {
                throw new Error("Ugyldig input: Skriv inn positive tall for de kjente sidene.");
            }

            // Sjekk for umulig trekant (katet > hypotenus)
            if (unknown === 'a' && !isNaN(b) && !isNaN(c) && b >= c) {
                 throw new Error("Ugyldig trekant: Katet (b) kan ikke være større enn eller lik hypotenusen (c).");
            }
             if (unknown === 'b' && !isNaN(a) && !isNaN(c) && a >= c) {
                 throw new Error("Ugyldig trekant: Katet (a) kan ikke være større enn eller lik hypotenusen (c).");
            }

            // --- Beregning og Steg-for-steg Løsning ---

            steps += "Formel: a² + b² = c²\n\n";

            if (unknown === 'c') { // Finner hypotenusen c
                sideLabel = 'c';
                const a2 = a * a;
                const b2 = b * b;
                const a2_b2_sum = a2 + b2;

                steps += `Setter inn kjente verdier:\n`;
                steps += `${formatNumber(a)}² + ${formatNumber(b)}² = c²\n`;
                steps += `${formatNumber(a2)} + ${formatNumber(b2)} = c²\n`;
                steps += `${formatNumber(a2_b2_sum)} = c²\n\n`;

                steps += `Vi vil finne c, så vi tar kvadratroten på begge sider:\n`;
                steps += `√(${formatNumber(a2_b2_sum)}) = √(c²)     | √()\n`; // Balansemetode visning
                result = Math.sqrt(a2_b2_sum);
                steps += `${formatNumber(result)} = c\n`;

            } else if (unknown === 'a') { // Finner katet a
                 sideLabel = 'a';
                const b2 = b * b;
                const c2 = c * c;

                steps += `Setter inn kjente verdier:\n`;
                steps += `a² + ${formatNumber(b)}² = ${formatNumber(c)}²\n`;
                steps += `a² + ${formatNumber(b2)} = ${formatNumber(c2)}\n\n`;

                steps += `Vi vil ha a² alene, så vi trekker fra ${formatNumber(b2)} på begge sider:\n`;
                steps += `a² + ${formatNumber(b2)} - ${formatNumber(b2)} = ${formatNumber(c2)} - ${formatNumber(b2)}     | - ${formatNumber(b2)}\n`; // Balansemetode
                const a2 = c2 - b2;
                steps += `a² = ${formatNumber(a2)}\n\n`;

                 if (a2 < 0) { // Burde ikke skje pga. validering over, men greit å ha
                    throw new Error("Kan ikke ta kvadratroten av et negativt tall. Sjekk om hypotenusen er lengre enn kateten.");
                 }

                steps += `Vi vil finne a, så vi tar kvadratroten på begge sider:\n`;
                steps += `√(a²) = √(${formatNumber(a2)})     | √()\n`; // Balansemetode
                result = Math.sqrt(a2);
                steps += `a = ${formatNumber(result)}\n`;

            } else { // Finner katet b
                sideLabel = 'b';
                const a2 = a * a;
                const c2 = c * c;

                steps += `Setter inn kjente verdier:\n`;
                steps += `${formatNumber(a)}² + b² = ${formatNumber(c)}²\n`;
                steps += `${formatNumber(a2)} + b² = ${formatNumber(c2)}\n\n`;

                steps += `Vi vil ha b² alene, så vi trekker fra ${formatNumber(a2)} på begge sider:\n`;
                steps += `${formatNumber(a2)} - ${formatNumber(a2)} + b² = ${formatNumber(c2)} - ${formatNumber(a2)}     | - ${formatNumber(a2)}\n`; // Balansemetode
                const b2 = c2 - a2;
                steps += `b² = ${formatNumber(b2)}\n\n`;

                 if (b2 < 0) { // Burde ikke skje pga. validering over
                     throw new Error("Kan ikke ta kvadratroten av et negativt tall. Sjekk om hypotenusen er lengre enn kateten.");
                 }

                steps += `Vi vil finne b, så vi tar kvadratroten på begge sider:\n`;
                steps += `√(b²) = √(${formatNumber(b2)})     | √()\n`; // Balansemetode
                result = Math.sqrt(b2);
                steps += `b = ${formatNumber(result)}\n`;
            }

            stepsPre.textContent = steps;
            finalAnswerP.textContent = `Lengden på den ukjente siden (${sideLabel}) er: ${formatNumber(result)}`;

        } catch (error) {
            stepsPre.textContent = ''; // Tøm steg ved feil
            finalAnswerP.textContent = `Feil: ${error.message}`;
            finalAnswerP.style.color = 'red'; // Gjør feilmeldingen tydelig
        } finally {
            // Sett fargen tilbake hvis den var endret til rød
            setTimeout(() => {
                 if (finalAnswerP.style.color === 'red') {
                    finalAnswerP.style.color = ''; // Tilbakestill til CSS-standard
                 }
            }, 5000); // Fjern rødfarge etter 5 sekunder
        }
    });

    // Initialiser input-feltene korrekt ved sidelasting
    toggleInputs();
});

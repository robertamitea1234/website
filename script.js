document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    // Inlocuieste cu URL-ul tau de Web App din Google Apps Script (se termina in /exec)
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwKdzp3S3KWI6L4Y-ag6F0WhYoZILEt8fZPuU3Jm9AoMkoUuq2bqRpt0jEOfY_dxlfWJg/exec';

    const submitBtn = form.querySelector('button[type="submit"]');
    const btnTextOriginal = submitBtn ? submitBtn.textContent : '';

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nume = form.elements['nume'].value.trim();
        const telefon = form.elements['telefon'].value.trim();
        const email = form.elements['email'].value.trim();
        const mesaj = form.elements['mesaj'].value.trim();

        if (!nume || !telefon || !email || !mesaj) {
            afiseazaMesaj('Te rugăm să completezi toate câmpurile.', 'error');
            return;
        }

        if (SCRIPT_URL.indexOf('AKfycbxXXX') !== -1) {
            afiseazaMesaj('Formularul nu este încă legat de Google Sheet. Adaugă URL-ul din Apps Script în script.js (SCRIPT_URL).', 'error');
            return;
        }

        const cerere = { nume: nume, telefon: telefon, email: email, mesaj: mesaj };

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Se trimite...';
        }

        // mode: 'no-cors' este necesar pentru Google Apps Script Web App.
        // Raspunsul nu poate fi citit in acest mod, dar daca fetch-ul nu arunca eroare
        // de retea, cererea a ajuns la server.
        fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(cerere)
        })
        .then(function () {
            form.reset();
            afiseazaMesaj('✔ Cererea a fost trimisă cu succes! Te vom contacta în curând.', 'success');
        })
        .catch(function () {
            afiseazaMesaj('A apărut o eroare la trimitere. Te rugăm să încerci din nou sau să ne suni direct.', 'error');
        })
        .finally(function () {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = btnTextOriginal;
            }
        });
    });

    function afiseazaMesaj(text, tip) {
        let mesaj = document.querySelector('.form-feedback');
        if (!mesaj) {
            mesaj = document.createElement('p');
            mesaj.className = 'form-feedback';
            form.insertAdjacentElement('afterend', mesaj);
        }
        mesaj.textContent = text;
        mesaj.classList.remove('success', 'error');
        mesaj.classList.add(tip);
        mesaj.style.display = 'block';

        clearTimeout(mesaj._timeoutId);
        mesaj._timeoutId = setTimeout(function () {
            mesaj.style.display = 'none';
        }, 6000);
    }
});

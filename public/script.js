document.addEventListener('DOMContentLoaded', () => {
    const popups = document.querySelector('.popup');
    const popupOverlay = document.querySelector('.popup-overlay');
    const cancelButton = document.querySelector('.popup .cancel');
    const confirmButton = document.querySelector('.popup .confirm');
    let currentCardButton = null;
    let currentCard = null;

    document.querySelectorAll('.matricular').forEach(button => {
        button.addEventListener('click', async (event) => {
            currentCardButton = event.target;
            currentCard = currentCardButton.closest('.card');
            const cardId = currentCardButton.dataset.cardId;
            const response = await fetch(`/api/clicks/${currentCard.dataset.productId}`);
            const data = await response.json();

            if (data.clicks >= data.limit) {
                alert('Limite de cliques atingido para este produto.');
                return;
            }

            popupOverlay.style.display = 'block';
            popups.style.display = 'block';
        });
    });

    confirmButton.addEventListener('click', async () => {
        const url = currentCardButton.dataset.url;
        const response = await fetch('/api/clicks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId: currentCard.dataset.productId })
        });

        if (response.ok) {
            const data = await response.json();
            const clickCountElem = currentCard.querySelector('.click-count');
            clickCountElem.textContent = data.clicks;

            if (data.clicks >= data.limit) {
                currentCardButton.disabled = true;
            }

            window.open(url, '_blank');
        } else {
            alert('Limite de cliques atingido para este produto.');
        }

        popupOverlay.style.display = 'none';
        popups.style.display = 'none';
    });

    cancelButton.addEventListener('click', () => {
        popupOverlay.style.display = 'none';
        popups.style.display = 'none';
    });

    popupOverlay.addEventListener('click', () => {
        popupOverlay.style.display = 'none';
        popups.style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const termosLink = document.getElementById('termos-link');
    const popupOverlayTermos = document.querySelector('.popup-overlay-termos');
    const popupTermos = document.querySelector('.popup-termos');
    const fecharTermosBtn = document.querySelector('.fechar-termos');

    const politicaLink = document.getElementById('politica-link');
    const popupOverlayPolitica = document.querySelector('.popup-overlay-politica');
    const popupPolitica = document.querySelector('.popup-politica');
    const fecharPoliticaBtn = document.querySelector('.fechar-politica');

    termosLink.addEventListener('click', function(event) {
        event.preventDefault();
        popupOverlayTermos.style.display = 'block';
        popupTermos.style.display = 'block';
    });

    fecharTermosBtn.addEventListener('click', function() {
        popupOverlayTermos.style.display = 'none';
        popupTermos.style.display = 'none';
    });

    popupOverlayTermos.addEventListener('click', function() {
        popupOverlayTermos.style.display = 'none';
        popupTermos.style.display = 'none';
    });

    politicaLink.addEventListener('click', function(event) {
        event.preventDefault();
        popupOverlayPolitica.style.display = 'block';
        popupPolitica.style.display = 'block';
    });

    fecharPoliticaBtn.addEventListener('click', function() {
        popupOverlayPolitica.style.display = 'none';
        popupPolitica.style.display = 'none';
    });

    popupOverlayPolitica.addEventListener('click', function() {
        popupOverlayPolitica.style.display = 'none';
        popupPolitica.style.display = 'none';
    });
});

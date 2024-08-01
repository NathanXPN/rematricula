document.addEventListener('DOMContentLoaded', () => {
    const popups = document.querySelector('.popup');
    const popupOverlay = document.querySelector('.popup-overlay');
    const cancelButton = document.querySelector('.popup .cancel');
    const confirmButton = document.querySelector('.popup .confirm');
    let currentCardButton = null;
    let currentCard = null;

    // Novo pop-up para limite de cliques atingido
    const popupOverlayLimite = document.querySelector('.popup-overlay-limite');
    const popupLimite = document.querySelector('.popup-limite');
    const fecharLimiteBtn = document.querySelector('.popup-limite .fechar-limite');

    // Eventos para os pop-ups de termos e política
    const termosLink = document.getElementById('termos-link');
    const popupOverlayTermos = document.querySelector('.popup-overlay-termos');
    const popupTermos = document.querySelector('.popup-termos');
    const fecharTermosBtn = document.querySelector('.fechar-termos');

    const politicaLink = document.getElementById('politica-link');
    const popupOverlayPolitica = document.querySelector('.popup-overlay-politica');
    const popupPolitica = document.querySelector('.popup-politica');
    const fecharPoliticaBtn = document.querySelector('.fechar-politica');

    // Função para mostrar pop-ups
    function showPopup(popup, overlay) {
        overlay.style.display = 'block';
        popup.style.display = 'block';
    }

    // Função para esconder pop-ups
    function hidePopup(popup, overlay) {
        overlay.style.display = 'none';
        popup.style.display = 'none';
    }

    document.querySelectorAll('.matricular').forEach(button => {
        button.addEventListener('click', (event) => {
            currentCardButton = event.target;
            currentCard = currentCardButton.closest('.card');
            const cardId = currentCardButton.dataset.cardId;
            const cardLimit = currentCard.dataset.clickLimit;
            const clickCountElem = currentCard.querySelector('.click-count');
            const clickCount = parseInt(clickCountElem.textContent, 10);

            if (clickCount >= cardLimit) {
                // Mostrar o novo pop-up de limite atingido
                showPopup(popupLimite, popupOverlayLimite);
                return;
            }

            showPopup(popups, popupOverlay);
        });
    });

    confirmButton.addEventListener('click', async () => {
        const url = currentCardButton.dataset.url;
        const cardId = currentCardButton.dataset.cardId;

        try {
            const response = await fetch('/update-click-count', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cardId }),
            });

            const data = await response.json();
            const clickCountElem = currentCard.querySelector('.click-count');
            clickCountElem.textContent = data.clickCount;

            if (data.clickCount >= currentCard.dataset.clickLimit) {
                currentCardButton.disabled = true;
            }

            // Open URL in a new tab
            window.open(url, '_blank');

            hidePopup(popups, popupOverlay);
        } catch (error) {
            console.error('Error updating click count:', error);
        }
    });

    cancelButton.addEventListener('click', () => {
        hidePopup(popups, popupOverlay);
    });

    popupOverlay.addEventListener('click', () => {
        hidePopup(popups, popupOverlay);
    });

    // Eventos para o novo pop-up de limite atingido
    fecharLimiteBtn.addEventListener('click', () => {
        hidePopup(popupLimite, popupOverlayLimite);
    });

    popupOverlayLimite.addEventListener('click', () => {
        hidePopup(popupLimite, popupOverlayLimite);
    });

    // Código existente para os pop-ups de termos e política
    termosLink.addEventListener('click', (event) => {
        event.preventDefault();
        showPopup(popupTermos, popupOverlayTermos);
    });

    fecharTermosBtn.addEventListener('click', () => {
        hidePopup(popupTermos, popupOverlayTermos);
    });

    popupOverlayTermos.addEventListener('click', () => {
        hidePopup(popupTermos, popupOverlayTermos);
    });

    politicaLink.addEventListener('click', (event) => {
        event.preventDefault();
        showPopup(popupPolitica, popupOverlayPolitica);
    });

    fecharPoliticaBtn.addEventListener('click', () => {
        hidePopup(popupPolitica, popupOverlayPolitica);
    });

    popupOverlayPolitica.addEventListener('click', () => {
        hidePopup(popupPolitica, popupOverlayPolitica);
    });
});

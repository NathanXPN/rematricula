document.addEventListener('DOMContentLoaded', () => {
    const popups = document.querySelector('.popup');
    const popupOverlay = document.querySelector('.popup-overlay');
    const cancelButton = document.querySelector('.popup .cancel');
    const confirmButton = document.querySelector('.popup .confirm');
    let currentCardButton = null;
    let currentCard = null;

    const popupOverlayLimite = document.querySelector('.popup-overlay-limite');
    const popupLimite = document.querySelector('.popup-limite');
    const fecharLimiteBtn = document.querySelector('.popup-limite .fechar-limite');

    document.querySelectorAll('.matricular').forEach(button => {
        button.addEventListener('click', async (event) => {
            currentCardButton = event.target;
            currentCard = currentCardButton.closest('.card');
            const cardId = currentCardButton.dataset.cardId;
            const cardLimit = currentCard.dataset.clickLimit;
            const clickCountElem = currentCard.querySelector('.click-count');
            
            // Obter a contagem de cliques do Firebase
            let clickCount = await getClickCount(cardId);
            clickCountElem.textContent = clickCount;

            if (clickCount >= cardLimit) {
                popupOverlayLimite.style.display = 'block';
                popupLimite.style.display = 'block';
                return;
            }

            popupOverlay.style.display = 'block';
            popups.style.display = 'block';
        });
    });

    confirmButton.addEventListener('click', async () => {
        const url = currentCardButton.dataset.url;
        const clickCountElem = currentCard.querySelector('.click-count');
        let clickCount = parseInt(clickCountElem.textContent, 10);

        clickCount++;
        clickCountElem.textContent = clickCount;

        if (clickCount >= currentCard.dataset.clickLimit) {
            currentCardButton.disabled = true;
        }

        // Atualizar a contagem de cliques no Firebase
        await updateClickCount(currentCardButton.dataset.cardId, clickCount);

        window.open(url, '_blank');

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

    fecharLimiteBtn.addEventListener('click', () => {
        popupOverlayLimite.style.display = 'none';
        popupLimite.style.display = 'none';
    });

    popupOverlayLimite.addEventListener('click', () => {
        popupOverlayLimite.style.display = 'none';
        popupLimite.style.display = 'none';
    });

    // Funções para obter e atualizar a contagem de cliques no Firebase
    async function getClickCount(cardId) {
        const doc = await db.collection('clickCounts').doc(cardId).get();
        return doc.exists ? doc.data().count : 0;
    }

    async function updateClickCount(cardId, count) {
        await db.collection('clickCounts').doc(cardId).set({ count });
    }
});

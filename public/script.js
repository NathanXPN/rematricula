document.addEventListener('DOMContentLoaded', (event) => {
    fetch('/clicks')
        .then(response => response.json())
        .then(data => {
            document.querySelectorAll('.card').forEach(card => {
                const productId = card.getAttribute('data-product-id');
                const clickCountElem = card.querySelector('.click-count');
                const clickLimit = parseInt(card.getAttribute('data-click-limit'));

                if (data[productId]) {
                    clickCountElem.textContent = data[productId];
                    if (data[productId] >= clickLimit) {
                        card.querySelector('button.matricular').disabled = true;
                    }
                }
            });
        });
});

function handleClick(button, url) {
    const card = button.closest('.card');
    const productId = card.getAttribute('data-product-id');
    const clickCountElem = card.querySelector('.click-count');
    const clickLimit = parseInt(card.getAttribute('data-click-limit'));

    fetch('/click', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
    })
        .then(response => response.json())
        .then(data => {
            const clickCount = data.clickCount;
            clickCountElem.textContent = clickCount;

            if (clickCount >= clickLimit) {
                button.disabled = true;
            }

            window.location.href = url;
        });
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBCPbvcieyYAJJAzTeL94fYw9UM-XJQ3zw",
  authDomain: "rematricula-9570d.firebaseapp.com",
  projectId: "rematricula-9570d",
  storageBucket: "rematricula-9570d.appspot.com",
  messagingSenderId: "579758372497",
  appId: "1:579758372497:web:b8f85a388168eb77b93130",
  measurementId: "G-69D1Z3LPVN"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

  async function fetchClickCounts() {
    document.querySelectorAll('.card').forEach(async card => {
      const cardId = card.querySelector('.matricular').dataset.cardId;
      const clickCountElem = card.querySelector('.click-count');
      
      try {
        const cardRef = doc(db, 'matriculas', cardId);
        const cardSnap = await getDoc(cardRef);

        if (cardSnap.exists()) {
          const clickCount = cardSnap.data().count || 0;
          clickCountElem.textContent = clickCount;
        } else {
          // Se o documento não existir, crie-o com contagem inicial
          await setDoc(cardRef, { count: 0 });
          clickCountElem.textContent = 0;
        }
      } catch (error) {
        console.error("Erro ao acessar o Firestore: ", error);
      }
    });
  }

  fetchClickCounts();

  document.querySelectorAll('.matricular').forEach(button => {
    button.addEventListener('click', async (event) => {
      currentCardButton = event.target;
      currentCard = currentCardButton.closest('.card');
      const cardId = currentCardButton.dataset.cardId;
      const cardLimit = currentCard.dataset.clickLimit;

      try {
        // Obter a contagem de cliques atual do Firestore
        const cardRef = doc(db, 'matriculas', cardId);
        const cardSnap = await getDoc(cardRef);

        let clickCount = 0;
        if (cardSnap.exists()) {
          clickCount = cardSnap.data().count;
          currentCard.querySelector('.click-count').textContent = clickCount;
        } else {
          // Se o documento não existir, crie-o com contagem inicial
          await setDoc(cardRef, { count: 0 });
        }

        if (clickCount >= cardLimit) {
          popupOverlayLimite.style.display = 'block';
          popupLimite.style.display = 'block';
          return;
        }

        popupOverlay.style.display = 'block';
        popups.style.display = 'block';
      } catch (error) {
        console.error("Erro ao acessar o Firestore: ", error);
      }
    });
  });

  confirmButton.addEventListener('click', async () => {
    const url = currentCardButton.dataset.url;
    const cardId = currentCardButton.dataset.cardId;
    const clickCountElem = currentCard.querySelector('.click-count');
    let clickCount = parseInt(clickCountElem.textContent, 10);

    try {
      // Atualizar a contagem de cliques no Firestore
      const cardRef = doc(db, 'matriculas', cardId);
      await updateDoc(cardRef, {
        count: increment(1)
      });

      clickCount++;
      clickCountElem.textContent = clickCount;

      if (clickCount >= parseInt(currentCard.dataset.clickLimit, 10)) {
        currentCardButton.disabled = true;
      }

      window.open(url, '_blank');
    } catch (error) {
      console.error("Erro ao atualizar o Firestore: ", error);
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

  fecharLimiteBtn.addEventListener('click', () => {
    popupOverlayLimite.style.display = 'none';
    popupLimite.style.display = 'none';
  });

  popupOverlayLimite.addEventListener('click', () => {
    popupOverlayLimite.style.display = 'none';
    popupLimite.style.display = 'none';
  });

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

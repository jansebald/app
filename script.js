let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || ['Mathe', 'Deutsch', 'Englisch'];
let currentIndex = 0;
let showAnswer = false;
let correctCount = 0;
let incorrectCount = 0;
let incorrectCards = [];

function saveFlashcards() {
  localStorage.setItem('flashcards', JSON.stringify(flashcards));
}

function saveCategories() {
  localStorage.setItem('categories', JSON.stringify(categories));
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.getElementById(pageId).classList.add('active');

  if (pageId === 'flashcard-page') {
    resetFlashcardDisplay();
    filterFlashcards();
  }
}

function resetFlashcardDisplay() {
  showAnswer = false;
  document.getElementById('answer').style.display = 'none';
  document.getElementById('toggle-answer').innerText = 'Antwort anzeigen';
  document.getElementById('correct-answer').style.display = 'none';
  document.getElementById('incorrect-answer').style.display = 'none';
}

function addCategory() {
  const newCategory = document.getElementById('new-category-name').value;
  if (newCategory && !categories.includes(newCategory)) {
    categories.push(newCategory);
    saveCategories();
    loadCategories();
    document.getElementById('new-category-name').value = '';
    showPage('settings-page');
  }
}

function removeCategory() {
  const categoryToRemove = document.getElementById('remove-category').value;
  categories = categories.filter(category => category !== categoryToRemove);
  saveCategories();
  loadCategories();
  showPage('settings-page');
}

function loadCategories() {
  const categorySelect = document.getElementById('category');
  const newCategorySelect = document.getElementById('new-category');
  const removeCategorySelect = document.getElementById('remove-category');
  categorySelect.innerHTML = '';
  newCategorySelect.innerHTML = '';
  removeCategorySelect.innerHTML = '';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
    newCategorySelect.appendChild(option.cloneNode(true));
    removeCategorySelect.appendChild(option.cloneNode(true));
  });
}

function addFlashcard() {
  const question = document.getElementById('new-question').value;
  const answer = document.getElementById('new-answer').value;
  const category = document.getElementById('new-category').value;

  if (question && answer && category) {
    flashcards.push({ question, answer, category });
    saveFlashcards();
    document.getElementById('new-question').value = '';
    document.getElementById('new-answer').value = '';
    loadFlashcards(); // Aktualisiere die Liste der Karteikarten zum Löschen
    showPage('settings-page');
  }
}

function removeFlashcard() {
  const flashcardToRemove = document.getElementById('remove-flashcard').value;
  flashcards = flashcards.filter(card => card.question !== flashcardToRemove);
  saveFlashcards();
  loadFlashcards();
  showPage('settings-page');
}

function loadFlashcards() {
  const removeFlashcardSelect = document.getElementById('remove-flashcard');
  removeFlashcardSelect.innerHTML = '';
  flashcards.forEach(card => {
    const option = document.createElement('option');
    option.value = card.question;
    option.textContent = `${card.category}: ${card.question}`;
    removeFlashcardSelect.appendChild(option);
  });
}

function filterFlashcards() {
  const selectedCategory = document.getElementById('category').value;
  const filteredFlashcards = flashcards.filter(card => card.category === selectedCategory);
  currentIndex = 0;
  updateFlashcardDisplay(filteredFlashcards);
}

function updateFlashcardDisplay(filteredFlashcards = flashcards) {
  if (filteredFlashcards.length > 0) {
    document.getElementById('question').innerText = filteredFlashcards[currentIndex].question;
    document.getElementById('answer').style.display = 'none';
    document.getElementById('toggle-answer').innerText = 'Antwort anzeigen';
    document.getElementById('correct-answer').style.display = 'none';
    document.getElementById('incorrect-answer').style.display = 'none';
  } else {
    document.getElementById('question').innerText = 'Keine Karteikarten vorhanden';
    document.getElementById('answer').style.display = 'none';
    document.getElementById('toggle-answer').innerText = 'Antwort anzeigen';
  }
}

document.getElementById('toggle-answer').addEventListener('click', () => {
  if (flashcards.length > 0) {
    showAnswer = !showAnswer;
    document.getElementById('answer').style.display = showAnswer ? 'block' : 'none';
    if (showAnswer) {
      document.getElementById('answer').innerText = flashcards[currentIndex].answer;
      document.getElementById('correct-answer').style.display = 'inline-block';
      document.getElementById('incorrect-answer').style.display = 'inline-block';
    } else {
      document.getElementById('correct-answer').style.display = 'none';
      document.getElementById('incorrect-answer').style.display = 'none';
    }
    document.getElementById('toggle-answer').innerText = showAnswer ? 'Frage anzeigen' : 'Antwort anzeigen';
  }
});

document.getElementById('correct-answer').addEventListener('click', () => {
  correctCount++;
  document.getElementById('flashcard-container').classList.add('correct');
  setTimeout(() => {
    document.getElementById('flashcard-container').classList.remove('correct');
    nextCard();
  }, 1000);
});

document.getElementById('incorrect-answer').addEventListener('click', () => {
  incorrectCount++;
  incorrectCards.push(flashcards[currentIndex]);
  document.getElementById('flashcard-container').classList.add('incorrect');
  setTimeout(() => {
    document.getElementById('flashcard-container').classList.remove('incorrect');
    nextCard();
  }, 1000);
});

function nextCard() {
  const selectedCategory = document.getElementById('category').value;
  const filteredFlashcards = flashcards.filter(card => card.category === selectedCategory);
  currentIndex = (currentIndex + 1) % filteredFlashcards.length;
  if (currentIndex === 0) {
    showResult();
  } else {
    resetFlashcardDisplay();
    updateFlashcardDisplay(filteredFlashcards);
  }
}

function showResult() {
  const resultText = `Du hast ${correctCount} richtig und ${incorrectCount} falsch beantwortet.`;
  document.getElementById('result').innerText = resultText;
  showPage('result-page');
}

function showIncorrectCards() {
  const incorrectCardsList = document.getElementById('incorrect-cards-list');
  incorrectCardsList.innerHTML = '';
  incorrectCards.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.innerText = `${card.category}: ${card.question} - ${card.answer}`;
    incorrectCardsList.appendChild(cardElement);
  });
  showPage('incorrect-cards-page');
}

document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadFlashcards();
  updateFlashcardDisplay();
  showPage('start-page');
});

document.getElementById('result-page').addEventListener('click', () => {
  correctCount = 0;
  incorrectCount = 0;
  incorrectCards = [];
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

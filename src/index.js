import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

const breedSelect = document.querySelector('.breed-select');

const getCatInfo = () => {
  const selectedBreed = breedSelect.value;
  try {
    fetchCatByBreed(selectedBreed);
  } catch (error) {
    console.error('Wystąpił błąd podczas pobierania danych o kocie:', error);
  }
};

fetchBreeds();
breedSelect.addEventListener('change', getCatInfo);

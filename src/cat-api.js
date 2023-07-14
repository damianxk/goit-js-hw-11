import axios from 'axios';

const loader = document.querySelector('.loader');
const catName = document.querySelector('.cat-name');
const catDesc = document.querySelector('.cat-description');
const catTemp = document.querySelector('.cat-temperament');
const background = document.querySelector('.bg');
const catImg = document.querySelector('.catImg');

const addClass = (element, className) => {
  if (!element.classList.contains(className)) {
    element.classList.add(className);
  }
};
const removeClass = (element, className) => {
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  }
};

const catError = document.querySelector('.error');
catError.style.display = 'none';

const API_KEY =
  'live_mURnyqhRCx7SaWulnvS12JyxdalLUxrkAL81xFxIaJa9o5OGCUvYcH0Bqh8fBrFU';
const BREEDS_URL = 'https://api.thecatapi.com/v1/breeds';

let breed;
const everyBreed = [];

const breedSelect = document.querySelector('.breed-select');

export const fetchBreeds = () => {
  removeClass(loader, 'hidden');

  axios
    .get(BREEDS_URL, {
      headers: {
        'x-api-key': API_KEY,
      },
    })
    .then(res => {
      if (res.status !== 200) {
        throw new Error('Nie udało się pobrać ras');
      }
      return res.data;
    })
    .then(res => {
      res.forEach(breed => {
        const option = document.createElement('option');
        option.text = breed.name;
        option.value = breed.id;
        breedSelect.appendChild(option);
      });
      everyBreed.push(...res);
      fetchCatByBreed(res[0].id);
    })
    .catch(err => {
      catError.style.display = 'block';
      throw new Error(err);
    })
    .finally(() => {
      addClass(loader, 'hidden');
    });
};

export const fetchCatByBreed = breedId => {
  removeClass(loader, 'hidden');
  background.style.filter = 'blur(10px)';

  const url = `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`;

  axios
    .get(url, {
      headers: {
        'x-api-key': API_KEY,
      },
    })
    .then(res => {
      if (res.status !== 200) {
        throw new Error('Nie udało się pobrać informacji');
      }
      breed = res.data[0];
      catImg.setAttribute('src', breed.url);
      catError.style.display = 'none';
      return res.data[0];
    })
    .then(() => {
      const selected = everyBreed.find(breed => breed.id === breedId);
      catName.textContent = selected.name;
      catDesc.textContent = selected.description;
      catTemp.textContent = `Temperament: ${selected.temperament}`;
    })
    .catch(err => {
      catError.style.display = 'block';
      catImg.setAttribute('src', '');
      catImg.setAttribute('alt', '');
      catName.textContent = '';
      catDesc.textContent = '';
      catTemp.textContent = ``;
      throw new Error(err);
    })
    .finally(() => {
      addClass(loader, 'hidden');
      background.style.filter = 'blur(0px)';
    });
};

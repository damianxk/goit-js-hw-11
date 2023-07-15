import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import axios from 'axios';

const API_KEY = '38252665-7f08167a7ac72c66bae4a569f';
const API_URL = 'https://pixabay.com/api/';
const RESULTS_PER_PAGE = 40;

const searchForm = document.getElementById('search-form');
const loadMoreBtn = document.querySelector('.load-more');
const container = document.querySelector('.gallery-container');

let currentPage = 1;
let currentQuery = '';

const lightbox = new SimpleLightbox('.gallery a');

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  const searchQuery = e.target.searchQuery.value;
  if (searchQuery !== '') {
    currentQuery = searchQuery;
    currentPage = 1;
    container.innerHTML = '';
    await searchImages(currentQuery, currentPage);
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage++;
  await searchImages(currentQuery, currentPage);
  scrollToNextPage();
});

async function searchImages(query, page) {
  const url = `${API_URL}?key=${API_KEY}&q=${encodeURIComponent(
    query
  )}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${RESULTS_PER_PAGE}`;

  try {
    const response = await axios.get(url);
    const data = await response;
    const images = data.data.hits;
    const totalHits = data.data.totalHits;

    if (images.length > 0) {
      images.forEach(image => {
        const card = createPhotoCard(image);
        container.appendChild(card);
      });

      lightbox.refresh();

      if (totalHits > currentPage * RESULTS_PER_PAGE) {
        loadMoreBtn.style.display = 'block';
      } else {
        loadMoreBtn.style.display = 'none';
      }

      if (currentPage === 1) {
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      }
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.style.display = 'none';
    }
  } catch (error) {
    console.log('Error:', error);
    Notiflix.Notify.failure(
      'An error occurred while fetching the images. Please try again later.'
    );
    loadMoreBtn.style.display = 'none';
  }
}

function createPhotoCard(image) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = image;

  const card = document.createElement('div');
  card.classList.add('photo-card');

  const link = document.createElement('a');
  link.href = largeImageURL;

  const img = document.createElement('img');
  img.src = webformatURL;
  img.alt = tags;
  img.loading = 'lazy';

  const info = document.createElement('div');
  info.classList.add('info');

  const likesInfo = createInfoItem('Likes', likes);
  const viewsInfo = createInfoItem('Views', views);
  const commentsInfo = createInfoItem('Comments', comments);
  const downloadsInfo = createInfoItem('Downloads', downloads);

  info.appendChild(likesInfo);
  info.appendChild(viewsInfo);
  info.appendChild(commentsInfo);
  info.appendChild(downloadsInfo);

  link.appendChild(img);
  card.appendChild(link);
  card.appendChild(info);

  return card;
}

function createInfoItem(label, value) {
  const item = document.createElement('p');
  item.classList.add('info-item');
  const boldLabel = document.createElement('b');
  boldLabel.textContent = label;
  item.appendChild(boldLabel);
  item.innerHTML += `: ${value}`;
  return item;
}

function scrollToNextPage() {
  const { height: cardHeight } = document
    .querySelector('.gallery-container')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2.5,
    behavior: 'smooth',
  });
}

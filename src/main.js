import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import 'loaders.css/loaders.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getImagesByQuery } from './js/pixabay-api';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;

const formEl = document.querySelector('.form');

if (formEl) {
  formEl.addEventListener('submit', onSearch);
} else {
  console.warn('Form element not found: .form');
}

async function onSearch(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const input = form.elements['search-text'];
  const query = input.value.trim();

  if (query === '') {
    iziToast.error({ message: 'Please enter a search query!' });
    return;
  }

  currentQuery = query;
  currentPage = 1;

  form.reset();
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    totalHits = data.totalHits || 0;
    const hits = data.hits || [];
    if (hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      });
      return;
    }
    createGallery(hits);

    const totalPages = Math.ceil(totalHits / 15);
    if (currentPage < totalPages) {
      showLoadMoreButton();
    }
  } catch (error) {
    console.error(error);
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
    });
  } finally {
    hideLoader();
  }
}

const loadMoreBtn = document.querySelector('.load-more');

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', onLoadMore);
} else {
  console.warn('Load more button not found: .load-more');
}

async function onLoadMore() {
  currentPage += 1;
  showLoader();
  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    const hits = data.hits || [];

    createGallery(hits);

    if (currentPage * 15 >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
    smoothScroll();
  } catch (error) {
    console.error(error);
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
    });
  } finally {
    hideLoader();
  }
}

// scroll
function smoothScroll() {
  const firstCard = document.querySelector('.gallery-item');
  if (!firstCard) return;

  const height = firstCard.getBoundingClientRect().height;

  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}

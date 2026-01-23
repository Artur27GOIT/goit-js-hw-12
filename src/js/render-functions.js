import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightboxInstance = null;
const galleryEl = document.querySelector('.gallery');
const loaderEl = document.querySelector('.loader');
const showBtn = document.querySelector('.load-more');

if (loaderEl) {
  loaderEl.classList.add('is-hidden');
} else {
  console.warn('Loader element not found: .loader');
}

function initLightboxIfNeeded() {
  if (!lightboxInstance) {
    lightboxInstance = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  }
}

export function createGallery(images) {
  if (!galleryEl) return;

  const markup = images
    .map(image => {
      const title = (image.tags || 'Image').split(',')[0].trim();
      const views = formatNumberShort(image.views);
      const creator = image.user || 'CREATOR';
      return `
      <li class="gallery-item" role="listitem">
        <a class="gallery-link" href="${image.largeImageURL}">
          <img class="gallery-image" src="${image.webformatURL}" alt="${escapeHtml(image.tags)}" loading="lazy" />
        </a>
        <div class="info">
          <h3 class="info-title">${escapeHtml(title)}</h3>
          <div class="info-meta">
            <span class="info-views">${views} views</span>
            <span class="info-creator">${escapeHtml(creator)}</span>
          </div>
          <div class="info-stats">
            <span><b>Likes:</b> ${image.likes}</span>
            <span><b>Comments:</b> ${image.comments}</span>
            <span><b>Downloads:</b> ${image.downloads}</span>
          </div>
        </div>
      </li>`;
    })
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);

  initLightboxIfNeeded();
  if (lightboxInstance && typeof lightboxInstance.refresh === 'function') {
    lightboxInstance.refresh();
  }
}

export function clearGallery() {
  if (!galleryEl) return;
  galleryEl.innerHTML = '';
  if (lightboxInstance && typeof lightboxInstance.refresh === 'function') {
    lightboxInstance.refresh();
  }
}

export function showLoader() {
  if (!loaderEl) return;
  loaderEl.classList.remove('is-hidden');
}

export function hideLoader() {
  if (!loaderEl) return;
  loaderEl.classList.add('is-hidden');
}

function formatNumberShort(num = 0) {
  if (num >= 1_000_000)
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return String(num);
}
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Нові функції
export function showLoadMoreButton() {
  if (!showBtn) return;
  showBtn.classList.remove('is-hidden');
}
export function hideLoadMoreButton() {
  if (!showBtn) return;
  showBtn.classList.add('is-hidden');
}

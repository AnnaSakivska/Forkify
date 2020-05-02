export const elements = {
    searchInput: document.querySelector('.search__field'),
    searchForm: document.querySelector('.search'),
    searchRec: document.querySelector('.results'),
    resultRecList: document.querySelector('.results__list'),
    buttonsContainer: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list'),
    clearButton: document.querySelector('.shopping__clear-container')
};

export const elementStrings = {
  loader: 'loader'
};

export const renderLoader = (parent) => {
    const loader = `
    <div class="${elementStrings.loader}">
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
    </div>
    `;

    parent.insertAdjacentHTML('afterbegin', loader)
};

export const removeLoader = () => {

  const loader = document.querySelector(`.${elementStrings.loader}`);
  if(loader) return loader.remove();
};
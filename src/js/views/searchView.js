import {elements} from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearRecResults = () => {
    elements.resultRecList.innerHTML = '';
    elements.buttonsContainer.innerHTML = '';
};

export const highlightSelector = id => {
    [...document.querySelectorAll('.results__link')].forEach(el => el.classList.remove('results__link--active'));
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};

export const limitRecipeTitle = (title, limit = 17) => {
    const arrayFromTitleWords = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                arrayFromTitleWords.push(cur);
            }
            return acc + cur.length
        }, 0);
        return `${arrayFromTitleWords.join(' ')} ...`
    }
    return title
};

const renderRecipe = recipe => {
    const markup = `
          <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="Test">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
          </li>
  `;
    elements.resultRecList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type) => `
                <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page - 1 : page + 1}">
                    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'next' ? 'right' : 'left'}"></use>
                    </svg>
                </button>
    `;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 && pages > 1) {
        button = createButton(page, 'next');
    } else if (page < pages) {
        button = `
         ${createButton(page, 'prev')}
         ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        button = createButton(page, 'prev');
    }

    elements.buttonsContainer.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, recPerPage = 10) => {
    const start = (page - 1) * recPerPage;
    const end = page * recPerPage;
    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(page, recipes.length, recPerPage);
};
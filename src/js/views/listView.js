import {elements} from './base';

export const renderItem = item => {
    const markup = `
           <li class="shopping__item" data-itemid="${item.id}">
               <div class="shopping__count">
                   <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value" min="0">
                   <p>${item.unit}</p>
               </div>
               <p class="shopping__description">${item.ingredient}</p>
               <button class="shopping__delete btn-tiny">
                   <svg>
                       <use href="img/icons.svg#icon-circle-with-cross"></use>
                   </svg>
               </button>
           </li>
  `;
    elements.shopping.insertAdjacentHTML('afterbegin', markup);
};

export const renderClearButton = () => {
    const markup = `
            <button class="btn-small recipe__btn shopping__clear-button">
                <span>Clear</span>
            </button>
    `;

    elements.clearButton.insertAdjacentHTML('afterbegin', markup);
}

export const deleteItem = id => {
    // const item =
    document.querySelector(`[data-itemid="${id}"]`).remove();
    // item.remove();
};

export const deleteAllListItems = () => {
    elements.shopping.innerHTML = '';
    elements.clearButton.innerHTML = '';
}

export const deleteClearBtn = () => {
    elements.clearButton.innerHTML = '';
}
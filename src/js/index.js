import Search from "./models/Search";
import List from "./models/List";
import Likes from "./models/Likes";

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

import {elements, renderLoader, removeLoader} from "./views/base";
import Recipe from './models/Recipe';


//the global state of the app
//Search object
//Current recipe object
//Shopping list object
//Liked recipes

const state = {};

/**
 *SEARCH CONTROLLER
 */

const controlSearch = async () => {
    // 1) Get the query from the view
    const query = searchView.getInput();

    if (query) {
        // 2) New search object and add it to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearRecResults();
        renderLoader(elements.searchRec);
        try {
            //4) Search for recipes
            await state.search.getResult();

            // 5) Render results on UI
            removeLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert('Something went wrong with search...');
            removeLoader();
        }

    }

};

elements.searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    controlSearch();
});

elements.buttonsContainer.addEventListener('click', ev => {
    const button = ev.target.closest('.btn-inline');
    // searchView.clearRecResults();

    if (button) {
        searchView.clearRecResults();
        const goToPage = parseInt(button.dataset.goto, 10);
        searchView.renderResults(state.search.result, goToPage);

    }
});


/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    //Get ID from url
    const id = window.location.hash.replace('#', '');

    if (id) {
        //Prepare UI for changes
        recipeView.removeRecipe();

        renderLoader(elements.recipe);

        //Highlight selected search item
        if (state.search) {
            searchView.highlightSelector(id);
        }

        //Create new recipe object
        state.recipe = new Recipe(id);

        try {
            //Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //Calculate servings and time
            state.recipe.calcCookingTime();
            state.recipe.calcServings();

            //Render recipe
            removeLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id));
        } catch (error) {
            alert('Error processing recipe!')
        }

    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * LIST CONTROLLER
 */

const controlList = () => {
    listView.deleteClearBtn();
    if (!state.list || state.list.items !== []) listView.renderClearButton();

//    Create a new list IF there is none yet
    if (!state.list) state.list = new List();
    // if (state.list.items.length > 0) listView.renderClearButton();

//    Add each ingredients to the list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })

};

//Handle delete and update list item events
elements.shopping.addEventListener('click', evt => {
    const id = evt.target.closest('.shopping__item').dataset.itemid;

//    Handle delete button
    if (evt.target.matches('.shopping__delete, .shopping__delete *')) {
        //  Delete from the state
        state.list.deleteItem(id);
        console.log(state.list)

        //  Delete form the UI
        listView.deleteItem(id);
    } else if (evt.target.matches('.shopping__count-value')) {
        const value = parseFloat(evt.target.value, 10);
        if (value > 0) {
            state.list.updateCount(id, value);
        }
    }
});

elements.clearButton.addEventListener('click', evt => {
    if (evt.target.matches('.shopping__clear-button, .shopping__clear-button *')) {
    //  Delete All items from the state
        state.list.deleteAllItems();
    //  Delete All items from the UI
        listView.deleteAllListItems();
    }
})

/**
 * LIKE CONTROLLER
 */

const controlLike = () => {
//
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    if (!state.likes.isLiked(currentID)) {
        //    Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )
        //    Toggle the like button
        likesView.toggleLikeButton(true);
        //    Add like to the UI list
        likesView.renderLike(newLike);
    } else {
        //    Remove like to the state
        state.likes.deleteLike(currentID);

        //    Toggle the like button
        likesView.toggleLikeButton(false);

        //    Remove like to the UI list
        likesView.deleteLike(currentID);

    }
    likesView.toggleLikesMenu(state.likes.getNumLikes());
}

//  Restore liked recipes when the page loads
window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.readStorage();
    likesView.toggleLikesMenu(state.likes.getNumLikes());
//    Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
})


//Handling recipe button clicks
elements.recipe.addEventListener('click', event => {
    if (event.target.matches('.btn-decrease, .btn-decrease *')) {
        //    Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (event.target.matches('.btn-increase, .btn-increase *')) {
        //    Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (event.target.matches('.recipe__btn-add, .recipe__btn-add *')) {
        //    Add ingredients to the shopping list
        controlList();
    } else if (event.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
});


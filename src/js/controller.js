// import icons from '../img/icons.svg'; //Parcel 1

import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookMarksView from './views/bookMarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import { MODAL_CLOSE_SEC } from './config.js';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipies = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return; //A TYPE OF GUARD CLASS FOR IF THERE ARE NO ID's PRESENT
    recipeView.renderSpinner();

    // update results view to mark selected search result
    resultView.update(model.getSearchResultPage());

    // Updating bookmarks view
    bookMarksView.update(model.state.bookmarks);

    //Loading recipe
    await model.loadRecipe(id);

    //Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};
controlRecipies();

const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();

    //Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //Load search results
    await model.loadSearchResults(query);

    //Render results
    resultView.render(model.getSearchResultPage());

    //Render initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagenation = function (goToPage) {
  //Render new results
  resultView.render(model.getSearchResultPage(goToPage));

  //Render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookMarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookMarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookMarksView.render(model.state.bookmarks);

    // change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    addRecipeView.renderError(err.message);
  }

  // Upload new recipe data
  model.uploadRecipe(newRecipe);
};

const init = function () {
  bookMarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipies);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagenation);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

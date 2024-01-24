// get the html elements:
const buttonHome = document.getElementById("btn-home");
const buttonPrev = document.getElementById("btn-prev");
const buttonNext = document.getElementById("btn-next");
const errorMsgEl = document.getElementById("error-msg");
const mainContainer = document.getElementById("main-container");
const searchInputEl = document.getElementById("search-input");
const searchButton = document.getElementById("pokeball");
const filterMega = document.getElementById("filter-mega");
const filterGmax = document.getElementById("filter-gmax");

const pokedexUrl = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20";

let pokemonList = [];
// pokemonList.next:
// "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20"

// nav events:
buttonHome.addEventListener("click", () => {
  displayPokemonList();
});

buttonNext.addEventListener("click", () => {
  if (pokemonList.next) displayPokemonList(pokemonList.next);
  else displayPokemonList();
});

buttonPrev.addEventListener("click", () => {
  if (pokemonList.previous) displayPokemonList(pokemonList.previous);
  else
    displayPokemonList(
      `https://pokeapi.co/api/v2/pokemon?offset=${pokemonList.lastPage}&limit=20`
    );
});

const displayError = (errorMessage) => {
  if (errorMessage) console.warn(errorMessage);

  errorMsgEl.textContent = errorMessage;
};

async function getData(url = pokedexUrl) {
  const response = await fetch(url);
  if (response.ok !== true) {
    //if (response.status !== 200) {
    displayError(`noe gikk galt. Status: ${response.status}`);
    return;
  }
  // clear the error message:
  displayError();

  const data = await response.json(); // response.text()

  return data;
}

/**
 * Updates pokemonList
 * @param {String} url - the url we want to get data from
 */
const updatePokemonList = async (url) => (pokemonList = await getData(url));

/**
 * Updates the pokemonList.lastPage to given perPage-param
 * @param {Number} perPage - number of pokemons per page (default 20)
 * @returns
 */
const setLastPage = (perPage = 20) =>
  (pokemonList.lastPage = Math.floor(pokemonList.count / perPage) * perPage);

// displays list of pokemons based on given url
async function displayPokemonList(url) {
  await updatePokemonList(url);
  setLastPage();
  mainContainer.innerHTML = "";

  //pokemonList.results.forEach(async pokemon => { // array methods dont fully support async-await, hence we use a normal for-of loop instead:
  for (const pokemon of pokemonList.results) {
    const pokemonExtraData = await getData(pokemon.url);

    console.log(pokemonExtraData);
    const containerEl = document.createElement("div");
    containerEl.classList.add("pokemon-container");

    const titleEl = document.createElement("h2");
    titleEl.classList.add("title");
    titleEl.textContent = `${pokemonExtraData.id}. ${pokemon.name}`;

    const imageEl = document.createElement("img");
    imageEl.classList.add("pokemon-regular");
    imageEl.alt = `image of ${pokemon.name}`;
    imageEl.style = "max-width: 40%;";
    imageEl.src =
      pokemonExtraData.sprites.other["official-artwork"].front_default;

    containerEl.append(titleEl, imageEl);
    mainContainer.append(containerEl);

    containerEl.addEventListener("click", () =>
      displayPokemonDetails(pokemonExtraData)
    );
  }
}

async function displayPokemonDetails(pokemonData) {
  mainContainer.innerHTML = "";
  const { id, name, sprites, base_experience, height, weight, types, stats } =
    pokemonData;

  const containerEl = document.createElement("div");
  containerEl.classList.add("pokemon-container");
  const titleEl = document.createElement("h2");
  titleEl.classList.add("title");
  titleEl.textContent = `${id}. ${name}`;
  const imageContainer = document.createElement("div");
  imageContainer.classList.add("image-container");

  const imageEl = document.createElement("img");
  imageEl.classList.add("pokemon-regular");
  imageEl.alt = `image of ${name}`;
  imageEl.style = "max-width: 40%;";
  imageEl.src = sprites.other["official-artwork"].front_default;

  const shinySprite = document.createElement("img");
  shinySprite.classList.add("pokemon-shiny");
  shinySprite.alt = `Image of shiny ${name}`;
  shinySprite.style = "max-width: 40%;";
  shinySprite.src = sprites.other["official-artwork"].front_shiny;

  imageContainer.append(imageEl, shinySprite);

  const xpEl = document.createElement("p");
  xpEl.textContent = `XP: ${base_experience}`;

  const heightEl = document.createElement("p");
  heightEl.textContent = `Height: ${height / 10} M`;

  const weightEl = document.createElement("p");
  weightEl.textContent = `Weight: ${weight / 10} Kg`;

  const typesContainer = document.createElement("div");
  typesContainer.classList.add("type-container");
  const typesHeaderEl = document.createElement("h3");
  typesHeaderEl.textContent = "Types:";
  typesContainer.append(typesHeaderEl);

  types.forEach((type) => {
    const typeEl = document.createElement("p");
    typeEl.textContent = type.type.name;
    typesContainer.append(typeEl);
  });

  const statsContainer = document.createElement("div");
  statsContainer.classList.add("stat-container");
  const statsHeaderEl = document.createElement("h3");
  statsHeaderEl.textContent = "Stats:";
  statsContainer.append(statsHeaderEl);

  stats.forEach((value) => {
    const { stat, base_stat, effort } = value;
    const statEl = document.createElement("p");
    statEl.textContent = `${stat.name}: ${base_stat} (effort:${effort})`;
    statsContainer.append(statEl);
  });

  containerEl.append(
    titleEl,
    imageContainer,
    xpEl,
    heightEl,
    weightEl,
    typesContainer,
    statsContainer
  );
  mainContainer.append(containerEl);
}

displayPokemonList();

/////////////////////////////////////////////////
//displ;ays list of pokemon based on given array of pokemons
async function displayFilteredPokemonList(pokemonArray) {
  mainContainer.innerHTML = "";

  //pokemonList.results.forEach(async pokemon => { // array methods dont fully support async-await, hence we use a normal for-of loop instead:
  for (const pokemon of pokemonArray) {
    const pokemonExtraData = await getData(pokemon.url);

    const containerEl = document.createElement("div");
    containerEl.classList.add("pokemon-container");
    const titleEl = document.createElement("h2");
    titleEl.classList.add("title");
    titleEl.textContent = `${pokemonExtraData.id}.${pokemon.name}`;
    const imageEl = document.createElement("img");
    imageEl.classList.add("pokemon-regular");
    imageEl.alt = `image of ${pokemon.name}`;
    imageEl.style = "max-width: 40%;";
    imageEl.src =
      pokemonExtraData.sprites.other["official-artwork"].front_default;

    containerEl.append(titleEl, imageEl);
    mainContainer.append(containerEl);

    containerEl.addEventListener("click", () =>
      displayPokemonDetails(pokemonExtraData)
    );
  }
}

searchButton.addEventListener("click", async () => {
  const searchText = searchInputEl.value.toLowerCase();
  //check if input is valid
  if (searchText.length < 3) {
    displayError("Please enter 3 or more characters");
    return;
  }
  //clear error message:
  displayError();
  //V 1. get the list of all pokemons in the api-database (this can be done by setting the limit to -1 or a number equal or larger to the total amount of pokemons in the database)
  const pokemonResult = await getData(
    "https://pokeapi.co/api/v2/pokemon?offset=0&limit=-1"
  );
  const pokemonArray = pokemonResult.results;

  // 2. filter the results based on the search-query
  const filteredPokemons = pokemonArray.filter((pokemon) => {
    if (pokemon.name.includes(searchText)) {
      if (filterMega.checked) {
        return pokemon.name.includes("-mega");
      }
      if (filterGmax.checked) {
        return pokemon.name.includes("-gmax");
      }
      return true;
    }
    return false;
  });

  if (!filteredPokemons.length > 0) {
    displayError("No pokémons found");
    return;
  }
  displayFilteredPokemonList(filteredPokemons);
});
searchInputEl.addEventListener("keypress", function (evt) {
  if (evt.key === "Enter") {
    document.getElementById("search-button").click();
  }
});

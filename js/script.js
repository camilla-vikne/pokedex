import {
  buttonHome,
  buttonPrev,
  buttonNext,
  mainContainer,
  searchInputEl,
  searchButton,
  filterMega,
  filterGmax,
} from "./const.js";
import { getData, getDetails } from "./data.js";
import { displayError } from "./error.js";

let pokemonList = [];
let speciesInfo = [];

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

/**
 * Updates pokemonList
 * @param {String} url - the url we want to get data from
 */
const updatePokemonList = async (url) => (pokemonList = await getData(url));
const pokemonSpecies = async (url) => (speciesInfo = await getDetails(url));

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
  await pokemonSpecies(url);
  setLastPage();
  mainContainer.innerHTML = "";

  //pokemonList.results.forEach(async pokemon => { // array methods dont fully support async-await, hence we use a normal for-of loop instead:
  for (const pokemon of pokemonList.results) {
    const pokemonExtraData = await getData(pokemon.url);
    const pokemonSpeciesInfo = await getDetails(
      pokemon.url.replace("pokemon", "pokemon-species")
    );

    const containerEl = document.createElement("div");
    containerEl.classList.add("pokemon-container");

    const titleEl = document.createElement("h2");
    titleEl.classList.add("title");
    titleEl.textContent = `${pokemonExtraData.id}. ${pokemon.name} `;

    const generationEl = document.createElement("p");
    generationEl.textContent = ` ${pokemonSpeciesInfo.generation.name}`;

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");

    const imageEl = document.createElement("img");
    imageEl.classList.add("pokemon-regular");
    imageEl.alt = `image of ${pokemon.name}`;
    imageEl.src = pokemonExtraData.sprites.other.showdown.front_default;

    imageContainer.append(imageEl);

    containerEl.append(titleEl, generationEl, imageContainer);
    mainContainer.append(containerEl);

    containerEl.addEventListener("click", () => {
      displayPokemonDetails(pokemonExtraData);
    });

    mainContainer.appendChild(containerEl);
  }
}

async function displayPokemonDetails(pokemonData) {
  mainContainer.innerHTML = "";
  const { id, name, sprites, base_experience, height, weight, types, stats } =
    pokemonData;
  const speciesInfoUrl = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
  const pokemonSpeciesInfo = await getDetails(speciesInfoUrl);

  const containerEl = document.createElement("div");
  containerEl.classList.add("pokemon-details");
  const titleEl = document.createElement("h2");
  titleEl.classList.add("title-detail");
  titleEl.textContent = `${id}. ${name} `;

  const descriptionEntries = pokemonSpeciesInfo.flavor_text_entries;
  const filteredDescription = descriptionEntries.find(
    (entry) => entry.language.name === "en"
  );

  const descriptionEl = document.createElement("p");
  descriptionEl.textContent = filteredDescription
    ? filteredDescription.flavor_text
    : "No description available";

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("image-details");

  const imageEl = document.createElement("img");
  imageEl.classList.add("pokemon-regular-detail");
  imageEl.alt = `image of ${name}`;

  imageEl.src = sprites.other["official-artwork"].front_default;

  const shinySprite = document.createElement("img");
  shinySprite.classList.add("pokemon-shiny-detail");
  shinySprite.alt = `Image of shiny ${name}`;
  shinySprite.src = sprites.other["official-artwork"].front_shiny;

  imageContainer.append(imageEl, shinySprite);

  const infoContainer = document.createElement("div");
  infoContainer.classList.add("info-container");
  const physical = document.createElement("div");
  physical.classList.add("physical");
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

  infoContainer.append(descriptionEl, typesContainer, statsContainer);
  physical.append(xpEl, heightEl, weightEl);
  containerEl.append(titleEl, imageContainer, physical, infoContainer);
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
    const pokemonSpeciesInfo = await getDetails(
      pokemon.url.replace("pokemon", "pokemon-species")
    );

    const containerEl = document.createElement("div");
    containerEl.classList.add("pokemon-container");

    const generationEl = document.createElement("p");
    generationEl.textContent = ` ${pokemonSpeciesInfo.generation.name}`;

    const titleEl = document.createElement("h2");
    titleEl.classList.add("title");
    titleEl.textContent = `${pokemonExtraData.id}. ${pokemon.name} `;

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");

    const imageEl = document.createElement("img");
    imageEl.classList.add("pokemon-regular");
    imageEl.alt = `image of ${pokemon.name}`;
    imageEl.src = pokemonExtraData.sprites.other.showdown.front_default;

    imageContainer.append(imageEl);

    containerEl.append(titleEl, generationEl, imageContainer);
    mainContainer.append(containerEl);

    containerEl.addEventListener("click", () => {
      displayPokemonDetails(pokemonExtraData);
    });

    mainContainer.appendChild(containerEl);
  }
}

searchButton.addEventListener("click", async () => {
  const searchText = searchInputEl.value.toLowerCase();
  //check if input is valid
  if (searchText.length < 3) {
    displayError("Please enter 3 or more characters");
    return;
  }
  displayError();

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

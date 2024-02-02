import {
  buttonHome,
  buttonPrev,
  buttonNext,
  mainContainer,
  searchInputEl,
  searchButton,
  filterMega,
  filterGmax,
  kanto,
  johto,
  hoenn,
  sinnoh,
  unova,
  kalos,
  alola,
  galar,
  paldea
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
const modal = document.getElementById("pokemonModal");
const closeModalBtn = document.querySelector(".close-modal");
closeModalBtn.addEventListener("click", () => {
  closeModal();
});
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});
function openModal(content) {
  const modalContentContainer = document.getElementById("modal-content-container");
  modalContentContainer.innerHTML = content;
  modal.style.display = "block";
}
function closeModal() {
  modal.style.display = "none";
}
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
   
    const containerEl = document.createElement("div");
    containerEl.classList.add("pokemon-container-main");


    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container-main");

    const imageEl = document.createElement("img");
    imageEl.classList.add("image-main");
    imageEl.alt = `image of ${pokemon.name}`;
    imageEl.src = pokemonExtraData.sprites.other.home.front_default;

    imageContainer.append(imageEl);

    containerEl.append(imageContainer);
    mainContainer.append(containerEl);

    containerEl.addEventListener("click", async () => {
      const pokemonDetailsContent = await displayPokemonDetails(pokemonExtraData);
      openModal(pokemonDetailsContent);
    });

    mainContainer.appendChild(containerEl);
  }
}

async function displayPokemonDetails(pokemonData) {
  mainContainer.innerHTML = "";
  const { id, name, sprites, height, weight, types } =
    pokemonData;
  const speciesInfoUrl = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
  const pokemonSpeciesInfo = await getDetails(speciesInfoUrl);
 
  openModal(displayPokemonDetails);

  const containerEl = document.createElement("div");
  containerEl.classList.add("pokemon-details");

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("image-container-details");

  const imageEl = document.createElement("img");
  imageEl.classList.add("pokemon-regular-detail");
  imageEl.alt = `image of ${name}`;

  imageEl.src = sprites.other.showdown.front_default;

  const shinySprite = document.createElement("img");
  shinySprite.classList.add("pokemon-shiny-detail");
  shinySprite.alt = `Image of shiny ${name}`;
  shinySprite.src = sprites.other.showdown.front_shiny;
  shinySprite.style.display="none"

  const changeImage = document.createElement("button")
  changeImage.classList.add("change-image")
  
  let isShiny = false

  changeImage.addEventListener("click", ()=>{
    if(isShiny){
      imageEl.style.display="block";
      shinySprite.style.display="none"
    } else{
      imageEl.style.display="none";
      shinySprite.style.display ="block"
    }
    isShiny=!isShiny
  })

  imageContainer.append(imageEl, shinySprite);
const titleInfo = document.createElement("div")
titleInfo.classList.add("title-info")

  const titleImage = document.createElement("img")
  titleImage.classList.add("title-image")
  titleImage.setAttribute("src", "/images/icons8-pokeball-64.png")

  const titleEl = document.createElement("h2");
  titleEl.classList.add("title-detail");
  const idNums = String(id).padStart(4, '0')
  titleEl.textContent = `${idNums} ${name} `;

  titleInfo.append(titleImage, titleEl)



  const physical = document.createElement("div");
  physical.classList.add("physical-details");


  const heightEl = document.createElement("p");
  heightEl.textContent = `Height: ${height / 10} M`;

  const weightEl = document.createElement("p");
  weightEl.textContent = `Weight: ${weight / 10} Kg`;

  const typesContainer = document.createElement("div");
typesContainer.classList.add("type-container-details");
const typesHeaderEl = document.createElement("p");
typesHeaderEl.textContent = "Type:";
typesContainer.append(typesHeaderEl);


const typeNames = types.map((type) => type.type.name);
const joinedTypes = typeNames.join(" / ");

const typeEl = document.createElement("p");
typeEl.textContent = joinedTypes;
typesContainer.append(typeEl);

const lineDiv = document.createElement("div")
lineDiv.classList.add("line-break");

const infoContainer = document.createElement("div");
infoContainer.classList.add("info-container-details");

  const descriptionEntries = pokemonSpeciesInfo.flavor_text_entries;
  const filteredDescription = descriptionEntries.find(
    (entry) => entry.language.name === "en"
  );
 
  const descriptionEl = document.createElement("p");
  descriptionEl.classList.add("description-details")
  descriptionEl.textContent = filteredDescription
    ? filteredDescription.flavor_text
    : "No description available";

  infoContainer.append(descriptionEl );
  physical.append(weightEl, heightEl, typesContainer);
  containerEl.append(imageContainer,changeImage, titleInfo, physical, lineDiv, infoContainer);
  const wrapperDiv = document.createElement("div");
  wrapperDiv.appendChild(containerEl);

  return wrapperDiv.innerHTML;
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
    containerEl.classList.add("pokemon-container-main");


    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container-main");

    const imageEl = document.createElement("img");
    imageEl.classList.add("image-main");
    imageEl.alt = `image of ${pokemon.name}`;
    imageEl.src = pokemonExtraData.sprites.other.home.front_default;

    imageContainer.append(imageEl);

    containerEl.append(imageContainer);
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
// sorts the pokemon by region
kanto.addEventListener("click", () => displayPokemonsByRegion("kanto"));
johto.addEventListener("click", () => displayPokemonsByRegion("johto"));
hoenn.addEventListener("click", () => displayPokemonsByRegion("hoenn"));
sinnoh.addEventListener("click", () => displayPokemonsByRegion("sinnoh"));
unova.addEventListener("click", () => displayPokemonsByRegion("unova"));
kalos.addEventListener("click", () => displayPokemonsByRegion("kalos"));
alola.addEventListener("click", () => displayPokemonsByRegion("alola"));
galar.addEventListener("click", () => displayPokemonsByRegion("galar"));
paldea.addEventListener("click", () => displayPokemonsByRegion("paldea"));

async function displayPokemonsByRegion(region) {
  const regionPokemon = await getRegionPokemon(region);
  if (regionPokemon) {
    displayFilteredPokemonList(regionPokemon);
  } else {
    displayError(`No Pokémon found for ${region} region`);
  }
}

async function getRegionPokemon(region) {

  let regionUrl;
  switch (region) {
    case "kanto":
      regionUrl = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=151";
      break;
    case "johto":
      regionUrl = "https://pokeapi.co/api/v2/pokemon?offset=151&limit=100";
      break;
  case "hoenn":
    regionUrl = "https://pokeapi.co/api/v2/pokemon?offset=251&limit=134"
    break;
case "sinnoh":
  regionUrl = "https://pokeapi.co/api/v2/pokemon?offset=386&limit=107"
  break;
  case "unova":
  regionUrl = "https://pokeapi.co/api/v2/pokemon?offset=494&limit=156"
  break;
  case "kalos":
  regionUrl = "https://pokeapi.co/api/v2/pokemon?offset=649&limit=72"
  break;
  case "alola":
  regionUrl = "https://pokeapi.co/api/v2/pokemon?offset=721&limit=88"
  break;
  case "galar":
  regionUrl = "https://pokeapi.co/api/v2/pokemon?offset=809&limit=96"
  break;
  case "paldea":
  regionUrl = "https://pokeapi.co/api/v2/pokemon?offset=905&limit=120"
  break;
    default:
      return null; 
  }

  const regionData = await getData(regionUrl);
  return regionData.results;
}


//Added modal with help from chatGPT, but changed the names of the functions. 
//Other sources have been: pokeapi.co, stackOverflow, w3Schools and 
//https://github.com/PokeMiners/pogo_assets/blob/master/Images/Filters/ic_pokedex.png 
// for image assets regarding logos and pokedex images
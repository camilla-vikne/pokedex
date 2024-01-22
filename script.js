//get the html elements:
const buttonHome = document.getElementById("btn-home");
const buttonPrev = document.getElementById("btn-prev");
const buttonNext = document.getElementById("btn-next");
const errorMsgEl = document.getElementById("error-msg");
const mainContainer = document.getElementById("main-container");

const pokedexUrl = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=20";
let pokemonList = [];
//pokemonList.next: "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20"

//nav events:
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
      `https://pokeapi.co/api/v2/pokemon?offset=${pokemonList.lastPage}`
    );
});

const displayError = (errorMessage) => {
  console.warn(errorMessage);
  errorMsgEl.textContent = errorMessage;
};
async function getData(url = pokedexUrl) {
  const response = await fetch(url);
  if (response.ok !== true) {
    displayError(`noe gikk galt. Status: ${response.status}`);
    return;
  }

  const data = await response.json();
  return data;
}

async function displayPokemonList(url) {
  pokemonList = await getData(url);
  //update last page if null: by calculating nr of pokemons and pokemons per page
  pokemonList.lastPage = Math.floor(pokemonList.count / 20) * 20;

  mainContainer.innerHTML = "";

  for (const pokemon of pokemonList.results) {
    const pokemonExtraData = await getData(pokemon.url);
    const containerEl = document.createElement("div");
    const titleEl = document.createElement("h2");
    titleEl.textContent = `${pokemonExtraData.id}, ${pokemon.name}`;
    const imageEl = document.createElement("img");
    imageEl.alt = `image of ${pokemon.name}`;
    imageEl.style = "max-width: 40%";
    imageEl.src =
      pokemonExtraData.sprites.other["official-artwork"].front_default;

    console.log(pokemonExtraData);
    containerEl.append(titleEl, imageEl);
    mainContainer.append(containerEl);
  }
}
async function displayPokemonDetails() {}
displayPokemonList();

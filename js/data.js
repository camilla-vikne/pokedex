export { getData, getDetails };
import { displayError } from "./error.js";

const pokedexUrl = "https://pokeapi.co/api/v2/pokemon?offset=0&limit=100";
const pokemonSpecies = "https://pokeapi.co/api/v2/pokemon-species/";

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
async function getDetails(url = pokemonSpecies) {
  const response = await fetch(url);
  if (response.ok !== true) {
    displayError(`Noe gikk galt. Status ${response.status}`);
    return;
  }
  displayError();
  const details = await response.json();
  return details;
}

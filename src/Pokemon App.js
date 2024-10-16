const INPUT_ELEM = document.querySelector("#search-input");
const UL_ELEM = document.querySelector(".results");
const BUTTON_ELEM = document.querySelector("#search-button");
const POKEMON_NAME = document.querySelector("#pokemon-name");
const POKEMON_ID = document.querySelector("#pokemon-id");
const POKEMON_WEIGHT = document.querySelector("#weight");
const POKEMON_HEIGHT = document.querySelector("#height");
const IMG_ELEM = document.querySelector("img");
const POKEMON_TYPES = document.querySelector("#types");
const POKEMON_HP = document.querySelector("#hp");
const ATTACK = document.querySelector("#attack");
const DEFENSE = document.querySelector("#defense");
const SPECIAL_ATTACK = document.querySelector("#special-attack");
const SPECIAL_DEFENSE = document.querySelector("#special-defense");
const SPEED = document.querySelector("#speed");

function clearPokemonType() {
    POKEMON_TYPES.textContent = "";
}

function updatePokemonTypes(types) {
    clearPokemonType()

    for (const type of types) {
        const pElem = document.createElement("p");
        pElem.classList.add("type");
        pElem.textContent = type.type.name.toUpperCase();
        POKEMON_TYPES.appendChild(pElem);
        if (type.type.name === "grass") return pElem.classList.add("grass");
        if (type.type.name === "poison") return pElem.classList.add("poison");
        if (type.type.name === "fire") return pElem.classList.add("fire");
        if (type.type.name === "water") return pElem.classList.add("water");
        if (type.type.name === "electric") return pElem.classList.add("electric");
        if (type.type.name === "ground") return pElem.classList.add("ground");
        pElem.classList.add("normal");
    }
}

function showHiddenElements() {
    const pokemonInfo = document.querySelector(".pokemon-info");
    const statsInfo = document.querySelector(".stats");

    pokemonInfo.classList.remove("hide");
    statsInfo.classList.remove("hide");
    statsInfo.classList.add("show");
}

function updateData(pokemonData) {
    showHiddenElements();

    POKEMON_NAME.textContent = pokemonData.name.toUpperCase();
    POKEMON_ID.textContent = "#" + pokemonData.id;
    POKEMON_WEIGHT.textContent = `Weight: ${pokemonData.weight}`;
    POKEMON_HEIGHT.textContent = `Height: ${pokemonData.height}`;
    IMG_ELEM.src = pokemonData.sprites.front_default;
    IMG_ELEM.alt = `${pokemonData.name} Picture`;
    updatePokemonTypes(pokemonData.types);
    POKEMON_HP.textContent = pokemonData.stats[0].base_stat;
    ATTACK.textContent = pokemonData.stats[1].base_stat;
    DEFENSE.textContent = pokemonData.stats[2].base_stat;
    SPECIAL_ATTACK.textContent = pokemonData.stats[3].base_stat;
    SPECIAL_DEFENSE.textContent = pokemonData.stats[4].base_stat;
    SPEED.textContent = pokemonData.stats[5].base_stat;
}

async function getData(pokemonNameOrId) {
    clearInput();

    const searchByPokemonNameApi = `https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${pokemonNameOrId}`;
    const pokemonRespond = await fetch(searchByPokemonNameApi);
    if (pokemonRespond.status === 404) return alert("Pokémon not found");
    const pokemonData = await pokemonRespond.json(); 

    updateData(pokemonData);
}

function clearInput() {
    INPUT_ELEM.value = "";
}

function clearRecommend() {
    if (UL_ELEM) { UL_ELEM.textContent = "" };
}

function selectPokemonName(event) {
    getData(event.target.textContent);
    clearRecommend();
}

function showRecommend(matchedPokemonName) {
    for (const pokemonName of matchedPokemonName) {
        const liElem = document.createElement("li");
        liElem.classList.add("result");
        liElem.textContent = pokemonName.name;
        liElem.onclick = selectPokemonName;
        UL_ELEM.appendChild(liElem);
    }
}

async function onInput(event) {
    const pokemonName = event.target.value;

    if (pokemonName === "") return;
    console.log(pokemonName);
    const pokemonNameListApi = `https://pokeapi-proxy.freecodecamp.rocks/api/pokemon`;
    const pokemonRespond = await fetch(pokemonNameListApi);
    const pokemonData = await pokemonRespond.json();

    const matchedPokemonName = pokemonData.results.filter(result => {
            return result.name.toLowerCase().startsWith(pokemonName.toLowerCase());
        });
    showRecommend(matchedPokemonName);
}

function onkeyUp(event) {
    if (event.key === "Enter") {
        const pokemonNameOrId = INPUT_ELEM.value.toLowerCase().match(/[a-z0-9\-]/g).join("");
        if (pokemonNameOrId === "") return alert("Please enter pokemon's name");
        getData(pokemonNameOrId);
    }
}

function onClick() {
    const pokemonNameOrId = INPUT_ELEM.value.toLowerCase().match(/[a-z0-9\-]/g).join("");

    if (pokemonNameOrId === "") return alert("Please enter pokemon's name");
    getData(pokemonNameOrId);
}

function debounce(callback, delay = 500) {
    let timer;
    return function(...args) {
        if (timer) { clearTimeout(timer) }
        timer = setTimeout(() => {
            callback(...args);
        }, delay);
    }
}

function run() {
    INPUT_ELEM.addEventListener("keyup", onkeyUp);

    const debounceOnClick = debounce(onClick);
    BUTTON_ELEM.addEventListener("click", debounceOnClick);

    const debounceOnInput = debounce(onInput, 1000);
    INPUT_ELEM.addEventListener("input", debounceOnInput);

    document.body.addEventListener("click", clearRecommend);
}

run();
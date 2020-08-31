const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const main = document.querySelector('main')


function createDiv(trainerObj){
  const newDiv = document.createElement('div')
  newDiv.classList.add('card')
  newDiv.dataset.id = `${trainerObj.id}`
  newDiv.innerHTML = `
    <p>${trainerObj.name}</p>
    <button data-trainer-id="${trainerObj.id}">Add Pokemon</button>
  `
  const ul = document.createElement('ul')
  for (const pokemon of trainerObj['pokemons']){
    const newLi = document.createElement('li')
    newLi.innerHTML = `
      ${pokemon.nickname} (${pokemon.species}) 
      <button class="release" data-pokemon-id="${pokemon.id}">Release</button>
    `
    ul.append(newLi)
  }
  newDiv.append(ul)
  main.append(newDiv)
}

function getPokemon(){
  fetch(TRAINERS_URL)
  .then(resp=>resp.json())
  .then(results => {
    for (const trainer of results){
      createDiv(trainer)
    }
  })
}

getPokemon()


main.addEventListener('click', e => {
  console.dir(e.target)
  if (e.target.innerText === 'Add Pokemon'){
    const newPokemon = getNewPokemon(e.target.dataset.trainerId)
    addPokemonToUl(e.target.nextElementSibling, newPokemon)
  } else if (e.target.innerText === 'Release'){
    console.log(e.target.dataset.pokemonId)
    const removedPokemon = releasePokemon(e.target.dataset.pokemonId)
    removedPokemon.then(results => {
      e.target.parentNode.remove()
    })
  }
})

function releasePokemon(pokemonId){
  return fetch(`http://localhost:3000/pokemons/${pokemonId}`, {method: "DELETE"}).then(resp=>resp.json())
}


function getNewPokemon(trainerId){
  const configObj = {
    method: "POST", 
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({"trainer_id": `${trainerId}`})
  }
  return fetch(POKEMONS_URL, configObj).then(resp=>resp.json())
}

function addPokemonToUl(ul, pokemon){
  const newLi = document.createElement('li')
  if (ul.childElementCount < 6){
    pokemon.then(obj=>{
    newLi.innerHTML = `
      ${obj.nickname} (${obj.species}) 
      <button class="release" data-pokemon-id="${obj.id}">Release</button>
    `
    ul.append(newLi)
    })
  }
}



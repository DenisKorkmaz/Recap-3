import { createCharacterCard } from "./components/card/card.js";

const cardContainer = document.querySelector('[data-js="card-container"]');
const searchBarContainer = document.querySelector('[data-js="search-bar-container"]');
const searchBar = document.querySelector('[data-js="search-bar"]');
const navigation = document.querySelector('[data-js="navigation"]');
const prevButton = document.querySelector('[data-js="button-prev"]');
const nextButton = document.querySelector('[data-js="button-next"]');
const pagination = document.querySelector('[data-js="pagination"]');

// States
let maxPage = 42;
let page = 1;
let searchQuery = "";

async function fetchCharacters() {
  try {
    const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${page}&name=${searchQuery}`);

    if (response.ok) {
      const data = await response.json();
      const characters = data.results;
      maxPage = data.info.pages;
      return characters;
    } else {
      console.error("An Error occurred");
    }
  } catch (error) {
    console.error("An Error occurred: ", error);
  }
}

function displayCharacters(characters) {
  if (characters.length > 0) {
    cardContainer.innerHTML = "";
    characters.forEach(character => {
      const card = createCharacterCard(
        character.image,
        character.name,
        character.status,
        character.type,
        character.episode.length
      );
      cardContainer.appendChild(card);
    });
  } else {
    cardContainer.innerHTML = "<p>No characters found</p>";
  }
  pagination.textContent = `${page} / ${maxPage}`;
}


fetchCharacters().then(displayCharacters);

prevButton.addEventListener('click', () => {
  if (page > 1) {
    page--;
    fetchCharacters().then(displayCharacters);
  }
});

nextButton.addEventListener('click', () => {
  if (page < maxPage) {
    page++;
    fetchCharacters().then(displayCharacters);
  }
});

searchBar.addEventListener('submit', event => {
  event.preventDefault();
  searchQuery = searchBar.querySelector('input').value;
  page = 1;
  fetchCharacters().then(displayCharacters);
});


/* 
The Search Bar

Now we want even more functionality in our app. We want to find individual characters by typing
their name into the search bar.

- Create a 'submit' event listener on the search bar.
- Update the state variable `searchQuery` with the current text inside the search bar every time
  this event is triggered.
- Modify the fetch URL again by adding another url encoded attribute `name`: append
  `&name=<searchQuery>` to the url. If the search query is an empty string, it will be ignored by
  the API, so don't worry about that.
- Now trigger the function `fetchCharacters` whenever a submit event happens.

> 💡 You might run into some bugs at this point. Think about how the page and max page index might
> have to change when you start searching for only subsets of all characters. */
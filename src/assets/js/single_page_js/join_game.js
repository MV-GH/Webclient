'use strict';

document.addEventListener('DOMContentLoaded', init);

const error = document.querySelector('.error');
const gameName = document.querySelector('h1');
let gameId;

function init() {
    checkUrl();
    checkLS();
    document.querySelector('form').addEventListener('submit', joinGame);
    setCustomLobbyName();
}


function checkUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("id")) {
        localStorage.setItem("gameId", urlParams.get("id"));
    }
}

function checkLS() {
    if (!localStorage.getItem('gameId')) {
        window.location.replace('./list_games.html');
    } else {
        gameId = localStorage.getItem('gameId');
    }
}


function setCustomLobbyName() {
    returnLobby(gameId).then(customNameLobby => {
        gameName.innerText = customNameLobby.customNameLobby;
    });
}


function joinGame(e) {
    e.preventDefault();

    const name = document.querySelector('#userid').value.toLowerCase();

    if (!validate(name)) {
        return;
    } // prevents code from further executing if it doesnt validate

    addPlayer(gameId, name).then(response => {
        if (response.ok) {
            response.json().then(jsonToken => {
                localStorage.setItem("button", "ready");
                localStorage.setItem('playerToken', jsonToken);
                localStorage.setItem('playerName', name);
                window.location.replace('./game_lobby.html');
            });
        } else {
            response.json().then(responseError=> error.innerHTML = responseError.cause);
        }
    });
}

function validate(name) {
    if (!/^[0-9a-z]+$/.test(name)) { //using regex to check if the name is allowed
        error.innerHTML = "The name can only contain numbers and letters from the alphabet, no spaces are allowed!";
        return false;
    }
    return true;
}

"use strict";

const city = document.querySelector("#city");
const cityMapTitle = document.querySelector("#cityMap h5");
const cityMapWrapper = document.querySelector("#cityMap div div");
const cityReserveTitle = document.querySelector("#cityReserve h5");
const cityReserveWrapper = document.querySelector("#cityReserve div");
let cityZoomOut = null;
let cityZoomIn = null;
let name = null;

function showCity(e) {
    name = e.currentTarget.innerHTML;
    city.classList.add("flex");
    cityMapTitle.innerHTML = "The town of " + name;
    setCity();
    cityReserveTitle.innerHTML = "Reserve buildings of " + name;
}


function setCity() { // loads in the map
    getGamePlayerProperty(gameId, token, name, "city").then(cityMap => {
        setMap();//make the map stay sync
        updateMapSize();
        cityMapWrapper.className = 'map' + mapSize;//set the size of the map
        cityMapWrapper.innerHTML = `<aside><p id="zoom_in_city">+</p><p id="zoom_out_city">-</p></aside>`;
        convertCityToMap(cityMap).forEach(row => row.forEach(cell => cityMapWrapper.innerHTML += createBuilding(cell)));
        cityZoomIn = document.querySelector("#zoom_in_city");
        cityZoomOut = document.querySelector("#zoom_out_city");
        cityZoomIn.addEventListener('click', () => zoomIn(cityZoomOut, setCity));
        cityZoomOut.addEventListener('click', () => zoomOut(cityZoomIn, setCity));
        zoomButtonHider(cityZoomIn, cityZoomOut);
    });
    getGamePlayerProperty(gameId, token, name, "reserve").then(reserve => {
        let reserveBuildings = '';
        reserve.forEach(building => reserveBuildings += createBuilding(building));
        cityReserveWrapper.innerHTML = reserveBuildings;
    });
}
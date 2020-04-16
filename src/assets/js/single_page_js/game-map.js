"use strict";

let mapSize = 5;
const btnZoomIn = document.querySelector("#zoom_in");
const btnZoomOut = document.querySelector("#zoom_out");

function setMap(addListeners = false) { // loads in the map
    getGamePlayerProperty(gameId, token, playerName, "city").then(city => {
        zoomButtonHider();
        mapWrapper.className = 'map' + mapSize;//set the size of the map
        mapWrapper.innerHTML = '';
        let index = 0;
        convertCityToMap(city).forEach(row => {
            row.forEach(cell => {
                mapWrapper.innerHTML += createBuilding(cell, index, redesignOn);
                index++;//fk u sonar
            });
        });
        showHand();//temp or is it?
        setRedesignSelectors();
        if (addListeners) {
            document.querySelectorAll("#map .building").forEach(building => building.addEventListener("click", swap));
        }
        console.log("map called");
    });
}

function convertCityToMap(city) { //converts the city into the size of the map
    const map = [...Array(mapSize)].map(() => Array(mapSize).fill(null)); //creates an empty/null 2 dimensional array
    const cityCenter = (city.length + 1) / 2;
    const mapCenter = (mapSize + 1) / 2;
    const diffCenter = Math.abs(cityCenter - mapCenter);
    if (cityCenter > mapCenter) {
        for (let row = 0; row < mapSize; row++) {
            for (let col = 0; col < mapSize; col++) {
                map[row][col] = city[row + diffCenter][col + diffCenter];
            }
        }
    } else if (cityCenter < mapCenter) {
        const citySize = city.length;
        for (let row = 0; row < citySize; row++) {
            for (let col = 0; col < citySize; col++) {
                map[row + diffCenter][col + diffCenter] = city[row][col];
            }
        }
    } else {
        return city;
    }
    return map;
}

function zoomIn() { // changes the mapSize and holds logic for the buttons
    if (mapSize !== 3) {
        if (mapSize === 9) {
            btnZoomOut.classList.remove("inactive");
        }
        mapSize -= 2;
        localStorage.setItem("mapsize", mapSize);
        setMap();
    }
}

function zoomOut() {  // changes the mapSize and holds logic for the buttons
    if (mapSize !== 9) {
        if (mapSize === 3) {
            btnZoomIn.classList.remove("inactive");
        }
        mapSize += 2;
        localStorage.setItem("mapsize", mapSize);
        setMap();
    }
}

function zoomButtonHider() { //logic for making the buttons invisible
    if (mapSize === 9) {
        btnZoomOut.classList.add("inactive");
    } else if (mapSize === 3) {
        btnZoomIn.classList.add("inactive");
    }
}

function showPossibleLocations(building, addEventListeners) { //lights up all the possible locations the on the map
    getCityLocations(gameId, playerName, building.walls).then(locations => {
        locations.forEach(location => {
            const index = convertStaticLocationToIndex(convertDynamicToStaticLocation(location));
            const mapRadius = (mapSize - 1) / 2;
            if (Math.abs(location.col) <= mapRadius && Math.abs(location.row) <= mapRadius) { //only show what tiles are visible on the current map
                const tile = document.querySelectorAll("#map div p")[index];
                tile.classList.add("blink");
                tile.setAttribute("data-row", location.row);
                tile.setAttribute("data-col", location.col);
                addEventListeners(tile, building);
            }
        });
    });
}

function placeBuildingOnMap(e, building, apiCall) { //places the building on the map works only a possible location tile
    const row = e.target.getAttribute("data-row");
    const col = e.target.getAttribute("data-col");
    apiCall(gameId, token, playerName, building, {row: row, col: col}).then(response => responseHandler(response, e));
}

function initLSMapSize() { //handles the LS for mapSize so that when pages refresh the map still has the same size
    if (!localStorage.getItem("mapsize")) {
        localStorage.setItem("mapsize", mapSize.toString());
    } else {
        mapSize = parseInt(localStorage.getItem("mapsize"));
    }
}


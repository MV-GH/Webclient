"use strict";

let mapSize = 5;

function setMap() { // loads in the map
    getGamePlayerProperty(gameId, token, playerName, "city").then(city => {
        mapWrapper.className = 'map' + mapSize;//set the size of the map
        mapWrapper.innerHTML = '';
        convertCityToMap(city).forEach(row => {
            row.forEach(cell => {
                mapWrapper.innerHTML += createBuilding(cell);
            });
        });
        showHand();//temp or is it?
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

function createBuilding(building) { //receives an building object and turns it into html for a building
    if (building === null) {
        return `<p></p>`;
    } else if (building.cost === 0) {
        return `<p class="fountain building"></p>`;
    } else {
        let walls = '';
        Object.keys(building.walls).forEach(wall => {
            if (building.walls[wall]) {
                walls += wall + "Wall ";
            }
        });
        return `<p class="building ${building.type} ${walls}">${building.cost}</p>`;
    }
}

function zoomIn(e) { // changes the mapSize and holds logic for the buttons
    if (mapSize !== 3) {
        if (mapSize === 9) {
            document.querySelector("#zoom_out").classList.remove("inactive");
        }
        mapSize -= 2;
        localStorage.setItem("mapsize", mapSize);
        if (mapSize === 3) {
            e.target.classList.add("inactive");
        }
        setMap();
    }
}

function zoomOut(e) {  // changes the mapSize and holds logic for the buttons
    if (mapSize !== 9) {
        if (mapSize === 3) {
            document.querySelector("#zoom_in").classList.remove("inactive");
        }
        mapSize += 2;
        localStorage.setItem("mapsize", mapSize);
        if (mapSize === 9) {
            e.target.classList.add("inactive");
        }
        setMap();
    }
}

function showPossibleLocations(building) { //lights up all the possible locations the on the map
    getCityLocations(gameId, playerName, building.walls).then(locations => {
        locations.forEach(location => {
            const index = convertToIndex(convertDynamicToStatic(location));
            const mapRadius = (mapSize - 1) / 2;
            if (Math.abs(location.col) <= mapRadius && Math.abs(location.row) <= mapRadius) { //only show what tiles are visible on the current map
                const tile = document.querySelectorAll("#map div p")[index];
                tile.classList.add("blink");
                tile.setAttribute("data-row", location.row);
                tile.setAttribute("data-col", location.col);
                tile.addEventListener("click", e => placeBuildingOnMap(e, building));
            }
        });
    });
}

function convertToIndex(staticLocation) { //turns the static location into the correct index for the tile on the map
    return (staticLocation.row * mapSize) + staticLocation.col;
}

function convertDynamicToStatic(location) { //turns the dynamic location/location based around fountain into location based on top left
    const mapRadius = (mapSize - 1) / 2;
    return {
        row: location.row + mapRadius,
        col: location.col + mapRadius
    };
}

function placeBuildingOnMap(e, building) { //places the building on the map
    const row = e.target.getAttribute("data-row");
    const col = e.target.getAttribute("data-col");
    placeBuilding(gameId, token, playerName, building, {row: row, col: col}).then(response => responseHandler(response, e));
}

function initLSMapSize() { //handles the LS for mapSize so that when pages refresh the map still has the same size
    if (!localStorage.getItem("mapsize")) {
        localStorage.setItem("mapsize", mapSize.toString());
    } else {
        mapSize = parseInt(localStorage.getItem("mapsize"));
    }
}

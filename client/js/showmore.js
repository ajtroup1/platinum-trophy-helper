let filteredGames = []
let achievements = []

//onload
async function handleOnLoad(){
    await getGameByID()
    await getAchievements()
    populateShowMore()
    populateNotes()
}

//dom manipulation
function populateShowMore(){
    console.log('current game: ', filteredGames[0])
    let html = `
    <div class="banner-container">
        <div class="image-container">
            <img src="${filteredGames[0].imgURL}" class="home-img">
            <div class="card-overlay">
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">${filteredGames[0].name}</h5>
                        `
                        //COMPLETED
                        if(filteredGames[0].completed == false){
                            html+=`<p style="background-color: red;">NOT COMPLETE</p>`
                        }
                        else{
                            html+=`<p style="background-color: green;">COMPLETE</p>`
                        }
                        //Achievements
                        let achRatio = filteredGames[0].compAchievements / filteredGames[0].totalAchievements
                        if(achRatio < .33333){
                            html+=`
                            <p style="background-color: red;">Achievements: ${filteredGames[0].compAchievements} / ${filteredGames[0].totalAchievements}</p>
                            `
                        }
                        else if(achRatio > .6666 && achRatio<1){
                            //light green
                            html+=`
                            <p style="background-color: greenyellow;">Achievements: ${filteredGames[0].compAchievements} / ${filteredGames[0].totalAchievements}</p>
                            `
                        }
                        else if(achRatio == 1){
                            //complete green
                            html+=`
                            <p style="background-color: green;">Achievements: ${filteredGames[0].compAchievements} / ${filteredGames[0].totalAchievements}</p>
                            `
                        }
                        else{
                            //yellow
                            html+=`
                            <p style="background-color: yellow;">Achievements: ${filteredGames[0].compAchievements} / ${filteredGames[0].totalAchievements}</p>
                            `
                        }
                        
                        //Difficulty
                        if(filteredGames[0].difficulty<4){
                            html+=`<p style="background-color: green;">Difficulty: ${filteredGames[0].difficulty} / 10</p>`
                        }
                        else if(filteredGames[0].difficulty>3 && filteredGames[0].difficulty<8){
                            html+=`<p style="background-color: yellow;">Difficulty: ${filteredGames[0].difficulty} / 10</p>`
                        }
                        else{
                            html+=`<p style="background-color: red;">Difficulty: ${filteredGames[0].difficulty} / 10</p>`
                        }
                        //Play time
                        if(filteredGames[0].playTime == 0){
                            html+=`<p>Play time: n/a</p>`
                        }
                        else{
                            html+=`<p>Play time: ${filteredGames[0].playTime} hours</p>`
                        }
                        html+=`
                        <p>Playthroughs: ${filteredGames[0].playthroughs}</p>
                        <button type="button" class="btn btn-secondary" onclick="handleEditGame(${filteredGames[0].id})">Edit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    document.getElementById('showmore').innerHTML = html;
}
function populateNotes() {
    let html = '';

    // Add Achievements Button
    html += `
    <div id="add-achievements-button-container">
        <button class="btn btn-primary" onclick="handleAddAchievements()">Add Achievements</button>
    </div>
    `;

    // Achievements Table
    html += `
    <div id="right-box">
        <div id="achievements-table-container">
            <table class="table" id="achievements-table">
                <thead>
                    <tr>
                        <th>Achievement</th>
                        <th>Completed</th>
                        <th>Rarity</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>`;

    if (achievements.length === 0) {
        html += `
            <tr>
                <td colspan="4"><h5>No Achievements have been input for this game</h5></td>
            </tr>`;
    } else {
        achievements.forEach(achievement => {
            html += `
            <tr>
                <td>${achievement.name}</td>
                <td>${achievement.completed ? 'Completed' : 'Not Completed'}</td>
                <td>${achievement.rarity}%</td>
                <td>${achievement.dateUnlocked || 'n/a'}</td>
            </tr>`;
        });
    }

    html += `
                </tbody>
            </table>
        </div>
    </div>
    `;

    document.getElementById('bottom-containers').innerHTML = html;
}

//data
async function getGameByID(){
    let showMoreID = localStorage.getItem('showMoreID')

    try{
        const response = await fetch('http://localhost:5116/api/games');
        if (!response.ok) {
            throw new error("Network response is not ok");
        }else {
            let games = await response.json();
            filteredGames = games.filter(game => game.id === parseInt(showMoreID));
            return filteredGames;
        }
    } catch (error){
        console.log(error);
    }
}
async function getAchievements() {
    try {
        const response = await fetch('http://localhost:5116/api/Achievements');
        if (!response.ok) {
            throw new Error("Network response is not ok");
        } else {
            data = await response.json();
            console.log('unfiltered ach:', data);
            console.log('filtering on game ID#', filteredGames[0].id,', ', filteredGames[0].name)
            achievements = data.filter(achievement => achievement.gameID === filteredGames[0].id);
            console.log('filtered ach', achievements);
            return achievements;
        }
    } catch (error) {
        console.log(error);
    }
}

//handling
// Hide the edit container initially
document.getElementById('edit-container').style.display = 'none';

// Function to show the edit container when the edit button is clicked
async function handleEditGame(){
    // Create HTML for the edit card
    let editCardHtml = `
    <div id="edit-container" class="d-flex justify-content-center align-items-center vh-100">
        <div class="card w-50"> <!-- Adjust the width here -->
            <div class="card-body">
                <h5 class="card-title">Edit Game</h5>
                <form id="editForm">
                    <div class="mb-3">
                        <label for="name" class="form-label">Name:</label>
                        <input type="text" class="form-control" id="name" value="${filteredGames[0].name}">
                    </div>
                    <div class="mb-3">
                        <label for="totalAchievements" class="form-label">Total Achievements:</label>
                        <input type="number" class="form-control" id="totalAchievements" value="${filteredGames[0].totalAchievements}">
                    </div>
                    <div class="mb-3">
                        <label for="compAchievements" class="form-label">Completed Achievements:</label>
                        <input type="number" class="form-control" id="compAchievements" value="${filteredGames[0].compAchievements}">
                    </div>
                    <div class="mb-3 form-check">
                        <input type="checkbox" class="form-check-input" id="completed" ${filteredGames[0].completed ? 'checked' : ''}>
                        <label class="form-check-label" for="completed">Completed</label>
                    </div>
                    <div class="mb-3">
                        <label for="difficulty" class="form-label">Difficulty:</label>
                        <input type="number" class="form-control" id="difficulty" value="${filteredGames[0].difficulty}">
                    </div>
                    <div class="mb-3">
                        <label for="playTime" class="form-label">Play Time:</label>
                        <input type="number" class="form-control" id="playTime" value="${filteredGames[0].playTime || ''}">
                    </div>
                    <div class="mb-3">
                        <label for="playthroughs" class="form-label">Playthroughs:</label>
                        <input type="number" class="form-control" id="playthroughs" value="${filteredGames[0].playthroughs}">
                    </div>
                    <div class="mb-3">
                        <label for="imgURL" class="form-label">Image URL:</label>
                        <input type="text" class="form-control" id="imgURL" value="${filteredGames[0].imgURL}">
                    </div>
                    <button type="button" class="btn btn-primary" onclick="handlePutRequest()">Save Changes</button>
                </form>
            </div>
        </div>
    </div>
    `;
    // Set the HTML content of the edit container
    document.getElementById('edit-container').innerHTML = editCardHtml;

    // Show the edit container
    document.getElementById('edit-container').style.display = 'block';
}

async function handlePutRequest(){
    // Get the difficulty value from the input field
    let difficulty = parseInt(document.getElementById('difficulty').value);

    // Check if the difficulty value is within the valid range (0 to 10)
    if (isNaN(difficulty) || difficulty < 0 || difficulty > 10) {
        alert("Difficulty must be a number between 0 and 10.");
        return; // Stop further execution if the condition is not met
    }

    // If the difficulty is valid, proceed with the PUT request
    game = {
        id: filteredGames[0].id,
        name: document.getElementById('name').value,
        totalAchievements: parseInt(document.getElementById('totalAchievements').value),
        compAchievements: parseInt(document.getElementById('compAchievements').value),
        completed: document.getElementById('completed').checked,
        difficulty: difficulty, // Use the validated difficulty value
        playTime: parseInt(document.getElementById('playTime').value) || null,
        playthroughs: parseInt(document.getElementById('playthroughs').value),
        imgURL: document.getElementById('imgURL').value
    }

    try {
        const response = await fetch(`http://localhost:5116/api/games/${filteredGames[0].id}`, {
            method: "PUT",
            body: JSON.stringify(game),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to update stock. Status: ${response.status}`);
        }

        // Refresh the page after successful update
        window.location.reload();
    } catch (error) {
        console.error(error);
        // Handle the error as needed (e.g., show an error message to the user)
    }
}

async function handleAddAchievements(){
    achievement = {
        
    }
    try {
        const response = await fetch(`http://localhost:5116/api/games/${filteredGames[0].id}`, {
            method: "POST",
            body: JSON.stringify(achievement),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to update stock. Status: ${response.status}`);
        }

        // Refresh the page after successful update
        window.location.reload();
    } catch (error) {
        console.error(error);
        // Handle the error as needed (e.g., show an error message to the user)
    }
}
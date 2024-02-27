//js globals
games = []

//onload
async function handleOnLoad(){
    await populateGamesArray()
    await calculateStats()
    populateBanner()
    populateAddGame()
    populateGames()
}

//dom manipulation
function populateBanner(){
    let html=`
    <div class="banner-container">
        <img src="../resources/platinumbanner.jpg" class="banner-image">
        <div class="left-card">
        <div class="card" style="width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">Filters</h5>
              <label for="compcheck">Completed: </label>
              <input type="checkbox" id="compcheck" onclick="handleCompleteFilter()"><br>
              <label for="namesearch">Search (name): </label>
              <input type="text" id="namesearch"><br>
              <button onclick="populateGames()">Apply</button>
              <button onclick="handleRevert()">Revert</button>
            </div>
          </div>
        </div>
        
        
    `

    document.getElementById("banner").innerHTML = html
}
function populateAddGame(){
    let html=`
    <div class="addgamecontainer">
        <div class="button-container">
            <a href="../html/addgame.html"><button class="btn btn-success" onclick="handleAddNew">Add New Game</button></a>
        </div>
    </div>
    `

    document.getElementById("addgamecontainer").innerHTML = html
}
function populateGames(){
    console.log(games)
    
    let html = `
    <table class="table">
        <thead>
            <th>Name</th>
            <th>Completed</th>
            <th>Playtime</th>
            <th>Show More</th>
        </thead>
        <tbody>
    `
    games.forEach(game => {
        html+=`
        <tr>
            <td>${game.name}</td>
        `
        if(game.completed==true){
            html+=`<td style="color: green;">YES</td>`
        }
        else{
            html+=`<td style="color: red;">NO</td>`
        }
        if(game.playTime==""){
            html+=`<td>n/a</td>`
        }
        else{
            html+=`<td>${game.playTime} hours</td>`
        }
        html+=`
        <td><button class="btn btn-secondary" onclick="handleShowMore(${game.id})">Show More</button></td>
        </tr>
        `
    });


    html+=`
        </tbody>
    </table>
    `

    document.getElementById("gamestable").innerHTML = html
}

//data
async function populateGamesArray(){
    try{
        const response = await fetch('http://localhost:5116/api/games');
        if (!response.ok) {
            throw new error("Network response is not ok");
        }else {
            games = await response.json();
            return data;
        }
    } catch (error){
        console.log(error);
    }
}

function calculateStats(){
    totalGames = games.length
    compGames = 0
    games.forEach(game => {
        if(game.completed == true){
            compGames++
        }
    })
    console.log("completed",compGames," / tot: ",totalGames)

    totalPlayTime = 0
    games.forEach(game =>{
        if(game.playTime!=""){
            totalPlayTime+=parseInt(game.playTime)
        }
    })
    console.log("total play time: ", totalPlayTime)


    let html=`
    <div class="right-card">
          <div class="card" style="width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">Stats</h5>
              <label for="statcompleted">Completed: </label>
              <div id="statcompleted">
                <h5>${compGames} / ${totalGames}</h5>
              </div>
              <label for="statplaytime">Total Play Time: </label>
              <div id="statplaytime">
                <h5>${totalPlayTime}</h5>
              </div>
            </div>
          </div>
        </div>
    </div>
    `

    document.getElementById("rightcard").innerHTML = html
}

//handling
function handleCompleteFilter(){
    console.log('completed filter ran')
    games = games.filter(game => {
        return game.completed === true;
    });
}
async function handleRevert(){
    document.getElementById("compcheck").checked = false; // Clear the checkbox
    document.getElementById("namesearch").value = '';
    games = []
    await populateGamesArray()
    populateGames()
}
async function handleShowMore(id) {
    // Convert id to string before saving to localStorage
    await localStorage.setItem('showMoreID', id.toString());

    // Open the new window with the correct path and target
    window.open('../html/showmore.html', '_self');
}
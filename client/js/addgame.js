
//onload
function handleOnLoad(){
    console.log('onload ran')
    populateAddGameForm()
}


//dom manipulation
function populateAddGameForm(){
    let html=`
    <div class="form-div">
        <div class="form-container">
            <form onsubmit="return handleAddGame(event);">
            <h5 class="addgameheading">TEXT</h5>
                <div class="form-group">
                    <label for="name">*Name: </label>
                    <input type="text" class="form-control" id="name">
                </div>
                <div class="form-group">
                    <label for="totalach">*Total achievements: </label>
                    <input type="text" class="form-control" id="totalach">
                </div>
                <div class="form-group">
                    <label for="currach">Current achievements: </label>
                    <input type="text" class="form-control" id="currach">
                </div>
                <div class="form-group">
                    <label for="imgurl">Image URL: </label>
                    <input type="text" class="form-control" id="imgurl">
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        </div>
    </div>
    `


    document.getElementById('addgameform').innerHTML = html
}


//handling
async function handleAddGame(event){
    event.preventDefault(); // Prevent default form submission behavior
    let cAch = 0
    let pt = 0
    let diff = 0
    let play = 0
    let imgurl = 'blank'

    //compAchievements
    if(document.getElementById('currach').value == ''){
        console.log('defult 0 currach')
        cAch = 0
    }
    else{
        console.log('currach other')
        cAch = document.getElementById('currach').value
    }

    //imgurl
    if(document.getElementById('imgurl').value == ''){
        console.log('defult 0 imgurl')
        imgurl = ''
    }
    else{
        console.log('imgurl other')
        imgurl = document.getElementById('imgurl').value
    }

    let game = {
        name : document.getElementById('name').value,
        totalAchievements: parseInt(document.getElementById('totalach').value),
        compAchievements: cAch,
        imgURL: imgurl
    }


    console.log(game)


    try {
        const response = await fetch("http://localhost:5116/api/games", {
            method: "POST",
            body: JSON.stringify(game),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });


        if (!response.ok) {
            throw new Error(`Failed to save stock. Status: ${response.status}`);
        }
    } catch (error) {
        console.error(error);
        // Handle the error as needed (e.g., show an error message to the user)
    }
}

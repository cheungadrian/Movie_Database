/*
this is my rough implementation of the business logic side of the project 
the front and the backend are not connected yet as it is not expected
*/

//let movies = require("./movies.json"); //load initial movies
//let actors = require("./actors.json"); //load initial actors
//let users = require("./users.json"); //load initial users

let movies = [];                                            //these arrays will contain their respective object types 
let actors = [];
let users= [
    {id: 1, username: "john123", password: "casio12",following: [],followers:[],reviews:[],moviesAdded:[],contributingUser: false},
    {id: 2, username: "anie124", password: "westcott2",following: [],followers:[],reviews:[],moviesAdded:[],contributingUser: false}
]

let next_movie_id = -1;                                     //this loads the movies and knows what the next id in order to install a new movie is 
for(movie_id in movies){
    if(Number(movies[movie_id].id >= next_movie_id)){
        next_movie_id = Number(movies[movie_id].id) + 1;
    }
}

console.log("Next movie_id: " + next_movie_id);

let id = 1;                                     //this loads the movies and knows what the next id in order to install a new user ID is 
for(id in users){
    if(Number(users[id].id >= id)){
        id = Number(users[id].id) + 1;
    }
}

console.log("Next user_id: " + next_user_id);

let next_actor_id = 0;                                     //this loads the movies and knows what the next id in order to install a new user ID is 
for(actorId in actors){
    if(Number(actors[actorId].id >= next_actor_id)){
        next_actor_id = Number(actors[actorId].id) + 1;
    }
}
//we probably do not need an actor ID but i have implemented it just in case that strings are not desired and we can always fall back to actorID integers

function authenticateUser(username, password){
  return users.hasOwnProperty(username) && users[username].password == password;
}

/*
Assumption is that we are provided with an object containing the user's desired username and password. Once this is connected to the web, this information may come from a sign up form, for example.

Inputs:
newUser - a user object with username and password

Outputs:
The newly created user if succesfully created, null otherwise
*/

function createUser(new_user){      //this assumes we are provided with a username and password
    if(!new_user.username || !new_user.password){       //checks if username and password are not empty
        return null;
    }

    for(let x of users){
        if(x != null){
            if(x.username == new_user.username){ //check for same username 
                return null;
            }
        }
    }

    //Set initial values for the new user
    new_user.id = next_user_id;
    next_user_id++;
    new_user.reviews = [];
    new_user.following = [];
    new_user.followers = []
    new_user.contributingUser = false;
    users[next_user_id] = new_user;

    return users[new_user.username];
}

/*
Assumption: we are given a requesting user's id number
inputs: userid
outputs: the userobject that contains that id
*/
function get_user(requestingid){
    for(let x of users){
        if(x != null){
            if(x.id == requestingid){
                return x;
            }
        }
    }
}
/*
Assumption: we search for the users array and give back the users that contain a certain substring in their username
inputs: search term
outputs: array of potential results
*/
function search_users(search_term){
    let results = [];
    for(let x of users){
        if(x != null){
            console.log(x.username);
            console.log(search_term);
            if(x.username.includes(search_term) == true){
                console.log("found the letter")
                results.push(x);
            }
        }
    }
    return results;
}
//user A is the person that is going to follow user b
function follow(user_a,user_b){
    if(user_a == null || user_b == null){
        console.log("failed");
        return;
    }
    if(user_a.following.includes(user_b)){
        console.log("failed 1");
        return;     //if that person is already following that person
    }
    user_a.following.push(user_b);
    user_b.followers.push(user_a);
    console.log(user_a.following);
    console.log(user_b.followers);
    
}

function unfollow(user_a,user_b){       //user a wants to unfollow user b 
    //make sure that both of these exist 
    if(user_a == null || user_b == null){
        console.log("failed");
        return;
    }
    //make sure that this person is actually following that person
    if(user_a.following.includes(user_b)){
        removeItemOnce(user_a.following,user_b);
        removeItemOnce(user_b.followers,user_a);
        console.log(user_a.following);
        console.log(user_b.followers);
    }
    return;
}

function removeItemOnce(array, value) {           //this function removes a specific item from an array given the array and the value it will remove 
    let index = array.indexOf(value);             //will find the index of the given value in the array
    if (index > -1) {
      array.splice(index, 1);                     //will delete that specific value using the splice operation 
    }
    return array;
  }

function createMovie(requestingUser, keyword, date, runtime, plot, genre){      //the person calling for it has to pass in: date, runtime, plot, genre, title, actors if any
    if(requestingUser.contributingUser == false){           //make sure that they are a contributing user
        console.log("UNAURHTORIZED USER");                  //declined
        return;
    }
    let new_movie = {                                       //create new movie object
        title: keyword, 
        id: String(next_movie_id),
        creator: requestingUser.username, 
        actors: [],
        genre: genre,
        runtime: runtime,
        plot: plot,
        date: date,
        actors: [],
        reviews: []
    }; 
    requestingUser.moviesAdded.push(new_movie);         //adds to arrays
    movies.push(new_movie);
}

/*
Assumption: we search for the movie array and give back the movie that contain a certain substring in their title
inputs: search term
outputs: array of potential results
*/
function searchMovie(search_term){
    let results = [];
    for(let x of movies){
        if(x != null){
            if(x.title.includes(search_term) == true){
                results.push(x);
            }
        }
    }
    return results;
}

function getMovie(requestingid){ //gets a movie from their requesting id
    for(let x of movies){
        if(x != null){
            if(x.id == requestingid){
                return x;
            }
        }
    }
}

function createReview(requestingUser, movieTitle,starRating,longReview){       //the requesting user passes on their title of the movie and their review and their star rating  
    for(let x of movies){
        if(x.title == movieTitle){
            for(let reviews of x.reviews){
                if(reviews.owner == requestingUser){
                    return;
                }
            }
            let new_review = {
                starRating: starRating,
                longReview: longReview,
                owner: requestingUser,
            }
            x.reviews.push(new_review);
            requestingUser.reviews.push(new_review)
        }
    }
}

function setContributingUser(requestingUser){       //sets a normal user to a contributing user
    requestingUser.contributingUser = true;
    return requestingUser;
}

/*
Assumption: we are given the actors name age and his occupation 
inputs: name, age, job type
outputs: none, will push the object onto actor array 
*/
function createActor(request_actorname,request_actorage,actortype){     
    for(let x of actors){           //checking to see if any actors have the same name ie they are the same
        if(x.name == request_actorname){
            console.log("ERROR");
            return null;
        }
    }
    let new_actor = {
        actorname: request_actorname,
        actorage: request_actorage,
        moviesplayed: [],
        actortype: actortype
    };
    actors.push(new_actor);
}
/*
Assumption: given a actor name
inputs: actor's name AKA his id
outputs: the actor which contains that name / ID
*/
function get_actor(request_actorname){
    for(let x of actors){
        if(x.actorname === request_actorname){
            return x;
        }
    }
}

/*
Assumption: reccomendations are based on movies that share the same genre
inputs: genre, the movie on that specific page (so we don't get duplicate)
outputs: an array of movies
*/
function getrecommendedMovies(genre,selfmovie){   //this will go into the movies array and gather all of the movies that have the same genre to reccomend to the user
    let results =[];
    for(let x of movies){
        if(x.genre == genre && x.title != selfmovie.title){
            results.push(x);
        }
    }
    return results;
}
//provided with the actor id aka the string
function getRecommendedActors(actor){ //will get all the actors that this particular actor has been with in the past by going through all the movies and if an movie actor array contains that specific actor, the whole array will be copied minus the parts where there are duplicates
    let results = [];
    let requestingactor = get_actor(actor);
    for(eachmovie of movies){
        if(eachmovie.actors.includes(requestingactor)){
            for(eachactor of eachmovie.actors){
                if(eachactor.actorname != requestingactor.actorname){
                    results.push(eachactor);
                }
            }
        }
    }
    return results;
}

/*
Assumption: called when a user adds a specific actor to a movie
inputs: actor and the movie 
outputs: nothing, appends to arrays
*/
function addActor(actor, movie){
    movie.actors.push(actor);           //adds them to the movies cast
    actor.moviesplayed.push(movie)      //adds the movie to the actors resume
}
/*
Assumption: requesting user wants to know their followers
inputs: requesting user
outputs: their followers
*/
function getFollowers(requestingUser){
    return requestingUser.followers;
}
/*
Assumption: requesting user wants to know who they are following
inputs: requesting user
outputs: their following
*/
function getFollowing(requestingUser){
    return requestingUser.following;
}

console.log("Testing some of our functionality");
let user_1 = createUser({username: "Adrian", password: "cheung"});
let user_2 = createUser({username: "nigdrian", password: "cheung"});
let user_3 = createUser({username: "eric", password: "cheung"});
let user_4 = createUser({username: "dave", password: "cheung"});
let user_5 = createUser({username: "n", password: "cheung"});
let user_6 = createUser({username: "n", password: "cheung"});
//FOR TESTING PURPOSES I HAVE COMMENTED THESE OUT IN ORDER TO NOT CLOG MY SCREEN. FEEL FREE TO UNCOMMENT AND TRY THESE FUNCTIONS OUT THEY ALL WORK ACCORDINGLY 
//for(let i = 0; i < users.length; i++){
  //  console.log(users[i]);
//}
/*
console.log(get_user(3));
console.log("Testing the searching functionality");
console.log(search_users("A"));

console.log("testing the follow and unfollow ability");
follow(get_user(3),get_user(1));      //get one of them to follow
follow(get_user(1),get_user(3));      //get one of them to follow
console.log("someone unfollowed someone")   
unfollow(get_user(3),get_user(1));    //should return empty arrays
follow(get_user(3),get_user(1));      //get one of them to follow them again

console.log("now we make someone make a movie");
setContributingUser(get_user(1));
console.log(get_user(1));
console.log(movies);
//console.log(get_user(1));
console.log("created movie");
createMovie(get_user(1),"AVATAR", "1999", "200", "SPACE ALIENS", "SCI FI", "");
console.log(get_user(1));
console.log(movies);
//console.log(get_user(1));

createReview(get_user(1),"AVATAR",5,"this movie is pretty cool")
console.log(movies[0].reviews);     //testing to see if this actually works
console.log(searchMovie("AVATAR"));
console.log(getMovie(-1));

createReview(get_user(1),"AVATAR",5,"this movie is pretty cool")
console.log(movies[0].reviews);     //testing to see if we can add 2 of the same reviews or not (we shouldn't)
console.log(searchMovie("AVATAR"));
console.log(getMovie(-1));

//creating an actor
console.log("creating a new actor");
createActor("Adam ferro", 19);
console.log(actors);
console.log("getting actor name with adam ferro");
console.log(get_actor("Adam ferro"));
*/

follow(get_user(3),get_user(1));      //get one of them to follow
console.log(getFollowers(get_user(1)));
setContributingUser(get_user(1));
let actor_1 = createActor("Adam Ferro",19,"actor");
let actor_2 = createActor("John Cena",99,"producer");
createMovie(get_user(1),"AVATAR", "1999", "200", "SPACE ALIENS", "SCI FI");
console.log(movies);
addActor(get_actor("Adam Ferro"), getMovie(-1));
addActor(get_actor("John Cena"), getMovie(-1));
console.log("printing out all the actors from the movie AVATAR")
console.log(getMovie(-1).actors);
console.log("we will find actors that adam ferro has worked with");
console.log(getRecommendedActors("Adam Ferro"));
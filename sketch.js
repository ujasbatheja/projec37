var gameState = 0;
var dog, dogImage;
var foodImage, foodObj;
var database, position;
var foodStock, globalLastFed;
var foodStockButton, addFoodButton;
var garden, gardenImage, bedroom, bedroomImage, washroom, washrooomImage;

function preload(){     
  dogImage = loadImage("images/dogimg1.png");
  gardenImage = loadImage("images/Garden.png");
  bedroomImage = loadImage("images/Bed Room.png");
  washroomImage = loadimage("images/Wash Room.png");

  //foodImag = loadImage("images/Milk.png");
}

function setup() {
  createCanvas(500,500);

  game = new Game();
  game.getGameState();

  readGameState = database.ref("gameState");
  readGameState.on("value",function(data){
    gameState = data.val();
  });

  function update(state){
    database.ref("/").update({
      gameState:state
    });
  }

  dog = createSprite(250,250,5,5);
  dog.scale = 0.3;
  dog.addImage("dogImage",dogImage);

  database = firebase.database();

  foodObj = new Food();
  
  foodStockRef = database.ref("food/qty");
  foodStockRef.on("value",function(data){ 
  foodStock = data.val();})
  foodObj.foodStock

  feedButton = createButton("Feed the dog");
  feedButton.position(450,95);

  

  addFoodButton = createButton("Add Food")
  addFoodButton.position(550,95);

}

function draw() {  
  background(46,139,87);

  currentTime = hour();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime==(lastFed+2)){
    update("Sleeping");
    foodObj.bedroom();
  }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry");
    foodObj.display();
  }

  foodObj.foodStock = foodStock;

  feedButton.mousePressed(feedDog);

  addFoodButton.mousePressed(addFoods);

   foodObj.display();
   //milk.display();

  drawSprites();
}

function feedDog(){
  var tmp=foodObj.getFoodStock()-1;
  foodObj.updateFoodStock(tmp);
  console.log(tmp);
  foodObj.lastFed = hour();
  globalLastFed = foodObj.lastFed;
  console.log("globalLastFed"+globalLastFed);
  database.ref("/").update({
    lastFedTime: foodObj.lastFed
  })
}

function addFoods(){
  foodStock++;
  foodObj.updateFoodStock(foodStock);
  /*database.ref("/").update({
    Food:foods
  })*/
}

function update(state){
  database.ref("/").update({
    gameState:state
  })
}
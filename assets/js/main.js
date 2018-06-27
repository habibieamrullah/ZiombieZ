//SCREEN VARS
var baseWidth = 1280;
var screenRatio = window.innerWidth/window.innerHeight;
var gameHeight = baseWidth/screenRatio;
var gameScaleRatio = 1;

//PHASER VAR
var game = new Phaser.Game(baseWidth, gameHeight, Phaser.AUTO);

//game level vars
var appData = {};
if(localStorage.getItem("ziombiezAppData") === null){
	appData = {
		level : 1,
		score : 0
	};
	localStorage.setItem("ziombiezAppData",JSON.stringify(appData));
}else appData = JSON.parse(localStorage.getItem("ziombiezAppData"));

// HOWLER audio vars
var stonehitAudio = new Howl({
  src: ['assets/enemyhit.mp3']
});
var blastAudio = new Howl({
  src: ['assets/blast.mp3']
});
var beepAudio = new Howl({
  src: ['assets/beep.mp3']
});
var gameoverAudio = new Howl({
  src: ['assets/gameover.mp3']
});
var slingshotAudio = new Howl({
  src: ['assets/slingshot.mp3']
});
var hurtAudio = new Howl({
  src: ['assets/hurt.mp3']
});
var levelupAudio = new Howl({
  src: ['assets/levelup.mp3']
});
var aghAudio = new Howl({
  src: ['assets/agh.mp3']
});

//game vars
var player, bullets, fireRate, nextFire, enemies, enemiesRate, nextEnemy, enemiesKilled, enemiesKillTarget, maxEnemySpeed, enemyStrength, nextBomb, bombRate;

var baseBombRate = 60000;
var baseFireRate = 600;
var baseEnemiesRate = 800;
var baseMaxEnemySpeed = 3;
var baseMinEnemySpeed = 1;
var baseEnemiesKillTarget = 3;
var baseEnemyStrength = 1;


function checkLevel(level){
	fireRate = baseFireRate / (level/4);
	enemiesRate = baseEnemiesRate / (level/10);
	maxEnemySpeed = baseMaxEnemySpeed * (level/10);
	enemiesKillTarget = baseEnemiesKillTarget * (level/2);
	enemyStrength = baseEnemyStrength * (level/5);
	bombRate = baseBombRate / (level/5);
	qudsHealth = 5;
	nextFire = 0;
	nextEnemy = 0;
	nextBomb = 0;
	enemiesKilled = 0;
}

var ZKGame = {};

ZKGame.LogoIntro = {
	preload : function(){
		game.load.image("logo", "assets/logo.png");
	},
	create : function(){
		game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
		game.stage.backgroundColor = "#ffffff";
		game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
		zkLogo = game.add.sprite(game.world.centerX, game.world.centerY, "logo");
		zkLogo.anchor.setTo(.5, .5);
		zkLogo.scale.setTo(gameScaleRatio);
		zkLogo.inputEnabled = true;
		setTimeout(function(){
			game.state.start("Menu");
		}, 4000);
	}
}

ZKGame.Menu = {
	preload : function(){
		game.load.image("ziombiez", "assets/ziombiez.png");
		game.load.image("ruinbg", "assets/ruinbg.jpg");
	},
	create : function(){
		beepAudio.play();
		game.stage.backgroundColor = "#000";
		
		ruinbg = game.add.sprite(0, 0, "ruinbg");
		var tempRbgWidth = ruinbg.width;
		var tempRbgHeight = ruinbg.height;
		ruinbg.width = game.width;
		ruinbg.height = ruinbg.width / (tempRbgWidth / tempRbgHeight);
		
		ziombiez = game.add.sprite(game.width/2, game.height/2 - (100 * gameScaleRatio), "ziombiez");
		ziombiez.anchor.setTo(.5, .5);
		ziombiez.scale.setTo(gameScaleRatio);
		
		text3 = game.add.text(game.width/2, game.height/2 + (60 * gameScaleRatio), "Play", {fill : "#ffffff"});
		text2 = game.add.text(game.width/2, game.height/2 + (110 * gameScaleRatio), "Settings", {fill : "#ffffff"});
		text1 = game.add.text(game.width/2, game.height/2 + (160 * gameScaleRatio), "About", {fill : "#ffffff"});
		
		
		text1.anchor.setTo(.5, .5);
		text2.anchor.setTo(.5, .5);
		text3.anchor.setTo(.5, .5);
		
		text1.inputEnabled = true;
		text1.events.onInputDown.add(this.blue);
		
		text2.inputEnabled = true;
		text2.events.onInputDown.add(this.red);
		
		text3.inputEnabled = true;
		text3.events.onInputDown.add(this.startgame);
	},
	
	blue : function(){
		game.state.start("Blue");
	},
	
	red : function(){
		game.state.start("Red")
	},
	
	startgame : function(){
		game.state.start("MainGamePlay")
	}
}

ZKGame.Blue = {
	preload : function(){
		game.load.image("ruinbg", "assets/ruinbg.jpg");
	},
	create : function(){
		beepAudio.play();
		ruinbg = game.add.sprite(0, 0, "ruinbg");
		var tempRbgWidth = ruinbg.width;
		var tempRbgHeight = ruinbg.height;
		ruinbg.width = game.width;
		ruinbg.height = ruinbg.width / (tempRbgWidth / tempRbgHeight);
		
		aboutText = game.add.text(game.width/2, game.height/2 - (25 * gameScaleRatio), "Coded by Habibie at ZofiaKreasi.com", {font: "18px Arial", fill: "#fff"});
		aboutText.anchor.setTo(.5, .5);
		
		backText = game.add.text(game.width/2, game.height/2 + (25 * gameScaleRatio), "Back", {fill : "#fff"});
		backText.anchor.setTo(.5, .5);
		backText.inputEnabled = true;
		backText.events.onInputDown.add(this.go);
	},
	
	go : function(){
		game.state.start("Menu");
	}
}

ZKGame.Red = {
	preload : function(){
		game.load.image("ruinbg", "assets/ruinbg.jpg");
	},
	create : function(){
		beepAudio.play();
		ruinbg = game.add.sprite(0, 0, "ruinbg");
		var tempRbgWidth = ruinbg.width;
		var tempRbgHeight = ruinbg.height;
		ruinbg.width = game.width;
		ruinbg.height = ruinbg.width / (tempRbgWidth / tempRbgHeight);
		
		resetButton = game.add.text(game.width/2, game.height/2 - (25 * gameScaleRatio), "Reset Game", {fill : "#fff"});
		resetButton.anchor.setTo(.5, .5);
		resetButton.inputEnabled = true;
		resetButton.events.onInputDown.add(this.resetGame);		
		
		backText = game.add.text(game.width/2, game.height/2 + (25 * gameScaleRatio), "Back", {fill : "#fff"});
		backText.anchor.setTo(.5, .5);
		backText.inputEnabled = true;
		backText.events.onInputDown.add(this.go);
	},
	go : function(){
		game.state.start("Menu");
	},
	resetGame : function(){
		localStorage.removeItem("ziombiezAppData");
		location.reload();
	}
}

ZKGame.GameOver = {
	preload : function(){
		game.load.image("ruinbg", "assets/ruinbg.jpg");
	},
	create : function(){
		gameoverAudio.play();
		ruinbg = game.add.sprite(0, 0, "ruinbg");
		var tempRbgWidth = ruinbg.width;
		var tempRbgHeight = ruinbg.height;
		ruinbg.width = game.width;
		ruinbg.height = ruinbg.width / (tempRbgWidth / tempRbgHeight);
		
		gameOverText = game.add.text(game.width/2, game.height/2 - 40, "GAME OVER", {fill : "#ffffff"});
		gameOverText.anchor.setTo(.5, .5);
		backText = game.add.text(game.width/2, game.height/2 + 40, "Main Menu", {fill : "#ffffff"});
		backText.anchor.setTo(.5, .5);
		backText.inputEnabled = true;
		backText.events.onInputDown.add(this.backToMenu);
		retryText = game.add.text(game.width/2, game.height/2 + 80, "Retry", {fill : "#ffffff"});
		retryText.anchor.setTo(.5, .5);
		retryText.inputEnabled = true;
		retryText.events.onInputDown.add(this.retryGame);
	},
	backToMenu : function(){
		game.state.start("Menu");
	},
	retryGame : function(){
		game.state.start("MainGamePlay");
	}
}

ZKGame.LevelComplete = {
	create : function(){
		game.stage.backgroundColor = "#ff0000";
		levelCompleteText = game.add.text(game.world.centerX * gameScaleRatio, game.world.centerY * gameScaleRatio, "LEVEL COMPLETE", {fill : "#ffffff"});
		backText = game.add.text(10, 10, "Back", {fill : "#ffffff"});
		backText.inputEnabled = true;
		backText.events.onInputDown.add(this.backToMenu);
		retryText = game.add.text(10, 50, "Retry Level", {fill : "#ffffff"});
		retryText.inputEnabled = true;
		retryText.events.onInputDown.add(this.retryGame);
		nextLevelText = game.add.text(10, 100, "Next Level", {fill : "#ffffff"});
		nextLevelText.inputEnabled = true;
		nextLevelText.events.onInputDown.add(this.nextLevel);
	},
	backToMenu : function(){
		game.state.start("Menu");
	},
	retryGame : function(){
		appData.level -= 1;
		game.state.start("MainGamePlay");
	},
	nextLevel : function(){
		game.state.start("MainGamePlay");
	}
}

ZKGame.MainGamePlay = {
	preload : function(){
		checkLevel(appData.level);
		game.load.image("background", "assets/background.png");
		game.load.spritesheet('player', 'assets/player.png', 114.25, 152);
		game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
		game.load.spritesheet('jeger', 'assets/superexplode.png', 128, 152);
		game.load.spritesheet('enemy', 'assets/enemy.png', 94, 128);
		game.load.image('bullet', 'assets/bullet.png');
		game.load.image('bombButton', 'assets/bombButton.png');
		game.load.image('backButton', 'assets/back.png');
		game.load.image('pauseButton', 'assets/pause.png');

	},
	create : function(){
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 100*gameScaleRatio;
		game.stage.backgroundColor = "#647872";
		
		background = game.add.sprite(0, game.height, "background");
		background.scale.setTo(gameScaleRatio, gameScaleRatio);
		background.anchor.setTo(0, 1);
		
		player = game.add.sprite(50*gameScaleRatio, game.height-100*gameScaleRatio, "player");
		player.scale.setTo(gameScaleRatio, gameScaleRatio);
		player.anchor.setTo(0, 1);
		shoot = player.animations.add("shoot");
		
		//in game texts
		scoreText = game.add.text(20, 20, "SCORE : ", {font : "20px Arial", fill : "#ffffff"});
		currentLevelText = game.add.text(20, 45, "Level = " + appData.level, {font: "14px Arial", fill : "#ffffff"});
		qudsHealthText = game.add.text(20, 65, "Life", {font: "14px Arial", fill : "#ffffff"});
		enemiesToKillText = game.add.text(20, 85, "Enemies to kill: ", {font: "14px Arial", fill : "#ffffff"});
		
		//end of in game texts
		
		bullets = game.add.group();
		bullets.enableBody = true;
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		game.physics.enable(bullets, Phaser.Physics.ARCADE);

		bullets.createMultiple(50, 'bullet');
		bullets.setAll('checkWorldBounds', true);
		bullets.setAll('outOfBoundsKill', true);
		bullets.physicsBodyType = Phaser.Physics.ARCADE;
		
		enemies = game.add.group();
		enemies.enableBody = true;
		enemies.createMultiple(50, "enemy");		
		enemies.forEach(setupZAnim);
		
		explosions = game.add.group();
		explosions.createMultiple(30, "kaboom");
		explosions.forEach(setupExp);
		
		superexplosions = game.add.group();
		superexplosions.createMultiple(50, "jeger");
		superexplosions.forEach(setupSuperExp);
		
		bombButton = game.add.sprite(game.width - 50, -100, "bombButton");
		bombButton.anchor.setTo(.5, .5);
		bombButton.scale.setTo(gameScaleRatio);
		bombButton.inputEnabled = true;
		bombButton.events.onInputDown.add(this.killAllEnemies);
		
		levelUpText = game.add.text(game.width/2, -100, "LEVEL UP", {font : "60px Arial", fill : "#ffffff"});
		levelUpText.anchor.setTo(.5, .5);
		
		lastLevel = appData.level;
		levelUpShown = false;
		
		backButton = game.add.sprite(0, game.height, "backButton");
		backButton.anchor.setTo(0, 1);
		backButton.inputEnabled = true;
		backButton.events.onInputDown.add(this.backToMenu);
		
		pauseButton = game.add.sprite(game.width, game.height, "pauseButton");
		pauseButton.anchor.setTo(1, 1);
		pauseButton.inputEnabled = true;
		pauseButton.events.onInputDown.add(this.pauseGame);
		
		pauseText = game.add.text(game.width/2, -100, "PAUSED", {font : "60px Arial", fill : "#ffffff"});
		pauseText.anchor.setTo(.5, .5);
		
		game.input.onDown.add(this.resumeGame);
	},
	update : function(){
		if(game.input.activePointer.isDown && game.input.activePointer.x > player.x + (100*gameScaleRatio)){
			fire();
		}
		if(player.animations.currentAnim.isFinished) player.animations.currentAnim.stop(true);
		game.physics.arcade.overlap(bullets, enemies, collisionHandler, null, this);
		
		scoreText.setText("SCORE : " + thousandSep(appData.score));
		
		//update fire rotation
		rotateStone();
		
		//show bombButton
		this.showBombButton();
		
		if(appData.level > lastLevel){
			if(!levelUpShown){
				levelupAudio.play();
				levelUpText.y = game.height/2;
				levelUpShown = true;
			}
			if(levelUpText.y > -100) levelUpText.y -= 3;
			else{
				levelUpShown = false;
				lastLevel = appData.level;
			}
		}
		
		
		//enemy1
		createEnemies(); 
		updateEnemies();
		enemies.sort('y', Phaser.Group.SORT_ASCENDING);
		//end of enemy1
		
		qudsHealthText.setText("Life: " + qudsHealth);
		currentLevelText.setText("Level: " + appData.level);
		enemiesToKillText.setText("Enemies to kill: " + Math.ceil(enemiesKillTarget - enemiesKilled));
	},
	backToMenu : function(){
		game.state.start("Menu");
	},
	killAllEnemies : function(){ 
		killAllEnemies();
		bombButton.position.y = -50;
		nextBomb = game.time.now + bombRate;
	},
	showBombButton : function(){
		if(game.time.now > nextBomb){
			bombButton.position.y = 50;
		}
		
	},
	pauseGame : function(){
		beepAudio.play();
		game.paused = true;
		pauseText.y = game.height/2;
	},
	resumeGame : function(){
		if(game.paused){
			pauseText.y = -100;
			game.paused = false;
		}
	}
}

game.state.add("MainGamePlay", ZKGame.MainGamePlay);
game.state.add("LogoIntro", ZKGame.LogoIntro)
game.state.add("Menu", ZKGame.Menu)
game.state.add("Blue", ZKGame.Blue)
game.state.add("Red", ZKGame.Red)
game.state.add("GameOver", ZKGame.GameOver)
game.state.add("LevelComplete", ZKGame.LevelComplete)
game.state.start("LogoIntro");

//first wait until ready
setTimeout(function(){
	$("body").fadeIn();
}, 1234)

//game functions

//fire
function fire(){
	if (game.time.now > nextFire && bullets.countDead() > 0){
        nextFire = game.time.now + fireRate;
        bullet = bullets.getFirstDead();
        bullet.reset(player.x+(70*gameScaleRatio), player.y-(100*gameScaleRatio));
		bullet.scale.setTo(gameScaleRatio/2);
		bullet.anchor.setTo(.5, .5);
        game.physics.arcade.moveToPointer(bullet, (Math.floor(Math.random()*650)+550)*gameScaleRatio);
		player.animations.play("shoot", 30, false);
		slingshotAudio.play();
    }
}

//create enemies
function createEnemies(){
	if(game.time.now > nextEnemy && enemies.countDead() > 0){
		nextEnemy = game.time.now + enemiesRate;
		enemy = enemies.getFirstDead();
		enemy.reset(Math.floor(Math.random() * game.width+10) + game.width, game.height - ((Math.floor(Math.random() * 100) + 50))*gameScaleRatio);
		var randomSpeed = Math.floor(Math.random() * maxEnemySpeed) + baseMinEnemySpeed;
		enemy.speed = randomSpeed;
		enemy.currentHealth = enemyStrength;
		enemy.scale.setTo(gameScaleRatio + (Math.random() * .15));
		enemy.anchor.setTo(.5, .5);
		enemy.body.allowGravity = false;
		enemy.animations.currentAnim.stop(true);
		enemy.animations.play("walk", randomSpeed * 5, true);
	}
}

//collisionHandler
function collisionHandler(bullet, enemy){
	bullet.kill();
    var explosion = explosions.getFirstExists(false);
    explosion.reset(bullet.x, bullet.y);
    explosion.play('kaboom', Math.floor(Math.random()*35) + 25, false, true);
	enemy.currentHealth -= 1;
	stonehitAudio.play();
	if(enemy.currentHealth < 0){
		enemy.kill();
		aghAudio.play();
		enemiesKilled += 1;
		appData.score += 1;
		if(enemiesKilled >= enemiesKillTarget){
			//LEVEL UP
			appData.level += 1;
			localStorage.setItem("ziombiezAppData", JSON.stringify(appData));
			checkLevel(appData.level);
		}
	}
}

//setupExp
function setupExp(x) {
    x.anchor.setTo(.5, .5);
	x.scale.setTo(gameScaleRatio);
    x.animations.add('kaboom');
}

//setupSuperExp
function setupSuperExp(x) {
    x.anchor.setTo(.5, .5);
	x.scale.setTo(gameScaleRatio);
    x.animations.add('jeger');
}

//setupZAnim
function setupZAnim(x){
	x.anchor.setTo(.5, .5);
	x.animations.add("walk");
}

//updateEnemies
function updateEnemies(){
	for(var i = 0; i < enemies.children.length; i++){
		if(enemies.children[i].body.x < 0){
			enemies.children[i].reset(Math.floor(Math.random() * game.width+10) + game.width, game.height - ((Math.floor(Math.random() * 100) + 50))*gameScaleRatio);
			qudsHealth -= 1;
			hurtAudio.play();
			if(qudsHealth <= 0){
				game.state.start("GameOver");
			}
		}
		else enemies.children[i].x -= enemies.children[i].speed;
	}
}

//kill all enemies
function killAllEnemies(){	
	for(var i = 0; i < enemies.children.length; i++){
		blastAudio.play();
		if(enemies.children[i].alive){
			var superexplosion = superexplosions.children[i];
			superexplosion.reset(enemies.children[i].x, enemies.children[i].y);
			superexplosion.play("jeger", Math.floor(Math.random()*35) + 25, false, true);
		}
		enemies.children[i].kill();
	}
}

//rotate stone
function rotateStone(){
	for(var i = 0; i < bullets.children.length; i++){
		bullets.children[i].angle += 5;
	}
}

//thousandSep
function thousandSep(number){
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
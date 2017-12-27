$(document).ready(function() {
	$('.levelcleared').hide();
	$('.gameover').hide();
	$('.gamefinished').hide();
	$('.scorescreen').hide();
	$('.startbutton').click(function(){
		main();
	});
	//main();
});

//var display;

function loadCanvas(id){
	console.log('loadCanvas');
	//$(id).replaceWith('<canvas id="subcanvas" height="200" width="400"> </canvas>');
	//display = new Screen(552, 650);
}

var display, input, frames, spFrame, lvFrame;
var alSprite, taSprite, ciSprite;
var aliens, dir, tank, bullets, cities, crabs;
var jellyfishs;

//var bgSprite;
var seaweedSprite;
var squidSprite;
var pirayaSprite;
var pirayaLeftSprite;
var jellyfishSprite;

var score = 0;
var stage = 0;
var enemyCounter;
var damageCounter;
var indicators;
var checkCondition;

function main(){
	display = new Screen(552, 650);
	input = new InputHandler();

	var img = new Image();
	img.addEventListener("load", function(){
		alSprite = [
			[new Sprite(this, 0, 0, 22, 16), new Sprite(this, 0, 16, 22, 16)],
			[new Sprite(this, 22, 0, 16, 16), new Sprite(this, 22, 16, 16, 16)],
			[new Sprite(this, 38, 0, 24, 16), new Sprite(this, 38, 16, 24, 16)]
		];
		//taSprite = new Sprite(this, 50, 0, 50, 50);  // obåten
		//taRightSprite = new Sprite(this, 0, 0, 50, 50);  // obåten
		taSprite = new Sprite(this, 66, 0, 50, 50);  // obåten
		taRightSprite = new Sprite(this, 116, 0, 50, 50);  // obåten
		
		//ciSprite = new Sprite(this, 86, 8, 36, 24);
		//bgSprite = new Sprite(this, 0, 8, 552, 650);
		seaweedSprite = new Sprite(this, 294, 0 ,119, 64);
		crabSprite = new Sprite(this, 0, 0, 66, 50);
		squidSprite = new Sprite(this, 0, 66, 66, 64);
		pirayaSprite = new Sprite(this, 166,0,64, 64);
		pirayaLeftSprite = new Sprite(this, 232, 0 ,64, 64);
		jellyfishSprite = new Sprite(this, 66, 56, 119, 64);

		init(0);
		run();
	});
	//img.src = "res/spSquidCrab.png";
	img.src = "res/spSquidCrab2.png";

}

function init(levelNum){

	frames = 0;
	spFrame = 0;
	lvFrame = 60;  // faster! -> 20
	dir = 1;
	//score = 0;
	enemyCounter = conditions.numOfEnemies[levelNum];
	damageCounter = 0;
	checkCondition = true;

	displayEnemiesLeft();

	tank = {
		sprite: taSprite,
		x: (display.width - taSprite.w) /2,
		y: display.height - (250 + taSprite.h),
		dirLeft: true
	};

	crabs = [];
	pirayas = [];
	jellyfishs = [];

	// for(var i=0; i<6; i++){
	// 	crabs.push({
	// 		sprite : crabSprite,
	// 		x: i*100,
	// 		y: (i*20) + 200,
	// 		w: 64,
	// 		h: 48
	// 	});
	// }
	// hämta level-objektet för krabbor
	var levCrab = levels[levelNum].filter(function ( obj ) {
	    return obj.type === 'crab';
	})[0];
	for(var k=0; k<levCrab.number; k++){
		crabs.push({
			sprite : crabSprite,
			x: levCrab.posx[k],
			y: levCrab.posy[k],
			w: 64,
			h: 48
		});
	}
	
	// hämta level-objektet för pirayor
	var levPiraya = levels[levelNum].filter(function ( obj ) {
	    return obj.type === 'piraya';
	})[0];
	console.log('levPiraya: ' + levPiraya.type);
	for(var j=0; j<levPiraya.number; j++){
		pirayas.push({
			sprite : pirayaSprite,
			x: levPiraya.posx[j],
			y: levPiraya.posy[j],
			w: 64,
			h: 64
		});
	}

	var levJelly = levels[levelNum].filter(function ( obj ) {
	    return obj.type === 'jellyfish';
	})[0];
	console.log('levlevJelly: ' + levJelly.type);
	for(var j=0; j<levJelly.number; j++){
		jellyfishs.push({
			sprite : jellyfishSprite,
			x: levJelly.posx[j],
			y: levJelly.posy[j],
			w: 48,
			h: 53
		});
	}

	bullets = [];

	indicators = [];
	for(var k=0; k<3; k++){
		indicators.push(new Indicator( ((display.width / 2) - 30) + (30*k), 20, k, 'red'));
	}

	aliens = [];
	var rows = [1, 0, 0, 2, 2];
	for(var i = 0, len = rows.length; i < len; i++){
		for(var j = 0; j < 10; j++){
			var a = rows[i];
			aliens.push({
				sprite: alSprite[a],
				x: 30 + j*30 + [0, 4, 0][a],
				y: 30 + i*30,
				w: alSprite[a][0].w,
				h: alSprite[a][0].h,
			});
		}
	}
}

//'***************
function run(){
	var loop = function(){
		update();
		render();
		// kolla slutvillkor / klarat level
		if(checkCondition && crabs.length + pirayas.length == 0){
			console.log('LEVEL CLEAR!');
			checkCondition = false;
			stage++;
			nextStage(stage);  // initiera nästa nivå samt visa meddelande
		}
		// kolla om ubåten sjunkit (alla tre liv slut), bryt loopen isf
		if(damageCounter > 120){
			gameOver();
			return false;
		}
		// kolla om alla banor avklarade
		if(stage === conditions.MAXLEVEL){
			gameFinished(updateScore);
			return false;
		}
		window.requestAnimationFrame(loop, display.canvas);
	};
	window.requestAnimationFrame(loop, display.canvas);
}
//****************

function update(){
	
	if(input.isDown(37)){  // left
		console.log('going left...');
		tank.sprite = taSprite;
		tank.dirLeft = true;
		tank.x -=  4; 
	}
	if(input.isDown(39)){  // right
		console.log('going right...');
		tank.sprite = taRightSprite;
		tank.dirLeft = false;
		tank.x +=  4; 
	}
	if(input.isDown(40)){  // up
			console.log('going up...');
		tank.y +=  4; 
	}
	if(input.isDown(38)){  // down
		console.log('going down...');
		tank.y -=  4; 
	}
	if(input.isPressed(32)){
		console.log('space pressed');
		// bullets.push(new Bullet(tank.x, tank.y+30, -8, 10, 6, "#000"));
		if(tank.dirLeft){
			bullets.push(new Bullet(tank.x, tank.y+30, 0,-8,0, 10, 6, "#006400"));
		}
		else {
			bullets.push(new Bullet(tank.x, tank.y+30, 0, 0, 8, 10, 6, "#006400"));
		}
		
	}

	for(var i = 0, len = bullets.length; i < len; i++){
		var b = bullets[i];
		if(b){
			b.update();

			// bullet tas bort om den går utanför skärmen
			if(b.x + b.width < 10 || b.x > display.width-10){
				bullets.splice(i, 1);
				i--;
				len--;
				continue;
			}
			// Check if pirayas are hit
			for(var j=0; j<crabs.length; j++){
				if(AABBIntersect(b.x, b.y, b.width, b.height, crabs[j].x, crabs[j].y, crabs[j].w, crabs[j].h)){
					console.log('HIT!');
					crabs.splice(j, 1);
					bullets.splice(i, 1);
					updateScore('crab');
				}
			}
			// Check if pirayas are hit
			for(var j=0; j<pirayas.length; j++){
				if(AABBIntersect(b.x, b.y, b.width, b.height, pirayas[j].x, pirayas[j].y, pirayas[j].w, pirayas[j].h)){
					console.log('HIT piraya!');
					pirayas.splice(j, 1);
					bullets.splice(i, 1);
					updateScore('piraya');
				}
			}
			// Check if pirayas are hit
			for(var j=0; j<jellyfishs.length; j++){
				if(AABBIntersect(b.x, b.y, b.width, b.height, jellyfishs[j].x, jellyfishs[j].y, jellyfishs[j].w, jellyfishs[j].h)){
					console.log('HIT jellyfish!');
					jellyfishs.splice(j, 1);
					bullets.splice(i, 1);
					updateScore('jellyfish');
				}
			}
		}
	}
	//kolla om ubåten kolliderar med fiende
	if(isSubHit([crabs, pirayas], tank) ){
		console.log('SUB is HIT!');
		damageCounter++;
	}
	
	// hindra att tanken åker utanför skärmen
	tank.x = Math.max(Math.min(tank.x, display.width - (30 + taSprite.w)), 30);
	tank.y = Math.max(Math.min(tank.y, display.height - (30 + taSprite.h))   , 30);

	frames++;
	if(frames % lvFrame === 0){
		spFrame = (spFrame + 1) % 2;

		var _max = 0, _min = display.width; 
		for(var i=0, len = aliens.length; i<len; i++){
			var a = aliens[i];
			a.x += 30 * dir;

			_max = Math.max(_max, a.x + a.w);
			_min = Math.min(_min, a.x);
		}
		if(_max > display.width || _min < 30) {
			dir *= -1;
			// for(var i=0, len = aliens.length; i<len; i++){
			// 		[i].x += 30 * dir;
			// 	aliens[i].y += 30;
			// }
		}
		//test jool
		if(crabs.length > 0){
			crabs[0].x += 30*dir;
			if(crabs.length > 3){
				crabs[3].x += 30*dir;
				crabs[2].x += 30*dir;
			}
		}
		
	}
	// move piraya
	for(var k=0; k<pirayas.length; k++){
		if(pirayas[k].x < display.width && dir > 0){
			pirayas[k].sprite = pirayaSprite;
			pirayas[k].x += 1;
		} 
		if(pirayas[k].x > -pirayas[k].w && dir < 0) {
			pirayas[k].sprite = pirayaLeftSprite;
			pirayas[k].x -= 1;
		}
	}

	//uppdatera livsindikatorn. Ett "liv" innebär ett antal hits, tex 50 hits = ett liv, 100 hits = två lev etc.
	for(var i=0; i<indicators.length; i++){
		indicators[i].update(damageCounter);
	}
}

//  **************
function render(){
		
	display.clear();
	display.drawSprite(seaweedSprite, 0, 590);
	display.drawSprite(seaweedSprite, 100, 590);
	display.drawSprite(seaweedSprite, 210, 590);
	display.drawSprite(seaweedSprite, 310, 586);

	//display.drawSprite(crabSprite, 200, 200);

	//display.drawSprite(squidSprite, 50, 50);
	//display.drawSprite(pirayaLeftSprite, 150, 50);
	//display.drawSprite(jellyfishSprite, 220, 50);

	//draw the aliens...
	// for(var i=0, len = aliens.length; i<len; i++){
	// 	var a = aliens[i];
	// 	display.drawSprite(a.sprite[spFrame], a.x, a.y);
	// }

	for(var i=0; i<crabs.length; i++){
		display.drawSprite(crabs[i].sprite,crabs[i].x, crabs[i].y );
	}

	for(var i=0; i<pirayas.length; i++){
		display.drawSprite(pirayas[i].sprite,pirayas[i].x, pirayas[i].y );
	}

	for(var i=0; i<jellyfishs.length; i++){
		display.drawSprite(jellyfishs[i].sprite,jellyfishs[i].x, jellyfishs[i].y );
	}

	display.ctx.save();
	for(var i = 0, len = bullets.length; i < len; i++){
		display.drawBullet(bullets[i]);
	}
	display.ctx.restore();

	display.drawSprite(tank.sprite, tank.x, tank.y);	

	for(var i=0; i<indicators.length; i++){
		display.drawIndicator(indicators[i]);
	}
}

//main();


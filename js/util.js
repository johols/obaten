// Helper functions

function AABBIntersect(ax, ay, aw, ah, bx, by, bw, bh){
	return ax < bx+bw && bx < ax+aw && ay < by+bh && by < ay+ah;
}

function isSubHit(enemyArr, sub){
	// Först loopa över alla fiendeslag, de är listade i arrayen
	for(var i = 0; i < enemyArr.length; i++){
		//för varje slags fiende, kolla om någon av dem träffar ubåten
		for (var j = 0; j < enemyArr[i].length; j++){
			if(AABBIntersect(sub.x, sub.y, sub.sprite.w, sub.sprite.h, enemyArr[i][j].x, enemyArr[i][j].y, enemyArr[i][j].w, enemyArr[i][j].h)){
				return true;
			}
		}
	}
	return false;
}

function updateScore(enemy){
	if(enemy === 'crab'){
		score += 100;
	}
	if(enemy === 'piraya'){
		score += 300;
	}
	if(enemy === 'jellyfish'){
		score += 150;
	}
	enemyCounter -= 1;
	$('.score').html('');
	$('.score').append('SCORE: ' + score);
	displayEnemiesLeft();
}

function displayEnemiesLeft(){
	$('.enemycounter').html('');
	$('.enemycounter').append('FIENDER: ' + enemyCounter);
}

// Visa och göm div:en med klarat-banan-texten. Vänta 5 sek, starta sedan nästa nivå.
function nextStage(level){
	$('.levelcounter').html('');
	$('.levelcounter').append('NIVÅ: ' + (level+1) );
	$('.levelcleared').fadeIn(2000).fadeOut(2000);
	setTimeout(function() { 
		init(level);
	}, 5000);		
}

function gameOver(){
	$('.gameover').fadeIn(2000);
}

// Show message and save score to localStorage
function gameFinished(){
	$('.gamefinished').fadeIn(2000);
	// store the score (if it is highscore)
	localStorage.setItem('scoreItem', score);
}

// toggle div
function toggleContent(content){
	console.log('toogle coountent');
	//$('.scorescreen').show();
	
	if(content === 'scorescreen'){
		$('.startscreen').html('');
		$('.startscreen').append('<div class="scorecontainer">HIGHSCORE: ' + localStorage.getItem('scoreItem') + '</div>');
	} 
	if(content === 'galleryscreen'){
		$('.startscreen').html('');
		$('.startscreen').append('<div class="scorecontainer">GALLERY</div>');
	} 
	if(content === 'aboutscreen'){
		$('.startscreen').html('');
		$('.startscreen').append('<div class="scorecontainer">ABOUT</div>');
	} 
	return false;
}
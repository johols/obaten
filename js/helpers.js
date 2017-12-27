// Helper functions

// function AABBIntersect(ax, ay, aw, ah, bx, by, bw, bh){
// 	return ax < bx+bw && bx < ax+aw && ay < by+bh && by < ay+ah;
// }

// Bullet
function Bullet(x, y, vely, velLeft, velRight, w, h, color){
	this.x = x;
	this.y = y;
	this.vely = vely;
	this.velLeft = velLeft;
	this.velRight = velRight;
	this.width = w;
	this.height = h;
	this.color = color;
};

Bullet.prototype.update = function(){
	// this.y += this.vely;
	this.x += this.velLeft;
	this.x += this.velRight;
};

// Indicator
function Indicator(x, y, num, color){
	this.x = x;
	this.y = y;
	this.num = num;
	this.color = color;
}

Indicator.prototype.update = function(hits){
	if(hits > 1 && hits < 50 && this.num == 2){
		this.color = 'lightgrey';
	}
	if(hits > 50 && this.num == 1){
		this.color = 'lightgrey';
	}
}
// Screen
function Screen(width, height){
	this.canvas = document.createElement("canvas");
	this.canvas.width = this.width = width;
	this.canvas.height = this.height = height;
	this.ctx = this.canvas.getContext("2d");

	//document.body.appendChild(this.canvas);
	document.getElementById('gamareaid').innerHTML = '';
	document.getElementById('gamareaid').appendChild(this.canvas);
};

Screen.prototype.clear = function(){;
	this.ctx.clearRect(0, 0, this.width, this.height)
};

Screen.prototype.drawSprite = function(sp, x, y){
	this.ctx.drawImage(sp.img, sp.x, sp.y, sp.w, sp.h, x, y, sp.w, sp.h);
};

Screen.prototype.drawBullet = function(bullet){
	this.ctx.fillStyle = bullet.color;
	this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
};

Screen.prototype.drawIndicator = function(indicator){
	
	// var cx1 = (this.canvas.width / 2) - 30;
	// var cx2 = this.canvas.width / 2;
	// var cx3 = (this.canvas.width / 2) + 30;
	var cy = 20;
	var radius = 10;
	
	this.ctx.beginPath();
    this.ctx.arc(indicator.x, indicator.y, radius, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = indicator.color;
    this.ctx.fill();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#003300';
    this.ctx.stroke();
}

// Sprite
function Sprite(img, x, y, w, h){
	this.img = img;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
};

// InputHandler

function InputHandler(){
	console.log('IputHandler...');
	this.down = {};
	this.pressed = {};

	var _this = this;
	document.addEventListener("keydown", function(evt){
		_this.down[evt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evt){
		delete _this.down[evt.keyCode];
		delete _this.pressed[evt.keyCode];
	});

};

InputHandler.prototype.isDown = function(code){
	// console.log('isDown fkn...' + code);
	return this.down[code];
};

InputHandler.prototype.isPressed = function(code){
	//console.log('isPressed fkn...' + code);
	if(this.pressed[code]){
		return false;
	} else if(this.down[code]) {
		return this.pressed[code] = true;
	}
	return false;
};
const gameHeight = 360
const gameWidth = 640


let gameScene = new Phaser.Scene('Game')

gameScene.init = function() {
    // player speed
    this.playerSpeed = 3;

    // enemy speed
    this.enemyMinSpeed = 2;
    this.enemyMaxSpeed = 4.5;

    // boundaries
    this.enemyMinY = 80;
    this.enemyMaxY = 280;
}

gameScene.preload = function() {
    //Load images
    this.load.image('background', 'assets/bg.png')
    this.load.image('player', 'assets/hero.png')
    this.load.image('enemy', 'assets/monster.png')
    this.load.image('treasure', 'assets/crate.png')
}

gameScene.create = function() {    
    this.add
        .sprite(0, 0, 'background')
        .setOrigin(0,0)

    this.player = this.add
        .sprite(50, 180, 'player')
        .setScale(0.6)

    this.treasure = this.add
        .sprite(600, 180, 'treasure')        
        .setScale(0.8)       

    this.enemies = this.add.group({
        key: 'enemy',
        repeat: 3,
        setXY: {
            x: 110,
            y: 100,
            stepX: 100,
            stepY: 20
        }
    })
    
    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.3, -0.3)

    Phaser.Actions.Call(this.enemies.getChildren(), enemy => {

        let direction = Math.random() < 0.5 ? 1 : -1;
        let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
        enemy.speed = direction * speed;
    }, this)
    console.log(this.enemies)
}


gameScene.update = function () {      
    if(this.input.activePointer.isDown || this.input.keyboard.addKey('right').isDown){
        this.player.x += this.playerSpeed
    }

    const playerRect = this.player.getBounds()
    const treasureRect = this.treasure.getBounds()
    if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)) {
        alert('GOAL!')
         // restart the Scene
        this.scene.restart();
        return;
    }

    
    this.enemies.getChildren().forEach(enemy => {
        enemy.y += enemy.speed

        let conditionUp = enemy.speed < 0 && enemy.y <= this.enemyMinY;
        let conditionDown = enemy.speed > 0 && enemy.y >= this.enemyMaxY;
        
        if(conditionUp || conditionDown) {
            enemy.speed = -enemy.speed
        }

        if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemy.getBounds())){
            this.scene.restart();
            return;
        }
    });
}

new Phaser.Game({ 
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    scene: gameScene
})
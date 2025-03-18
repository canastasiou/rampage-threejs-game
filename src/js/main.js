let gameScene, player, game, modal;
let lastTime = 0;

function init() {
    gameScene = new GameScene();
    game = new Game();
    modal = new Modal();

    // Initialize game with buildings
    game.init();

    // Create player after character selection
    const characterButtons = document.querySelectorAll('#character-select button');
    characterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const monsterType = button.dataset.monster;
            player = new Player(monsterType);
            gameScene.scene.add(player.mesh);
            modal.hide();
            animate();
        });
    });

    // Show welcome modal
    modal.show();
}

function animate(currentTime = 0) {
    requestAnimationFrame(animate);

    const delta = currentTime - lastTime;
    lastTime = currentTime;

    if (player) {
        player.update(delta);
    }

    gameScene.update();
}

init();
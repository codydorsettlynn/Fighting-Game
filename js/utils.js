function rectangularCollision
({
    rectangle1,
    rectangle2
}) 
{
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

let round = 0;
let round_length = 60;
let player_score = 0;
let enemy_score = 0;
let timer = 0;
let timerId;
let paused = false;
var sunDistance = -500;
var sunTint = 0;

document.querySelector('#timer').innerHTML = round_length;

function toggleAi(self, opponent)
{
    if(!self.ai)
    {
        self.ai = new ai({
            self: self,
            enemy: opponent,
        });
    }
    else
    {
        self.ai = false;
    }

    document.querySelector('#playerToggle').innerHTML = player.ai === false ? 'HUMAN' : 'AI';
    document.querySelector('#enemyToggle').innerHTML = enemy.ai === false ? 'HUMAN' : 'AI';
}

function startGame()
{
    startRound();
}

function startRound()
{
    round++;
    sunDistance = -500;
    sunTint = 0;
    document.querySelector('#roundNumber').innerHTML = "ROUND "+round;
    paused = true;

    player.restore();
    gsap.to('#playerHealth',
    {
        width: player.health + '%'
    });

    enemy.restore();
    gsap.to('#enemyHealth',
    {
        width: enemy.health + '%'
    });

    timer = round_length - 1;
    timerId = setInterval(() => {
        if(timer <= 0)
            determineWinner();
        document.querySelector('#timer').innerHTML = timer;
        timer--;
    }, 1000);

    document.querySelector('#displayText').style.display = 'flex';
    document.querySelector('#displayText').innerHTML = 'Fight!';

    setTimeout(() => {
        document.querySelector('#displayText').style.display = 'none';
    }, 2000);

    setTimeout(() => {
        paused = false;
    }, 500);
}

function determineWinner() 
{
    clearTimeout(timerId);

    document.querySelector('#displayText').style.display = 'flex';

    const retryButton = '<a onClick="startRound()" style="text-decoration: underline; font-size: 30px; margin-top: 40px;">NEXT ROUND</a>';

    if(player.health === enemy.health)
    {
        document.querySelector('#displayText').innerHTML = '<span style="font-size: 40px">Draw!</span>' + retryButton;
    } 
    else if(player.health > enemy.health)
    {
        document.querySelector('#displayText').innerHTML = '<span style="font-size: 30px">Sam Wins!</span>' + retryButton;
        player_score++;
        document.querySelector('#playerScore').innerHTML = player_score;
    }
    else if(player.health < enemy.health)
    {
        document.querySelector('#displayText').innerHTML = '<span style="font-size: 30px">Jim Wins!</span>' + retryButton;
        enemy_score++;
        document.querySelector('#enemyScore').innerHTML = enemy_score;
    } 

    setTimeout(() => {
        startRound();
    }, 3000);
}
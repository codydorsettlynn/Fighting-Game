const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

canvas.width = window.innerWidth
canvas.height = window.innerHeight

addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.25

const player = new Fighter
({
    position: 
    {
        x: 150,
        y: 200
    },
    startPosition: 
    {
        x: 150,
        y: 200
    },
    velocity: 
    {
        x: 0,
        y: 0
    },
    offset: 
    {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset:
    {
        x: 220,
        y: 157
    },
    sprites:
    {
        idle:
        {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run:
        {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump:
        {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall:
        {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1:
        {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit:
        {
            imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death:
        {
            imageSrc: './img/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox:
    {
        offset:
        {
            x: 75,
            y: 30
        },
        width: 140,
        height: 100
    },
    maxJumps: 1,
    jumpVelocity: -14,
    runVelocity: 3,
    damage: 15,
    framesHold: 12,
    ai: false,
    direction: 1,
})

const enemy = new Fighter
({
    position: 
    {
        x: canvas.width - 200,
        y: 200
    },
    startPosition: 
    {
        x: canvas.width - 200,
        y: 200
    },
    velocity: 
    {
        x: 0,
        y: 0
    },
    offset:
    {
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset:
    {
        x: 220,
        y: 170
    },
    sprites:
    {
        idle:
        {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4
        },
        run:
        {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8
        },
        jump:
        {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2
        },
        fall:
        {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2
        },
        attack1:
        {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit:
        {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3
        },
        death:
        {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox:
    {
        offset:
        {
            x: -175,
            y: 50
        },
        width: 160,
        height: 50
    },
    maxJumps: 2,
    jumpVelocity: -11,
    runVelocity: 4.5,
    damage: 10,
    framesHold: 10,
    ai: false,
    direction: -1,
})

const keys = 
{
    d: 
    {
        pressed: false
    },
    a: 
    {
        pressed: false
    },
    ArrowRight:
    {
        pressed: false
    },
    ArrowLeft:
    {
        pressed: false
    }
}

var ai_frame = 0;
var lastDelta = Date.now();

const bg = new Image();
bg.src = './img/background1.png';
const mg = new Image();
mg.src = './img/background2.png';
const fg = new Image();
fg.src = './img/background3.png';
const ground_sprite = new Image();
ground_sprite.src = './img/ground.png';
const sun = new Image();
sun.src = './img/sun.png';

function animate() 
{
    window.requestAnimationFrame(animate)
    const deltatime = (Date.now() - lastDelta) / 1000;
    if(timer > 0)
    {
        sunDistance += (((canvas.height / 2) + 400) / round_length) * deltatime;
        sunTint += (255 / round_length) * deltatime;
    }
    
    const ground = (canvas.height * 0.20) <= 100 ? 100 : (canvas.height * 0.20);

    // Gradients
    const gradientSky = c.createLinearGradient(0, 0, 0, canvas.height);
    gradientSky.addColorStop(0, '#457abb');
    gradientSky.addColorStop(1, '#97bcea');
    const gradientGround = c.createLinearGradient(0, 0, canvas.width, ground);
    gradientGround.addColorStop(0, '#3b1c0b');
    gradientGround.addColorStop(1, '#704129');

    // Sky
    c.fillStyle = gradientSky;
    c.fillRect(0, 0, canvas.width, canvas.height);

    c.drawImage(bg, 0, 0, canvas.width, canvas.height);
    c.drawImage(sun, canvas.width / 2 - 250, sunDistance);
    c.drawImage(mg, 0, 0, canvas.width, canvas.height);
    c.drawImage(fg, 0, 50, canvas.width, canvas.height);

    // Ground
    // c.fillStyle = gradientGround;
    // c.fillRect(0, canvas.height - ground, canvas.width, ground);
    for (let gi = 0; gi < canvas.width; gi += 200)
    {
        c.drawImage(ground_sprite, gi, canvas.height - ground);
    }

    c.fillStyle = 'rgba(255,'+(255 - sunTint)+', '+(255 - sunTint)+', 0.5)';
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

        if(player.ai === false)
        {
            //player movement
            if(keys.d.pressed && player.lastKey === 'd' && player.dying === false) 
            {
                player.velocity.x = player.runVelocity
                player.switchSprite('run')
            } 
            else if(keys.a.pressed && player.lastKey === 'a' && player.dying === false)
            {
                player.velocity.x = player.runVelocity * -1
                player.switchSprite('run')
            }
            else
            {
                player.switchSprite('idle')
            }
            
            // jumping
            if (player.velocity.y < 0 && player.dying === false)
            {
                player.switchSprite('jump')
            }
            else if (player.velocity.y > 0 && player.dying === false)
            {
                player.switchSprite('fall')
            }
        }
        else
        {
            if(ai_frame % 10)
            {
                player.ai.pathfind();
                player.ai.animate();
            }
        }

        if(enemy.ai === false)
        {
            //enemy movement
            if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight' && player.dying === false) 
            {
                enemy.velocity.x = enemy.runVelocity
                enemy.switchSprite('run')
            } 
            else if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' && player.dying === false)
            {
                enemy.velocity.x = enemy.runVelocity * -1
                enemy.switchSprite('run')
            }
            else
            {
                enemy.switchSprite('idle')
            }

            // jumping
            if (enemy.velocity.y < 0 && enemy.dying === false)
            {
                enemy.switchSprite('jump')
            }
            else if (enemy.velocity.y > 0 && enemy.dying === false)
            {
                enemy.switchSprite('fall')
            }
        }
        else
        {
            if(ai_frame % 10)
            {
                enemy.ai.pathfind();
                enemy.ai.animate();
            }
        }

    // Ive hit
    if(
        rectangularCollision({ rectangle1: player, rectangle2: enemy}) 
        && player.isAttacking === true
        && player.framesCurrent === 4
        && player.animation == 'attack1'
        && player.hasHit == false
    ){
        enemy.takeHit(player.damage);
        player.hasHit = true;

        gsap.to('#enemyHealth',
        {
            width: enemy.health + '%'
        });
    }
    // Ive missed
    else if(player.framesCurrent === 4 && player.isAttacking === true && player.hasHit === false)
    {
        player.isAttacking = false;
        player.hasHit = false;
    }

    // The animation is over
    if(player.framesCurrent === player.framesMax - 1)
    {
        player.isAttacking = false;
        player.hasHit = false;
    }

    //detect for collision & player gets hit
    if(
        rectangularCollision({ rectangle1: enemy, rectangle2: player }) 
        && enemy.isAttacking
        && enemy.framesCurrent === 2
        && enemy.animation == 'attack1'
        && enemy.hasHit == false
    ){
        player.takeHit(enemy.damage);
        enemy.hasHit = true;

        gsap.to('#playerHealth',
        {
            width: player.health + '%'
        });
    }
    else if(enemy.framesCurrent === 2 && enemy.isAttacking === true && enemy.hasHit === false)
    {
        enemy.isAttacking = false;
        enemy.hasHit = false;
    }

    if(enemy.framesCurrent === enemy.framesMax - 1)
    {
        enemy.isAttacking = false;
        enemy.hasHit = false;
    }

    lastDelta = Date.now();
    ai_frame++;
}

animate();

window.addEventListener('keydown', (event) =>
{
    if (player.dead === false && player.ai === false)
    {
        switch (event.key) 
        {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break

            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break

            case 'w':
                if (player.jumps > 0)
                {
                    player.velocity.y = player.jumpVelocity
                    player.jumps -= 1
                }
                break

            case ' ':
                player.attack()
                break
        }
    }

    if (enemy.dead === false && enemy.ai === false)
    {
        switch (event.key)
        {
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break

            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break

                case 'ArrowUp':
                    if (enemy.jumps > 0)
                    {
                        enemy.velocity.y = enemy.jumpVelocity
                        enemy.jumps -= 1
                    }
                    break

            case 'Enter':
                enemy.attack()
                break
        }
    }
})

window.addEventListener('keyup', (event) => 
{
    switch (event.key) 
    {
        case 'd':
            keys.d.pressed = false
            break

        case 'a':
            keys.a.pressed = false
            break

        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})
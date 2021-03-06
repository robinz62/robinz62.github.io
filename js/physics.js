let Engine = Matter.Engine;
let Render = Matter.Render;
let Runner = Matter.Runner;
let Bodies = Matter.Bodies;
let Body = Matter.Body;
let Composite = Matter.Composite;
let Mouse = Matter.Mouse;
let MouseConstraint = Matter.MouseConstraint;

let runMatter = () => {
    let canvas = document.getElementById('canvas');

    let engine = Engine.create();
    let world = engine.world;

    let render = Render.create({
        element: canvas,
        engine,
        options: {
            background: 'transparent',
            wireframes: false,
            width: window.innerWidth,
            height: window.innerHeight,
        }
    });

    let getDimensions = () => [window.innerWidth, window.innerHeight];
    let [initWidth, initHeight] = getDimensions();

    // Half of the wall's thickness. I experimented this value to roughly prevent
    // objects from being flung out of the screen, although it is still possible if
    // the user really wants to.
    const wallThickness = 2048;

    // Borders
    // Note: the ground and ceiling's widths extend to cover the corners.
    let ground = Bodies.rectangle(
        initWidth / 2, initHeight + wallThickness,
        initWidth + wallThickness * 4, wallThickness * 2,
        { isStatic: true, label: 'ground', render: { fillStyle: 'none' } });
    let leftWall = Bodies.rectangle(
        -wallThickness, initHeight / 2,
        wallThickness * 2, initHeight,
        { isStatic: true, label: 'leftWall', render: { fillStyle: 'none' } });
    let rightWall = Bodies.rectangle(
        initWidth + wallThickness, initHeight / 2,
        wallThickness * 2, initHeight,
        { isStatic: true, label: 'rightWall', render: { fillStyle: 'none' } });
    let ceiling = Bodies.rectangle(
        initWidth / 2, -wallThickness,
        initWidth + wallThickness * 4, wallThickness * 2,
        { isStatic: true, label: 'ceiling', render: { fillStyle: 'none' } });

    // Objects
    const restitution = 0.8;

    // Sets the rotation, angular velocity, and velocity randomly.
    function randomizeMotion(object) {
        let angle = Math.random() * 2 * Math.PI;
        let angularVelocity = Math.random() * 0.2 - 0.1;
        let velocity = {
            x: Math.random() * 16 - 8,
            y: Math.random() * 16 - 8
        };
        Body.rotate(object, Math.random() * angle);
        Body.setAngularVelocity(object, angularVelocity)
        Body.setVelocity(object, velocity);
    };

    // Creates an object with a random initial position, rotation, angular velocity, and velocity.
    let square = (texture) => {
        let [width, height] = getDimensions();
        let x = Math.random() * width;
        let y = Math.random() * height
        let object = Bodies.rectangle(x, y, 128, 128, { restitution, render: { sprite: { texture } } });
        randomizeMotion(object);
        return object;
    }

    let circle = (texture) => {
        let [width, height] = getDimensions();
        let x = Math.random() * width;
        let y = Math.random() * height
        let object = Bodies.circle(x, y, 64, { restitution, render: { sprite: { texture } } });
        randomizeMotion(object);
        Body.setInertia(object, object.inertia / 5);  // This value gives a good amount of spin.
        return object;
    }

    let lle = square('./img/lle.png');
    let bentley = square('./img/bentley.png');
    let qualtrics = square('./img/qualtrics.png');
    let google = circle('./img/google.png');
    let js = circle('./img/js.png');

    // This could be refined if desired.
    let penn = Bodies.fromVertices(Math.random() * initWidth, Math.random() * initHeight, [
        { x: -57, y: -65 },
        { x: 56, y: -65 },
        { x: 56, y: 4 },
        { x: 48, y: 25 },
        { x: 37, y: 40 },
        { x: 22, y: 52 },
        { x: 0, y: 63 },
        { x: -22, y: 52 },
        { x: -37, y: 40 },
        { x: -48, y: 25 },
        { x: -57, y: 4 },
    ], {
        restitution,
        render: { sprite: { texture: './img/penn.png' } }
    });
    randomizeMotion(penn);

    // Dynamic borders is a little buggy. Only explicity resizes of the window
    // trigger updates e.g. toggling fullscreen or opening the developer console
    // don't seem to trigger this event.
    window.addEventListener('resize', function () {
        let [width, height] = getDimensions();
        Body.setPosition(ground, { x: width / 2, y: height + wallThickness});
        Body.setPosition(leftWall, { x: -wallThickness, y: height / 2 });
        Body.setPosition(rightWall, { x: width + wallThickness, y: height / 2});
        Body.setPosition(ceiling, { x: width / 2, y: -wallThickness });
    });

    Composite.add(world, [ground, leftWall, rightWall, ceiling]);
    Composite.add(world, [lle, penn, bentley, qualtrics, google, js]);

    let mouse = Mouse.create(render.canvas);
    let mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });

    Composite.add(world, mouseConstraint);
    render.mouse = mouse;

    Render.run(render);
    var runner = Runner.create();
    Runner.run(runner, engine);
}
class Particle {
    constructor(x, y, c, s) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.s = s;
        this.c = c;
        this.sx = x;
        this.sy = y;
        this.time = Date.now();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx = (this.sx - this.x) / 10;
        this.vy = (this.sy - this.y) / 10;
    }

    render(context) {
        context.beginPath();
        context.fillStyle = this.c;
        context.fillRect(this.x, this.y, this.s, this.s);
        context.closePath();
    }

    applyForceFromMouse(mouseX, mouseY) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 64) {
            const angle = Math.atan2(dy, dx);
            this.vx = -distance * Math.cos(angle);
            this.vy = -distance * Math.sin(angle);
        }
    }
}

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d',

);
const image = new Image();
const particle_size = 4;
let height, width, arr = [];


// make user input image
const input = document.getElementById('file-input');

input.addEventListener('change', (e) => {
    arr = [];
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        image.src = reader.result;
    }
    reader.readAsDataURL(file);
})

image.onload = init;

function init() {
    height = canvas.height = image.height;
    width = canvas.width = image.width;

    context.drawImage(image, 0, 0);
    const idata = context.getImageData(0, 0, width, height);
    const data = idata.data;
    context.clearRect(0, 0, width, height);

    for (let y = 0; y < height; y += particle_size) {
        for (let x = 0; x < width; x += particle_size) {
            const o = x * 4 + y * 4 * idata.width;
            if (data[o + 3] > 210) {
                const c = `rgba(${data[o]}, ${data[o + 1]}, ${data[o + 2]}, ${data[o + 3]})`;
                const p = new Particle(x, y, c, particle_size);
                p.x = Math.random() * width;
                p.y = Math.random() * height;
                arr.push(p);
            }
        }
    }

    canvas.onmousemove = (e) => {
        // mouse position relative to canvas
        const mouseX = e.pageX - canvas.offsetLeft;
        const mouseY = e.pageY - canvas.offsetTop;
        arr.forEach(particle => particle.applyForceFromMouse(mouseX, mouseY));
    };

    update();
    render();
}

function update() {
    arr.forEach(particle => particle.update());
    requestAnimationFrame(update);
}

function render() {
    context.clearRect(0, 0, width, height);
    arr.forEach(particle => particle.render(context));
    requestAnimationFrame(render);
}

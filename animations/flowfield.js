// animations/flowfield.js
(function() {
    // === Animation Controls ===
    const config = {
        particleCount: 1200,
        noiseScale: 0.001,
        speed: 0.4
    };

    const noise = {
        perm: new Uint8Array(512),
        init() {
            for (let i = 0; i < 256; i++) this.perm[i] = this.perm[i + 256] = Math.floor(Math.random() * 256);
        },
        lerp(t, a, b) { return a + t * (b - a); },
        fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); },
        grad(hash, x, y) {
            const h = hash & 15;
            const u = h < 8 ? x : y;
            const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
            return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
        },
        get(x, y) {
            const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
            x -= Math.floor(x); y -= Math.floor(y);
            const u = this.fade(x), v = this.fade(y);
            const a = this.perm[X] + Y, b = this.perm[X + 1] + Y;
            return this.lerp(v, this.lerp(u, this.grad(this.perm[a], x, y), this.grad(this.perm[b], x - 1, y)),
                this.lerp(u, this.grad(this.perm[a + 1], x, y - 1), this.grad(this.perm[b + 1], x - 1, y - 1)));
        }
    };

    let particles = [];
    let _width, _height;

    class Particle {
        constructor() { this.init(); }
        init() {
            this.x = Math.random() * _width;
            this.y = Math.random() * _height;
            this.oldX = this.x;
            this.oldY = this.y;
            this.life = Math.random() * 100 + 100;
        }
        move() {
            this.oldX = this.x;
            this.oldY = this.y;
            const angle = noise.get(this.x * config.noiseScale, this.y * config.noiseScale) * Math.PI * 4;
            this.x += Math.cos(angle) * config.speed;
            this.y += Math.sin(angle) * config.speed;
            this.life--;

            if (this.life <= 0 || this.x < 0 || this.x > _width || this.y < 0 || this.y > _height) {
                this.init();
            }
        }
        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(this.oldX, this.oldY);
            ctx.lineTo(this.x, this.y);
            ctx.stroke();
        }
    }

    window.bgAnimations = window.bgAnimations || {};
    window.bgAnimations['flowfield'] = {
        setup: function(canvas, ctx, width, height) {
            _width = width;
            _height = height;
            noise.init();
            particles = Array.from({ length: config.particleCount }, () => new Particle());
        },
        draw: function(ctx, width, height, isDark) {
            if (isDark) {
                ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
                ctx.strokeStyle = 'rgba(191, 191, 191, 0.4)';
            } else {
                ctx.fillStyle = 'rgba(250, 248, 245, 0.05)';
                ctx.strokeStyle = 'rgba(52, 52, 52, 0.4)';
            }

            ctx.fillRect(0, 0, width, height);
            ctx.lineWidth = 1;

            particles.forEach(p => {
                p.move();
                p.draw(ctx);
            });
        }
    };
})();

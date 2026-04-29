// animations/matrix.js
(function () {
    // === Animation Controls ===
    const config = {
        fontSize: 16, // Size of the dropping characters in pixels
        speed: 0.5, // Falling speed multiplier (1.0 = normal, higher = faster, lower = slower)
        darkColor: '#10b981', // Character color in dark mode (green accent)
        lightColor: '#059669', // Character color in light mode (green accent)
        darkBgFade: 'rgba(15, 23, 42, 0.05)', // Background overlay in dark mode to create fading trail effect
        lightBgFade: 'rgba(250, 248, 245, 0.05)', // Background overlay in light mode to create fading trail effect
        resetChance: 0.975 // Chance (out of 1.0) for a column to reset to top once it goes off-screen
    };

    let matrixColumns = [];

    const chars = {
        en: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        bn: 'অআইঈউঊঋএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহড়ঢ়য়০১২৩৪৫৬৭৮৯'
    };

    function getRandomMatrixChar() {
        const lang = document.documentElement.getAttribute('data-lang') || 'en';
        const currentChars = chars[lang] || chars.en;
        return currentChars.charAt(Math.floor(Math.random() * currentChars.length));
    }

    window.bgAnimations = window.bgAnimations || {};
    window.bgAnimations['matrix'] = {
        timeAccumulator: 0,
        setup: function (canvas, ctx, width, height) {
            const columns = Math.floor(width / config.fontSize);
            matrixColumns = [];
            for (let i = 0; i < columns; i++) {
                matrixColumns[i] = Math.random() * -(height / config.fontSize);
            }
            this.timeAccumulator = 0;
        },
        draw: function (ctx, width, height, isDark) {
            // Accumulate time based on speed to prevent smudging at lower speeds
            this.timeAccumulator += config.speed;

            // Only update the canvas when we have accumulated a full frame step
            while (this.timeAccumulator >= 1.0) {
                this.timeAccumulator -= 1.0;

                if (isDark) {
                    ctx.fillStyle = config.darkBgFade;
                } else {
                    ctx.fillStyle = config.lightBgFade;
                }
                ctx.fillRect(0, 0, width, height);

                ctx.fillStyle = isDark ? config.darkColor : config.lightColor;
                ctx.font = config.fontSize + 'px monospace';

                for (let i = 0; i < matrixColumns.length; i++) {
                    const text = getRandomMatrixChar();
                    const x = i * config.fontSize;
                    const y = matrixColumns[i] * config.fontSize;

                    ctx.fillText(text, x, y);

                    if (y > height && Math.random() > config.resetChance) {
                        matrixColumns[i] = 0;
                    }
                    matrixColumns[i]++; // Always move exactly 1 grid unit per logical frame
                }
            }
        }
    };
})();



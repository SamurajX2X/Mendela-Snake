const Options = {
    specs: {
        boardSize: 20,
        snake: {
            head: { x: Math.floor(20 / 2), y: Math.floor(20 / 2) },
            length: 2
        }
    }
};

const Board = {
    init() {
        const container = document.querySelector('.container');
        container.innerHTML = '';

        const boardSize = Options.specs.boardSize;
        container.style.gridTemplateColumns = `repeat(${boardSize}, 20px)`;
        container.style.gridTemplateRows = `repeat(${boardSize}, 20px)`;

        for (let i = 0; i < boardSize; i++) {
            for (let j = 0; j < boardSize; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = i;
                cell.dataset.col = j;
                container.appendChild(cell);
            }
        }
    }
};

const Game = {
    init() {
        Board.init();
        this.startGame();
    },

    startGame() {
        const boardSize = Options.specs.boardSize;
        const centerX = Math.floor(boardSize / 2);
        const centerY = Math.floor(boardSize / 2);
        this.snake = [
            { x: centerX, y: centerY },
            { x: centerX, y: centerY - 1 }
        ];
        this.direction = 'right';

        this.generateSnake();
        this.generateApple();

        this.moveInterval = setInterval(() => this.moveSnake(), 200);
        this.listenForKeys();
    },

    generateSnake() {
        this.snake.forEach(segment => {
            const cell = document.querySelector(`.cell[data-row="${segment.x}"][data-col="${segment.y}"]`);
            if (cell) {
                cell.classList.add('snake');
            }
        });
    },

    updateSnake() {
        document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('snake'));
        //   na nowo
        this.snake.forEach(segment => {
            const cell = document.querySelector(`.cell[data-row="${segment.x}"][data-col="${segment.y}"]`);
            if (cell) {
                cell.classList.add('snake');
            }
        });
    },

    moveSnake() {
        const head = { ...this.snake[0] }; // aktualna głowa

        if (this.direction === 'right') head.y += 1;
        if (this.direction === 'left') head.y -= 1;
        if (this.direction === 'down') head.x += 1;
        if (this.direction === 'up') head.x -= 1;

        if (this.checkCollision(head)) {
            clearInterval(this.moveInterval);
            alert("Game Over!");
            return Game.init();
        }

        this.snake.unshift(head);

        const appleCell = document.querySelector('.cell.apple');
        if (appleCell && parseInt(appleCell.dataset.row) === head.x && parseInt(appleCell.dataset.col) === head.y) {
            appleCell.classList.remove('apple');
            this.generateApple();
        } else {
            this.snake.pop();
        }

        this.updateSnake();
    },

    checkCollision(head) {
        return (
            head.x < 0 ||
            head.x >= Options.specs.boardSize ||
            head.y < 0 ||
            head.y >= Options.specs.boardSize ||
            this.snake.some(segment => segment.x === head.x && segment.y === head.y)
        );
    },

    // Generowanie jabłka w losowym miejscu (unikając pozycji węża)
    generateApple() {
        let x, y;
        do {
            x = Math.floor(Math.random() * Options.specs.boardSize);
            y = Math.floor(Math.random() * Options.specs.boardSize);
        } while (this.snake.some(segment => segment.x === x && segment.y === y));

        const cell = document.querySelector(`.cell[data-row="${x}"][data-col="${y}"]`);
        if (cell) {
            cell.classList.add('apple');
        }
    },

    // Nasłuchiwanie klawiszy – zmiana kierunku ruchu
    listenForKeys() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowUp' && this.direction !== 'down') this.direction = 'up';
            if (event.key === 'ArrowDown' && this.direction !== 'up') this.direction = 'down';
            if (event.key === 'ArrowLeft' && this.direction !== 'right') this.direction = 'left';
            if (event.key === 'ArrowRight' && this.direction !== 'left') this.direction = 'right';
        });
    }
};

// Inicjalizacja gry po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => Game.init());
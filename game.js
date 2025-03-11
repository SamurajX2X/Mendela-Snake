import Board from './board.js';

const Game = {
    init() {
        this.boardSize = 20;
        this.snake = [];      // segmenty weza
        this.direction = 'right';  // aktualny kierunek
        this.nextDirection = 'right';  // nastepny kierunek
        this.canChangeDirection = true;  // czy mozna zmienic kierunek (troubleshooooooooooting k)
        this.apple = null;

        Board.init(this.boardSize);  // inicjalizacj
        this.startGame();
    },

    startGame() {
        const centerX = Math.floor(this.boardSize / 2);
        const centerY = Math.floor(this.boardSize / 2);
        this.snake = [
            { x: centerX, y: centerY },  // glowa
            { x: centerX, y: centerY - 1 },  // cialo
            { x: centerX, y: centerY - 2 }  // ogon
        ];

        this.updateSnake();
        this.spawnApple();

        this.moveInterval = setInterval(() => this.moveSnake(), 200);  // ruch 
        this.listenForKeys();
    },

    updateSnake() {
        // czyszczenie klas 
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove(
                'snake', 'apple',
                'head_down', 'head_up', 'head_right', 'head_left',
                'tail_up', 'tail_down', 'tail_left', 'tail_right',
                'body_up', 'body_down',
                'curve_up', 'curve_down', 'curve_left', 'curve_right'
            );
        });

        // mapa kierunkow glowy
        const headMapping = {
            up: "head_down",
            down: "head_up",
            left: "head_right",
            right: "head_left"
        };

        this.snake.forEach((segment, index) => {
            const cell = document.querySelector(`.cell[data-row="${segment.x}"][data-col="${segment.y}"]`);
            if (cell) {
                cell.classList.add('snake');
                if (index === 0) {
                    // glowa  odwrocony kierunek
                    cell.classList.add(headMapping[this.direction]);
                } else if (index === this.snake.length - 1) {
                    // ogon  kierunek na podstawie roznicy pozycji
                    const prev = this.snake[index - 1];
                    const dx = prev.x - segment.x;
                    const dy = prev.y - segment.y;
                    if (dx === 1) cell.classList.add('tail_down');
                    else if (dx === -1) cell.classList.add('tail_up');
                    else if (dy === 1) cell.classList.add('tail_right');
                    else if (dy === -1) cell.classList.add('tail_left');
                } else {
                    // rozroznienie prostych i zakretow
                    const prev = this.snake[index - 1];
                    const next = this.snake[index + 1];

                    if (prev.x === segment.x && next.x === segment.x) {
                        // segment poziomy
                        cell.classList.add('body_down');
                    } else if (prev.y === segment.y && next.y === segment.y) {
                        // segment pionowy
                        cell.classList.add('body_up');
                    } else {
                        // zakrety
                        if ((prev.x < segment.x && next.y < segment.y) || (next.x < segment.x && prev.y < segment.y)) {
                            cell.classList.add('curve_up');
                        } else if ((prev.x > segment.x && next.y < segment.y) || (next.x > segment.x && prev.y < segment.y)) {
                            cell.classList.add('curve_left');
                        } else if ((prev.x < segment.x && next.y > segment.y) || (next.x < segment.x && prev.y > segment.y)) {
                            cell.classList.add('curve_down');
                        } else if ((prev.x > segment.x && next.y > segment.y) || (next.x > segment.x && prev.y > segment.y)) {
                            cell.classList.add('curve_right');
                        }
                    }
                }
            }
        });

        // dodanie jablka
        if (this.apple) {
            const appleCell = document.querySelector(`.cell[data-row="${this.apple.x}"][data-col="${this.apple.y}"]`);
            if (appleCell) {
                appleCell.classList.add('apple');
            }
        }
    },

    async moveSnake() {
        this.canChangeDirection = false;
        const head = { ...this.snake[0] };

        // nowa pozycja glowy
        this.direction = this.nextDirection;
        if (this.direction === 'right') head.y += 1;
        if (this.direction === 'left') head.y -= 1;
        if (this.direction === 'down') head.x += 1;
        if (this.direction === 'up') head.x -= 1;

        // sprawdzenie kolizji
        if (this.checkCollision(head)) {
            clearInterval(this.moveInterval);
            alert("koniec gry!");
            return this.init();
        }

        this.snake.unshift(head);

        //  zjedzono jablko
        if (this.apple && head.x === this.apple.x && head.y === this.apple.y) {
            this.apple = null;
            this.spawnApple();
        } else {
            this.snake.pop();
        }

        this.updateSnake();
        this.canChangeDirection = true;
    },

    checkCollision(head) {
        return (
            head.x < 0 ||
            head.x >= this.boardSize ||
            head.y < 0 ||
            head.y >= this.boardSize ||
            this.snake.some(segment => segment.x === head.x && segment.y === head.y)
        );
    },

    spawnApple() {
        let x, y;
        do {
            x = Math.floor(Math.random() * this.boardSize);
            y = Math.floor(Math.random() * this.boardSize);
        } while (this.snake.some(segment => segment.x === x && segment.y === y));

        this.apple = { x, y };
    },

    listenForKeys() {
        document.addEventListener('keydown', (event) => {
            if (!this.canChangeDirection) return;

            if (event.key === 'ArrowUp' && this.direction !== 'down') this.nextDirection = 'up';
            if (event.key === 'ArrowDown' && this.direction !== 'up') this.nextDirection = 'down';
            if (event.key === 'ArrowLeft' && this.direction !== 'right') this.nextDirection = 'left';
            if (event.key === 'ArrowRight' && this.direction !== 'left') this.nextDirection = 'right';
        });
    }
};

document.addEventListener('DOMContentLoaded', () => Game.init());
export default Game;
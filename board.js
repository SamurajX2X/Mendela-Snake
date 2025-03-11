export default {
    init(boardSize = 20) {
        const container = document.getElementById('container');
        container.innerHTML = '';
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

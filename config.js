export default {
    specs: {
        boardSize: 20,  // 20x20 siatka
        speed: 100
    },
    assets: {
        HEAD: {
            up: '40px 0',
            down: '20px 60px',
            left: '40px 60px',
            right: '20px 0'
        },
        TAIL: {
            up: '40px 40px',
            down: '20px 20px',
            left: '40px 20px',
            right: '20px 40px'
        },
        BODY: {
            vertical: '60px 60px',
            horizontal: '0px 60px'
        },
        CORNER: {
            topLeft: '60px 40px',
            topRight: '60px 0',
            bottomLeft: '0px 60px',
            bottomRight: '0px 0'
        },
        APPLE: '0px 20px'
    }
};



// config do wywalenia i tak bo zrąbane to jest
'use strict'

// Pieces Types
const PAWN_BLACK = '♟'
const ROOK_BLACK = '♜'
const KNIGHT_BLACK = '♞'
const BISHOP_BLACK = '♝'
const QUEEN_BLACK = '♛'
const KING_BLACK = '♚'
const PAWN_WHITE = '♙'
const ROOK_WHITE = '♖'
const KNIGHT_WHITE = '♘'
const BISHOP_WHITE = '♗'
const QUEEN_WHITE = '♕'
const KING_WHITE = '♔'

// The Chess Board
var gBoard
var gSelectedElCell = null

function restartGame() {
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard() {
    const board = []
    // DONE: build the board 8 * 8
    for (var i = 0; i < 8; i++) {
        board[i] = []
        for (var j = 0; j < 8; j++) {
            board[i][j] = ''
            if (i === 1) board[i][j] = PAWN_BLACK
            if (i === 6) board[i][j] = PAWN_WHITE
        }
    }

    board[0][0] = board[0][7] = ROOK_BLACK
    board[0][1] = board[0][6] = KNIGHT_BLACK
    board[0][2] = board[0][5] = BISHOP_BLACK
    board[0][3] = QUEEN_BLACK
    board[0][4] = KING_BLACK


    board[7][0] = board[7][7] = ROOK_WHITE
    board[7][1] = board[7][6] = KNIGHT_WHITE
    board[7][2] = board[7][5] = BISHOP_WHITE
    board[7][3] = QUEEN_WHITE
    board[7][4] = KING_WHITE


    return board

}

function renderBoard(board) {
    var strHtml = ''
    for (var i = 0; i < board.length; i++) {
        var row = board[i]
        strHtml += '<tr>'
        for (var j = 0; j < row.length; j++) {
            var cell = row[j]
            // DONE: figure class name
            var className = (i + j) % 2 === 0 ? 'white' : 'black'
            var tdId = `cell-${i}-${j}`
            strHtml += `<td id="${tdId}" onclick="cellClicked(this)" class="${className}">${cell}</td>`
        }
        strHtml += '</tr>'
    }
    const elMat = document.querySelector('.game-board')
    elMat.innerHTML = strHtml
}


function cellClicked(elCell) {

    // TODO: if the target is marked - move the piece!
    if (elCell.classList.contains('mark')) {
        cleanBoard()
        movePiece(gSelectedElCell, elCell)
        return
    }


    cleanBoard()

    elCell.classList.add('selected')
    gSelectedElCell = elCell
    const cellCoord = getCellCoord(elCell.id)
    console.log('cellCoord:', cellCoord)
    const piece = gBoard[cellCoord.i][cellCoord.j]

    var possibleCoords = []
    switch (piece) {
        case ROOK_BLACK:
        case ROOK_WHITE:
            possibleCoords = getAllPossibleCoordsRook(cellCoord)
            break
        case BISHOP_BLACK:
        case BISHOP_WHITE:
            possibleCoords = getAllPossibleCoordsBishop(cellCoord)
            break
        case KNIGHT_BLACK:
        case KNIGHT_WHITE:
            possibleCoords = getAllPossibleCoordsKnight(cellCoord)
            break
        case PAWN_BLACK:
        case PAWN_WHITE:
            possibleCoords = getAllPossibleCoordsPawn(cellCoord, piece === PAWN_WHITE)
            break
        case QUEEN_BLACK:
        case QUEEN_WHITE:
            possibleCoords = getAllPossibleCoordsQueen(cellCoord)
            break
        case KING_BLACK:
        case KING_WHITE:
            possibleCoords = getAllPossibleCoordsKing(cellCoord)
            break
    }
    markCells(possibleCoords)
}

function movePiece(elFromCell, elToCell) {
    // TODO: use: getCellCoord to get the coords, move the piece
    const fromCoord = getCellCoord(elFromCell.id)
    const toCoord = getCellCoord(elToCell.id)
    const piece = gBoard[fromCoord.i][fromCoord.j]

    // REMOVE FROM
    // update the MODEl
    gBoard[fromCoord.i][fromCoord.j] = ''
    // update the DOM
    elFromCell.innerText = ''

    // ADD TO
    // update the MODEl
    gBoard[toCoord.i][toCoord.j] = piece
    // update the DOM
    elToCell.innerText = piece

}


function markCells(coords) {
    // DONE: query select them one by one and add mark 
    for (var i = 0; i < coords.length; i++) {
        var coord = coords[i]
        // console.log('coord:', coord)
        const selector = getSelector(coord)
        // console.log('selector:', selector)
        const elTd = document.querySelector(selector)
        elTd.classList.add('mark')
    }

}

// Gets a string such as:  'cell-2-7' and returns {i:2, j:7}
function getCellCoord(strCellId) {
    const coord = {}
    const parts = strCellId.split('-')
    coord.i = +parts[1]
    coord.j = +parts[2]
    return coord
}

function cleanBoard() {
    const elTds = document.querySelectorAll('.mark, .selected')
    for (var i = 0; i < elTds.length; i++) {
        elTds[i].classList.remove('mark', 'selected')
    }
}

function getSelector(coord) {
    return `#cell-${coord.i}-${coord.j}`
}

function isEmptyCell(coord) {
    return gBoard[coord.i][coord.j] === ''
}

function getAllPossibleCoordsPawn(pieceCoord, isWhite) {
    // DONE: handle PAWN use isEmptyCell()
    const res = []
    var diff = isWhite ? -1 : 1
    var nextCoord = {
        i: pieceCoord.i + diff,
        j: pieceCoord.j
    }
    if (isEmptyCell(nextCoord)) {
        res.push(nextCoord)


        if (pieceCoord.i === 1 || pieceCoord.i === 6) {
            diff *= 2
            nextCoord = {
                i: pieceCoord.i + diff,
                j: pieceCoord.j
            }

            if (isEmptyCell(nextCoord)) {
                res.push(nextCoord)
            }
        }
    }

    return res
}







function getAllPossibleCoordsRook(pieceCoord) {
    const res = []
    var i = pieceCoord.i
    console.log(i);
    var j = pieceCoord.j
    for (var idx = pieceCoord.i - 1; idx >= 0; idx--) {
        if (idx < 0) break
        var coord = { i: idx, j: pieceCoord.j }
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    i = pieceCoord.i
    for (var idx = pieceCoord.i + 1; idx < gBoard.length; idx++) {
        var coord = { i: idx, j: pieceCoord.j }
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    for (var idx = pieceCoord.j + 1; idx < gBoard.length; idx++) {
        var coord = { i: pieceCoord.i, j: idx }
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    for (var idx = pieceCoord.j - 1; idx >= 0; idx--) {
        var coord = { i: pieceCoord.i, j: idx }
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    return res
}

function getAllPossibleCoordsBishop(pieceCoord) {
    var res = [];
    console.log('pieceCoord:', pieceCoord)
    var i = pieceCoord.i - 1;
    for (var idx = pieceCoord.j + 1; i >= 0 && idx < 8; idx++) {
        var coord = { i: i--, j: idx };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    i = pieceCoord.i - 1;
    for (var idx = pieceCoord.j - 1; i >= 0 && idx >= 0; idx--) {
        var coord = { i: i--, j: idx };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
    }
    i = pieceCoord.i + 1;
    for (var idx = pieceCoord.j + 1; i < 8 && idx < 8; idx++) {
        var coord = { i: i++, j: idx };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
        console.log('res:', res)
    }
    i = pieceCoord.i + 1;
    for (var idx = pieceCoord.j - 1; i < 8 && idx >= 0; idx--) {
        var coord = { i: i++, j: idx };
        if (!isEmptyCell(coord)) break;
        res.push(coord);
        console.log('res:', res)
    }
    return res;
}

// function checkRightUpMove()

function getAllPossibleCoordsKnight(pieceCoord) {
    const res = []
    const i = pieceCoord.i
    const j = pieceCoord.j
    if (checkKnight(i + 1, j + 2)) res.push(checkKnight(i + 1, j + 2))
    if (checkKnight(i - 1, j + 2)) res.push(checkKnight(i - 1, j + 2))
    if (checkKnight(i - 1, j - 2)) res.push(checkKnight(i - 1, j - 2))
    if (checkKnight(i + 1, j - 2)) res.push(checkKnight(i + 1, j - 2))
    if (checkKnight(i + 2, j + 1)) res.push(checkKnight(i + 2, j + 1))
    if (checkKnight(i + 2, j - 1)) res.push(checkKnight(i + 2, j - 1))
    if (checkKnight(i - 2, j - 1)) res.push(checkKnight(i - 2, j - 1))
    if (checkKnight(i - 2, j + 1)) res.push(checkKnight(i - 2, j + 1))


    return res
}

function checkKnight(i, j) {
    if (i > 7 || i < 0) return
    if (j > 7 || j < 0) return
    var coord = { i, j }
    if (isEmptyCell(coord)) return coord
}

function getAllPossibleCoordsQueen(pieceCoord) {
    const rooks = getAllPossibleCoordsRook(pieceCoord)
    const bishops = getAllPossibleCoordsBishop(pieceCoord)
    const res = [].concat(rooks, bishops)
    console.log('res:', res)
    return res
}


function getAllPossibleCoordsKing(pieceCoord) {
    const res = []
    const cellI = pieceCoord.i
    const cellJ = pieceCoord.j
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= 8) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= 8) continue
            const coord = { i, j }

            if (isEmptyCell(coord)) res.push(coord)
        }
    }
    return res
}

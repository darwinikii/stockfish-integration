// ==UserScript==
// @name         chess.com
// @namespace    http://www.chess.com
// @version      0.1
// @description  chess.com ai bot
// @author       You
// @match        https://www.chess.com/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chess.com
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';
    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
    console.log("5 second")
    await delay(5000)
    console.log("started");
    var board = document.getElementsByClassName("board")[0]
    var highlight1 = document.createElement("div")
    highlight1.className = "darwins highlight square-18"
    highlight1.style = "background-color: rgb(0, 0, 255); opacity: 0.5;"
    board.appendChild(highlight1)
    var highlight2 = document.createElement("div")
    highlight2.className = "darwins highlight square-88"
    highlight2.style = "background-color: rgb(0, 0, 255); opacity: 0.5;"
    board.appendChild(highlight2)
    setInterval(getFen, 2000);
})();

async function getFen() {
    var darwins = {}
    darwins.pieces = document.getElementsByClassName("piece")
    darwins.table = {
        8: [null, null, null, null, null, null, null, null],
        7: [null, null, null, null, null, null, null, null],
        6: [null, null, null, null, null, null, null, null],
        5: [null, null, null, null, null, null, null, null],
        4: [null, null, null, null, null, null, null, null],
        3: [null, null, null, null, null, null, null, null],
        2: [null, null, null, null, null, null, null, null],
        1: [null, null, null, null, null, null, null, null],
        "activeColor": document.getElementsByClassName("vertical-move-list")[0].lastChild.children[2] == undefined ? "b" : "w",
        "castling": "-",
        "enPassant": "-",
        "halfmoveClock": 0,
        "fullmoveNumber": document.getElementsByClassName("vertical-move-list")[0].childElementCount
    }
    if (document.getElementsByClassName("board")[0].className.includes("flipped") && darwins.table.activeColor == "w") return
    if (!document.getElementsByClassName("board")[0].className.includes("flipped") && darwins.table.activeColor == "b") return
    for (let piece of darwins.pieces) {
        if (piece.classList[2].length == 2) {
            piece.className = piece.classList[0] + " " + piece.classList[2] + " " + piece.classList[1]
        }
    }
    for (let piece of darwins.pieces) {
        var num
        num = piece.classList[2].substr(piece.classList[2].length -2)
        darwins.table[num.charAt(1)][num.charAt(0) - 1] = piece.classList[1].charAt(0) == "w" ? piece.classList[1].charAt(1).toUpperCase() : piece.classList[1].charAt(1).toLowerCase()
    }

    function makeRequest(method, url) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send();
        });
    }

    function jsonToFen(jsonTable) {
        let fen = "";
        for (let i = 8; i > 0; i--) {
            let emptySquares = 0;
            for (let j = 0; j < 8; j++) {
                let piece = jsonTable[i][j];
                if (!piece) {
                    emptySquares++;
                } else {
                    if (emptySquares > 0) {
                        fen += emptySquares;
                        emptySquares = 0;
                    }
                    fen += piece;
                }
                if (j === 7 && emptySquares > 0) {
                    fen += emptySquares;
                }
            }
            if (i > 1) {
                fen += "/";
            }
        }
        fen += " " + jsonTable.activeColor + " ";
        fen += jsonTable.castling + " " + jsonTable.enPassant + " ";
        fen += jsonTable.halfmoveClock + " " + jsonTable.fullmoveNumber;
        return fen;
    }
    var res = await makeRequest("GET", "http://127.0.0.1:8000/chess?fen=" + jsonToFen(darwins.table))
    var [highlight1, highlight2] = document.getElementsByClassName("darwins")
    var letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
    res = JSON.parse(res).msg
    res[0].Move = res[0].Move.replace(res[0].Move.charAt(0), letters.indexOf(res[0].Move.charAt(0)) + 1)
    res[0].Move = res[0].Move.replace(res[0].Move.charAt(2), letters.indexOf(res[0].Move.charAt(2)) + 1)
    res[1].Move = res[1].Move.replace(res[1].Move.charAt(0), letters.indexOf(res[1].Move.charAt(0)) + 1)
    res[1].Move = res[1].Move.replace(res[1].Move.charAt(2), letters.indexOf(res[1].Move.charAt(2)) + 1)
    highlight1.className = "darwins highlight square-" + res[0].Move.substr(0,2)
    highlight2.className = "darwins highlight square-" + res[0].Move.substr(2,3)
    highlight2.innerText = res[0].Centipawn / 100
}

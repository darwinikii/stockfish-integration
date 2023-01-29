// ==UserScript==
// @name         chess.com
// @namespace    http://www.chess.com
// @version      0.5
// @description  chess.com stockfish integration
// @author       darwinikii
// @match        https://www.chess.com/game/*
// @match        https://www.chess.com/play/computer
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chess.com
// @updateURL    https://github.com/darwinikii/stockfish-integration/raw/main/chess.com.user.js
// @downloadURL  https://github.com/darwinikii/stockfish-integration/raw/main/chess.com.user.js
// @grant GM_setValue
// @grant GM_getValue
// ==/UserScript==

(async function() {
    'use strict';
    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
    console.log("5 second")
    await delay(5000)
    console.log("started");
    if (document.getElementsByClassName("square-81")[0] && document.getElementsByClassName("square-81")[0].className.includes("wr")) {
        GM_setValue("wr81", false)
    } else {
        GM_setValue("wr81", true)
    }
    if (document.getElementsByClassName("square-11")[0] && document.getElementsByClassName("square-11")[0].className.includes("wr")) {
        GM_setValue("wr11", false)
    } else {
        GM_setValue("wr11", true)
    }
    if (document.getElementsByClassName("square-51")[0] && document.getElementsByClassName("square-51")[0].className.includes("wk")) {
        GM_setValue("wk", false)
    } else {
        GM_setValue("wk", true)
    }
    if (document.getElementsByClassName("square-88")[0] && document.getElementsByClassName("square-88")[0].className.includes("br")) {
        GM_setValue("br88", false)
    } else {
        GM_setValue("br88", true)
    }
    if (document.getElementsByClassName("square-18")[0] && document.getElementsByClassName("square-18")[0].className.includes("br")) {
        GM_setValue("br18", false)
    } else {
        GM_setValue("br18", true)
    }
    if (document.getElementsByClassName("square-58")[0] && document.getElementsByClassName("square-58")[0].className.includes("bk")) {
        GM_setValue("bk", false)
    } else {
        GM_setValue("bk", true)
    }
    var board = document.getElementsByClassName("board")[0]
    var highlight1 = document.createElement("div")
    highlight1.className = "darwins highlight square-18"
    highlight1.style = "background-color: rgb(255, 0, 50); opacity: 0.5; box-shadow: 0 0 7px #FF0032, 0 0 10px #FF0032, 0 0 21px #FF0032, 0 0 42px #FF0032, 0 0 82px #FF0032, 0 0 92px #FF0032, 0 0 102px #FF0032, 0 0 151px #FF0032;"
    board.appendChild(highlight1)
    var highlight2 = document.createElement("div")
    highlight2.className = "darwins highlight square-88"
    highlight2.style = "background-color: rgb(0, 255, 170); opacity: 0.5; box-shadow: 0 0 7px #00FFAA, 0 0 10px #00FFAA, 0 0 21px #00FFAA, 0 0 42px #00FFAA, 0 0 82px #00FFAA, 0 0 92px #00FFAA, 0 0 102px #00FFAA, 0 0 151px #00FFAA;"
    board.appendChild(highlight2)
    var highlight3 = document.createElement("div")
    highlight3.className = "darwins highlight square-18"
    highlight3.style = "background-color: #A020F0; opacity: 0.5; box-shadow: 0 0 7px #A020F0, 0 0 10px #A020F0, 0 0 21px #A020F0, 0 0 42px #A020F0, 0 0 82px #A020F0, 0 0 92px #A020F0, 0 0 102px #A020F0, 0 0 151px #A020F0;"
    board.appendChild(highlight3)
    var highlight4 = document.createElement("div")
    highlight4.className = "darwins highlight square-88"
    highlight4.style = "background-color: #FFA500; opacity: 0.5; box-shadow: 0 0 7px #FFA500, 0 0 10px #FFA500, 0 0 21px #FFA500, 0 0 42px #FFA500, 0 0 82px #FFA500, 0 0 92px #FFA500, 0 0 102px #FFA500, 0 0 151px #FFA500;"
    board.appendChild(highlight4)
    var btn = document.createElement("button")
    btn.type = "button"
    btn.className = GM_getValue("alternativeMove", false) ? "darwins-btn ui_v5-button-component ui_v5-button-primary" : "darwins-btn ui_v5-button-component ui_v5-button-basic"
    btn.innerText = "Show alternative moves"
    btn.style = "margin-left: 190px; height: 40px;"
    document.getElementsByClassName("player-component")[1].appendChild(btn)
    btn.addEventListener("click", function() {
        var data = GM_getValue("alternativeMove", false);
        if (data == false) {
            GM_setValue("alternativeMove", true);
            btn.className = "darwins-btn ui_v5-button-component ui_v5-button-primary"
        } else {
            GM_setValue("alternativeMove", false);
            btn.className = "darwins-btn ui_v5-button-component ui_v5-button-basic"
        }
    });
    setInterval(getFen, 3000);
})();

async function getFen() {
    var darwins = {}
    darwins.pieces = document.getElementsByClassName("piece")
    if (!document.getElementsByClassName("selected")[0]) {
        for (let hl of document.getElementsByClassName("darwins")) {
            hl.style.opacity = 0
        }
        return
    }
    var castlingsWhite = ""
    var castlingsBlack = ""
    darwins.table = {
        8: [null, null, null, null, null, null, null, null],
        7: [null, null, null, null, null, null, null, null],
        6: [null, null, null, null, null, null, null, null],
        5: [null, null, null, null, null, null, null, null],
        4: [null, null, null, null, null, null, null, null],
        3: [null, null, null, null, null, null, null, null],
        2: [null, null, null, null, null, null, null, null],
        1: [null, null, null, null, null, null, null, null],
        "activeColor": document.getElementsByClassName("selected")[0].classList[0] == "white" ? "b" : "w",
        "castling": "",
        "enPassant": "-",
        "halfmoveClock": 0,
        "fullmoveNumber": document.getElementsByClassName("vertical-move-list")[0].childElementCount
    }
    if (darwins.table.activeColor == "w") {
        if (document.getElementsByClassName("square-81")[0] && !document.getElementsByClassName("square-81")[0].className.includes("wr")) GM_setValue("wr81", true)
        if (document.getElementsByClassName("square-11")[0] && !document.getElementsByClassName("square-11")[0].className.includes("wr")) GM_setValue("wr11", true)
        if (document.getElementsByClassName("square-51")[0] && !document.getElementsByClassName("square-51")[0].className.includes("wk")) GM_setValue("wk", true)
    }
    if (darwins.table.activeColor == "b") {
        if (document.getElementsByClassName("square-88")[0] && !document.getElementsByClassName("square-88")[0].className.includes("br")) GM_setValue("br88", true)
        if (document.getElementsByClassName("square-18")[0] && !document.getElementsByClassName("square-18")[0].className.includes("br")) GM_setValue("br18", true)
        if (document.getElementsByClassName("square-58")[0] && !document.getElementsByClassName("square-58")[0].className.includes("bk")) GM_setValue("bk", true)
    }
    if (!GM_getValue("wr81", false)) castlingsWhite += "K"
    if (!GM_getValue("wr11", false)) castlingsWhite += "Q"
    if (!GM_getValue("br88", false)) castlingsBlack += "k"
    if (!GM_getValue("br18", false)) castlingsBlack += "q"
    if (!GM_getValue("wk", false)) darwins.table.castling += castlingsWhite
    if (!GM_getValue("bk", false)) darwins.table.castling += castlingsBlack
    if (darwins.table.castling == "") darwins.table.castling = "-"
    if (document.getElementsByClassName("selected")[0].classList[0] == "white") {

    }
    var isAlternative = GM_getValue("alternativeMove", false)
    if (document.getElementsByClassName("board")[0].className.includes("flipped") && darwins.table.activeColor == "w") {
        for (let hl of document.getElementsByClassName("darwins")) {
            hl.style.opacity = 0
        }
        return
    }
    if (!document.getElementsByClassName("board")[0].className.includes("flipped") && darwins.table.activeColor == "b") {
        for (let hl of document.getElementsByClassName("darwins")) {
            hl.style.opacity = 0
        }
        return
    }
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
        console.log(fen)
        return fen;
    }
    var res = await makeRequest("GET", "http://127.0.0.1:8000/chess?fen=" + jsonToFen(darwins.table) + "&isAlternative=" + isAlternative.toString())
    var [highlight1, highlight2, highlight3, highlight4] = document.getElementsByClassName("darwins")
    var letters = ["a", "b", "c", "d", "e", "f", "g", "h"]
    res = JSON.parse(res).msg
    console.log(res)
    if (res[0].Move.length == 5) res[0].Move = res[0].Move.substr(0, 4)
    res[0].Move = res[0].Move.replace(res[0].Move.charAt(0), letters.indexOf(res[0].Move.charAt(0)) + 1)
    res[0].Move = res[0].Move.replace(res[0].Move.charAt(2), letters.indexOf(res[0].Move.charAt(2)) + 1)
    highlight1.className = "darwins highlight square-" + res[0].Move.substr(0,2)
    highlight2.className = "darwins highlight square-" + res[0].Move.substr(2,3)
    highlight2.innerText = ((res[0].Centipawn == null ? 0 : res[0].Centipawn) / 100).toString() + "P" + (res[0].Mate ? "\nMate" : "")
    highlight1.style.opacity = 0.5
    highlight2.style.opacity = 0.5
    if (isAlternative) {
        res[1].Move = res[1].Move.replace(res[1].Move.charAt(0), letters.indexOf(res[1].Move.charAt(0)) + 1)
        res[1].Move = res[1].Move.replace(res[1].Move.charAt(2), letters.indexOf(res[1].Move.charAt(2)) + 1)
        highlight4.className = "darwins highlight square-" + res[1].Move.substr(0,2)
        highlight3.className = "darwins highlight square-" + res[1].Move.substr(2,3)
        highlight3.innerText = (res[0].Centipawn / 100).toString() + "P" + "\nAlternative" + (res[0].Mate ? "\nMate" : "")
        highlight4.style.opacity = 0.5
        highlight3.style.opacity = 0.5
    }
}

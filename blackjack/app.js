const CardType = {
    clover: 0,
    tile: 1,
    heart: 2,
    pike: 3,
    jocker: 4,
}
class BlackJack {
    constructor() {
        this.deck = [];
        this.houseHand = [];
        this.playerHand = [];
        //crating main parents
        this.mainDiv = document.getElementById("app");
        this.houseDiv = document.createElement("div");
        this.playerDiv = document.createElement("div");
        //crating score numbers
        this.houseScore = document.createElement("div");
        this.houseScore.className = "number";
        this.playerScore = document.createElement("div");
        this.playerScore.className = "number";
        this.playerDiv.appendChild(this.playerScore);
        this.houseDiv.appendChild(this.houseScore);

        this.houseDiv.className = "house";
        this.playerDiv.className = "player";
        this.mainDiv.appendChild(this.houseDiv);
        this.mainDiv.appendChild(this.playerDiv);
        this.houseHidden = null;
        //creating buttons
        let bCont = document.createElement("div");
        bCont.className = "buttons";
        let b1 = document.createElement("button");
        b1.innerHTML = "pick";
        b1.onclick = this.playerPick.bind(this);
        bCont.appendChild(b1);
        let b2 = document.createElement("button");
        b2.innerHTML = "hold";
        b2.onclick = this.housePlay.bind(this);
        bCont.appendChild(b2);
        let b3 = document.createElement("button");
        b3.innerHTML = "new";
        b3.onclick = this.clear.bind(this);
        bCont.appendChild(b3);
        this.mainDiv.appendChild(bCont);
        this.pickBtn = b1;
        this.holdBtn = b2;
        this.newBtn = b3;
        this.overlay = document.createElement("div");
        this.overlay.className = "overlay";
        this.mainDiv.appendChild(this.overlay);
        this.playerTotal = 20;
    }
    startGame() {
        this.deck = [];
        this.fillDeck("red");
        this.fillDeck("red");
        this.fillDeck("red");
        this.fillDeck("blue");
        this.fillDeck("blue");
        this.fillDeck("blue");
        this.clear();
    }
    playerPick(e) {
        let card = this.randomCard();
        if (card === null)
            return this.startGame();
        let image = this.addCardImage(card, this.playerDiv);
        card.image = image;
        this.playerHand.push(card);
        if (this.checkLose(this.playerHand)) {
            this.playerScore.innerHTML = this.getLoseHand(this.playerHand).toString();
            this.showResult("house");
            this.gameOver();
        }
        else {
            this.playerScore.innerHTML = this.getBestHand(this.playerHand).toString();
            if (this.playerHand.length === 2 && this.getBestHand(this.playerHand) === 21 && this.getBestHand(this.houseHand) < 10)
                this.showResult("player");
        }
    }
    housePlay(e) {
        if (this.houseHidden != null) {
            this.houseDiv.removeChild(this.houseHidden);
            this.houseHidden = null;
        }
        let card = this.randomCard();
        if (card === null)
            return this.startGame();
        let image = this.addCardImage(card, this.houseDiv);
        card.image = image;
        this.houseHand.push(card);
        this.houseScore.innerHTML = this.getBestHand(this.houseHand).toString();
        if (this.checkLose(this.houseHand)) {
            this.showResult("player");
            this.houseScore.innerHTML = this.getLoseHand(this.houseHand).toString();
            this.gameOver();
        }
        else if (e.repeat == undefined || e.repeat) {
            this.pickBtn.disabled = true;
            this.holdBtn.disabled = true;
            let best = this.getBestHand(this.houseHand);
            if (best < 17) {
                setTimeout(() => {
                    this.housePlay({ repeat: true });
                }, 1000);
            }
            else {
                this.compare();
            }
        }
        else {
            this.houseHidden = this.addCardImage({ number: 3, type: CardType.jocker }, this.houseDiv);
        }
    }
    checkLose(hand) {
        let count = this.getHandCount(hand);
        for (let i = 0; i < count.length; i++) {
            if (count[i] <= 21) {
                return false;
            }
        }
        return true;
    }
    gameOver() {
        this.newBtn.disabled = false;
        this.pickBtn.disabled = true;
        this.holdBtn.disabled = true;
    }
    getLoseHand(hand) {
        let count = this.getHandCount(hand);
        let loseScore = 100;
        for (let i = 0; i < count.length; i++) {
            if (count[i] > 21 && count[i] < loseScore) {
                loseScore = count[i];
            }
        }
        return loseScore;
    }
    compare() {
        let bestHouse = this.getBestHand(this.houseHand),
            bestPlayer = this.getBestHand(this.playerHand);
        if (bestHouse > bestPlayer) {
            this.showResult("house");
        }
        else if (bestHouse === bestPlayer && !(bestPlayer === 21 && this.playerHand.length === 2 && this.houseHand.length !== 2)) {
            this.showResult("tie");
        }
        else {
            this.showResult("player");
        }
        this.gameOver();
    }
    showResult(res) {
        switch (res) {
            case "player":
                this.playerTotal++;
                this.playerScore.style.color = "green";
                this.houseScore.style.color = "red";
                this.overlay.style.display = "flex";
                this.overlay.innerHTML = "<div>PLAYER WINS<br/>" + this.playerTotal + "</div>";
                break;
            case "house":
                this.playerTotal--;
                this.playerScore.style.color = "red";
                this.houseScore.style.color = "green";
                this.overlay.style.display = "flex";
                this.overlay.innerHTML = "<div>HOUSE WINS<br/>" + this.playerTotal + "</div>";
                break;
            case "tie":
                this.playerScore.style.color = "gray";
                this.houseScore.style.color = "gray";
                this.overlay.style.display = "flex";
                this.overlay.innerHTML = "<div>TIE<br/>" + this.playerTotal + "</div>";
                break;
            default:
                this.playerScore.style.color = "black";
                this.houseScore.style.color = "black";
                this.overlay.style.display = "none";
                this.overlay.innerHTML = "none";
                break;
        }
    }
    getBestHand(hand) {
        let count = this.getHandCount(hand);
        let best = 0;
        for (let i = 0; i < count.length; i++) {
            let num = count[i];
            if (num <= 21) {
                if (best < num)
                    best = num;
            }
        }
        return best;
    }
    clear(e) {
        for (let i = 0; i < this.houseHand.length; i++) {
            this.houseDiv.removeChild(this.houseHand[i].image);
        }
        for (let i = 0; i < this.playerHand.length; i++) {
            this.playerDiv.removeChild(this.playerHand[i].image);
        }
        if (this.houseHidden != null) {
            this.houseDiv.removeChild(this.houseHidden);
            this.houseHidden = null;
        }
        this.houseHand = [];
        this.playerHand = [];
        this.housePlay({ repeat: false });
        this.playerPick();
        this.playerPick();
        this.newBtn.disabled = true;
        this.pickBtn.disabled = false;
        this.holdBtn.disabled = false;
        this.showResult("none");
    }
    getHandCount(hand) {
        let count = [0];
        //adding cards, and creating game options
        for (let i = 0; i < hand.length; i++) {
            let num = hand[i].number;
            if (num > 10) num = 10;
            if (num === 1) {
                let len = count.length;
                for (let j = 0; j < len; j++) {
                    count[j] += 1;
                    count.push(count[j] + 10);
                }
                continue;
            }
            for (let j = 0; j < count.length; j++) {
                count[j] += num;
            }
        }
        //removing duplicated
        let out = [];
        for (let j = 0; j < count.length; j++) {
            let exist = false;
            for (let i = 0; i < out.length; i++) {
                if (out[i] === count[j]) {
                    exist = true;
                    break;
                }
            }
            if (!exist) {
                out.push(count[j]);
            }
        }
        return out;
    }
    fillDeck(color) {
        for (let i = 0; i < 4; i++) {
            for (let j = 1; j < 14; j++) {
                this.deck.push({
                    number: j,
                    type: i,
                    color: color
                });
            }
        }
    }
    randomCard() {
        if (this.deck.length === 0)
            return null;
        let index = Math.floor(Math.random() * this.deck.length);
        let card = this.deck[index];
        this.deck.splice(index, 1);
        return card;
    }
    addCardImage(card, appendDiv) {
        let div = document.createElement("div"),
            imageW = 1089,
            imageH = 608;
        div.className = "card";
        div.style.backgroundPosition = (-(card.number - 1) * imageW / 13 - 1).toString() + "px " + (-card.type * imageH / 5 - 1).toString() + "px";
        setTimeout(function () {
            div.style.transform = "rotate3d(0, 1, 0, 0deg) scale(0.99)";
        }, 50);
        appendDiv.appendChild(div);
        //setting score as last sibling
        if (this.playerScore.nextElementSibling)
            this.playerScore.parentNode.insertBefore(this.playerScore.nextElementSibling, this.playerScore);
        if (this.houseScore.nextElementSibling)
            this.houseScore.parentNode.insertBefore(this.houseScore.nextElementSibling, this.houseScore);
        return div;
    }
}
var game;
document.addEventListener("DOMContentLoaded", function (e) {
    game = new BlackJack();
    game.startGame();
});

import { Grid } from "./Script";

interface BallInter {
    x: number;
    y: number;
    gameMap: HTMLElement;
    color: string;
}

export class Ball implements BallInter {
    public x: number;
    public y: number;
    public ball: HTMLElement;
    readonly gameMap: HTMLElement;
    readonly color: string;
    public selected: boolean;

    constructor(x: number, y: number, gameMap: HTMLElement, color: string) {
        this.x = x;
        this.y = y;
        this.gameMap = gameMap;
        this.color = color;
        this.createBall()
        this.selected = false;
    }
    createBall() {
        this.ball = document.createElement("div");
        this.ball.style.top = 50 * this.y + "px"
        this.ball.style.left = 50 * this.x + "px"
        this.ball.style.backgroundColor = this.color;
        this.ball.style.transition = ".1s"
        this.ball.classList.add("ball");
        this.ball.addEventListener("click", () => {
            if (!Grid.ballSelected) {
                Grid.ifBallSelected = true;
                Grid.ballSelected = this;
                Grid.setProximity(Grid.ballSelected.x, Grid.ballSelected.y)
                document.getElementById("ifBallSelected").innerHTML = "A ball is selected, press Right Mouse Button to unselect"
            }
        })
        this.gameMap.appendChild(this.ball);
    }
    destroy() {
        this.x = null
        this.y = null
        this.ball.classList.remove("ball");
        this.ball.classList.add("removedBall");
        this.selected = null
    }
}

export default Ball
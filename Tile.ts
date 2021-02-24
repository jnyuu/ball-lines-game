import { Grid } from "./Script";

interface TileInter {
    x: number;
    y: number;
    gameMap: HTMLElement;
}

export class Tile implements TileInter {
    public x: number;
    public y: number;
    public tile: HTMLElement;
    readonly gameMap: HTMLElement;
    public ballInside: boolean;
    public proximity: number;

    constructor(x: number, y: number, gameMap: HTMLElement) {
        this.x = x;
        this.y = y;
        this.gameMap = gameMap;
        this.ballInside = false;
        this.proximity = -1;
    }
    createTile() {
        this.tile = document.createElement("div");
        this.tile.style.position = "absolute"
        this.tile.style.top = 50 * this.y + "px"
        this.tile.style.left = 50 * this.x + "px"
        this.tile.style.width = "48px"
        this.tile.style.height = "48px"
        this.tile.style.border = "1px solid black"

        this.gameMap.appendChild(this.tile);

        this.tile.addEventListener("click", () => {
            if(Grid.ifBallSelected){
            if(this.x == Grid.ballSelected.x && this.y == Grid.ballSelected.y){
            }else{
                if (Grid.ifBallSelected && this.proximity != -1) {
                    document.getElementById("ifBallSelected").innerHTML = "No ball selected currently, click on to select";
                    Grid.moveBall(Grid.savedPath, Grid.ballSelected, this.x, this.y)
                    Grid.ifBallSelected = false;
                    Grid.ballSelected = null;
                    Grid.resetProximity();
                    Grid.resetHighlight();
                    Grid.savedPath = []
                }
            }
        }
        })
        this.tile.addEventListener("mouseover", () => {
            if (Grid.ifBallSelected && this.proximity != -1) {
                Grid.getPath(Grid.getAdjacentTiles(this, "includeEnd"), Grid.savedStartTile, this)
            }
        })
        this.tile.addEventListener("mouseout", () => {
            if (Grid.ifBallSelected && this.proximity != -1) {
                Grid.resetHighlight()
            }
        })
    }
    toggleBall() {
        this.ballInside = !this.ballInside
    }
    setProximity(proximity: number) {
        this.proximity = proximity
    }
    toggleHighlight() {
        if (this.tile.style.backgroundColor == "red") {
            this.tile.style.backgroundColor = "white"
        } else {
            this.tile.style.backgroundColor = "red"
        }
    }
    highlightOn() {
        this.tile.style.backgroundColor = "red"

    }
    highlightOff() {
        this.tile.style.backgroundColor = "white"

    }
}

export default Tile 

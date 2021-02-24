import { GameGrid } from "./GameGrid";
import { Ball } from "./Ball";
export let Grid: GameGrid

function logBall(grid: { ballSelected: Ball }) {
    console.log(grid.ballSelected);
}

/* change game parameters here */
let dimension = 9;
/* change game parameters here */

function init() {
    Grid = new GameGrid(dimension, document.getElementById("gameMap"));
    document.getElementById("gameMap").style.transform = "translateX(-"+ 25 * dimension + "px)"
    
    window.oncontextmenu = function () {
        logBall(Grid);
        Grid.ifBallSelected = false;
        Grid.ballSelected = null;
        Grid.resetProximity();
        document.getElementById("ifBallSelected").innerHTML = "No ball selected currently, click on to select";
        Grid.resetHighlight();
        Grid.savedPath = []
        return false;     // cancel default menus
    }
    Grid.createGrid()
    Grid.generateBalls(Grid.getColors(3))
    Grid.nextColors = Grid.getColors(3)
    Grid.displayNextColors()
};

document.addEventListener('DOMContentLoaded', init, false);




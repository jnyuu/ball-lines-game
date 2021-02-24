import Tile from "./Tile";
import Ball from "./Ball";
import {logNext } from "./decorators";


export class GameGrid {
    readonly size: number;
    readonly gameMap: HTMLElement;
    static colorsDisplay: HTMLElement = document.getElementById("colorsDisplay")
    public tileTab: Tile[][];
    public ballTab: Ball[][];
    public nextColors: string[];
    private allColors: string[];
    public savedPath: Tile[];
    public ifBallSelected: boolean;
    public ballSelected: Ball;
    public savedStartTile: Tile;
    private savedEndTile: Tile;
    private score: number;
    public szyderca: boolean;

    constructor(size: number, gameMap: HTMLElement) {
        this.size = size;
        this.gameMap = document.getElementById("gameMap")
        this.tileTab = [];
        this.ballTab = [];
        this.savedStartTile = null;
        this.savedEndTile = null;
        this.allColors = ['#e0127d', '#e01212', '#6b6b6b', '#15bf0f', '#0036b5', '#00cccc', '#f9fc14']
        this.score = 0;
        this.szyderca = false;
    }

    

    toggleSzyderca() {
        this.szyderca = !this.szyderca;
    }

    createGrid() {
        for (let x = 0; x < this.size; x++) {
            this.tileTab.push([])
            for (let y = 0; y < this.size; y++) {
                this.tileTab[x].push(new Tile(x, y, this.gameMap))
                this.tileTab[x][y].createTile()
            }
        }
        for (let x = 0; x < this.size; x++) {
            var arr = new Array(this.size);
            this.ballTab.push(arr)
        }
    }
    getColors(colorsNumber: number) {
        let randomizedColors: string[] = [];
        for (let i = 0; i < colorsNumber; i++) {
            randomizedColors.push(this.allColors[Math.floor(Math.random() * this.allColors.length)])
        }
        return randomizedColors;
        // róż #e0127d 
        // czerw #e01212
        // szary #6b6b6b
        // ziel #15bf0f
        // nieb #0036b5
        // seled #00cccc
        // żółty #f9fc14
    }
    generateBalls(colorsTab: string[]) {
        for (let i = 0; i < colorsTab.length; i++) {
            let x: number = Math.floor(Math.random() * this.size)
            let y: number = Math.floor(Math.random() * this.size)

            if (typeof this.ballTab[x][y] == "undefined" || this.ballTab[x][y] == null) {
                let checkIfBoardFull: number = 0
                this.ballTab.forEach(el => {
                    el.forEach(ele => {
                        if (ele != undefined || ele != null) {
                            checkIfBoardFull++
                        }
                    });
                });
                if (checkIfBoardFull == (this.size * this.size) - 1) {
                    alert("koniec Gry, zdobyte punkty : " + this.score);
                    window.location.reload();
                    break
                }
                this.tileTab[x].find(el => el.y == y).toggleBall();
                this.ballTab[x][y] = new Ball(x, y, this.gameMap, colorsTab[i])

                let ballsToDelete = this.checkPlace(x, y, this.ballTab[x][y])
                if (ballsToDelete.length > 0) {
                    ballsToDelete.forEach(el => {
                        if (el.x == null) {
                        } else {
                            this.tileTab[el.x][el.y].ballInside = false;
                            this.ballTab[el.x][el.y] = null;
                        }
                        el.destroy()
                        this.score++;
                    });
                    this.updateScore()
                }
            } else {
                i--
            }
        }
    }
    displayNextColors() {
        GameGrid.colorsDisplay.style.width = this.nextColors.length * 50 + "px"
        GameGrid.colorsDisplay.innerHTML = ""
        for (let i = 0; i < this.nextColors.length; i++) {
            let ball: HTMLElement = document.createElement("div");
            ball.style.top = "0px"
            ball.style.left = 50 * i + "px"
            ball.style.backgroundColor = this.nextColors[i];
            ball.classList.add("ball");
            GameGrid.colorsDisplay.appendChild(ball);
        }
    }
    getAdjacentTiles(tile: Tile, param: string) {
        let adjacentTiles: Tile[] = []
        let upTile: Tile
        let rightTile: Tile
        let downTile: Tile
        let leftTile: Tile

        if (!(tile.y - 1 < 0)) {
            upTile = this.tileTab[tile.x].find((el: Tile) => el.y == (tile.y - 1))
          
            if (param == "includeEnd") {
                if (upTile.proximity == -2) {
                    adjacentTiles.push(upTile)
                } else if (upTile.ballInside == false) {
                    adjacentTiles.push(upTile)
                }
            } else {
                if (upTile.ballInside == false) {
                    adjacentTiles.push(upTile)
                }
            }
        }
        if (!(tile.x + 1 == this.size)) {
            rightTile = this.tileTab[tile.x + 1].find((el: Tile) => el.y == tile.y)
         
            if (param == "includeEnd") {
                if (rightTile.proximity == -2) {
                    adjacentTiles.push(rightTile)

                } else if (rightTile.ballInside == false) {
                    adjacentTiles.push(rightTile)
                }
            } else {
                if (rightTile.ballInside == false) {
                    adjacentTiles.push(rightTile)
                }
            }
        }
        if (!(tile.y + 1 == this.size)) {
            downTile = this.tileTab[tile.x].find((el: Tile) => el.y == (tile.y + 1))

            if (param == "includeEnd") {
                if (downTile.proximity == -2) {
                    adjacentTiles.push(downTile)

                } else if (downTile.ballInside == false) {
                    adjacentTiles.push(downTile)
                }
            } else {
                if (downTile.ballInside == false) {
                    adjacentTiles.push(downTile)
                }
            }
        }
        if (!(tile.x - 1 < 0)) {
            leftTile = this.tileTab[tile.x - 1].find((el: Tile) => el.y == tile.y)
            if (param == "includeEnd") {
                if (leftTile.proximity == -2) {
                    adjacentTiles.push(leftTile)

                } else if (leftTile.ballInside == false) {
                    adjacentTiles.push(leftTile)
                }
            } else {
                if (leftTile.ballInside == false) {
                    adjacentTiles.push(leftTile)
                }
            }


        }
        return adjacentTiles;
    }
    setProximity(x1: number, y1: number) {
        function setProximityRecursiveFunc(tilesToCheck: Tile[]) {
            let unsearchedAdjacent: Tile[] = []
            let adjacentTiles: Tile[] = []
            if (tilesToCheck.length != 0) {
                tilesToCheck.forEach(el => {
                    adjacentTiles = this.getAdjacentTiles(el)
                    adjacentTiles.forEach(ele => {
                        if (!(searchedTiles.includes(ele))) {
                            searchedTiles.push(ele)
                            unsearchedAdjacent.push(ele)
                        }
                    });
                });
                proximity++

                unsearchedAdjacent.forEach(el => {
                    el.setProximity(proximity)
                });
                setProximityRecursive(unsearchedAdjacent)
            }
        }
        let setProximityRecursive = setProximityRecursiveFunc.bind(this)
        let searchedTiles: Tile[] = []
        let startTile: Tile
        let endTile: Tile
        let proximity: number = 0
        startTile = this.tileTab[x1].find((el: Tile) => el.y == y1);
        this.savedStartTile = startTile;
        searchedTiles.push(startTile)
        
        setProximityRecursive(searchedTiles)
        startTile.setProximity(-2)
    }
    getPath(adjacentToEnd: Tile[], startTile: Tile, endTile: Tile) {
        function getPathRecursiveFunc(prevTile: Tile) {
            let adjacentToPrev: Tile[] = this.getAdjacentTiles(prevTile, "includeEnd")
            let lowestProximity: Tile = adjacentToPrev[0]
            adjacentToPrev.forEach(el => {
                if (el.proximity < lowestProximity.proximity) {
                    lowestProximity = el
                }
            });
            path.push(lowestProximity)
            if (lowestProximity.proximity == -2) {

            } else {
                getPathRecursive(lowestProximity)
            }
        }
        let path: Tile[] = []
        let getPathRecursive = getPathRecursiveFunc.bind(this)
        let lowestProximity: Tile = adjacentToEnd[0]
        
        

        if (lowestProximity == undefined || lowestProximity.proximity == -1) {
            
            
        } else {
            if (!endTile.ballInside) {
                path.push(endTile)
            }
            adjacentToEnd.forEach(el => {
                if (el.proximity < lowestProximity.proximity) {
                    lowestProximity = el
                }
            });
            path.push(lowestProximity)

            if (lowestProximity.proximity == -2) { } else {
                getPathRecursive(lowestProximity)
            }
            this.savedPath = path
            this.highlightPath(path);
        }


    }
    resetProximity() {
        this.tileTab.forEach(el => {
            el.forEach(ele => {
                ele.setProximity(-1)
            });
        });
    }
    resetHighlight() {
        this.savedPath.forEach(el => {
            el.highlightOff()
        });
    }
    highlightPath(path: Tile[]) {
        path.forEach(el => {
            el.highlightOn()
        });
    }

    moveBall(path: Tile[], ball: Ball, x: number, y: number) {
        this.tileTab[ball.x].find(el => el.y == ball.y).ballInside = false;
        this.tileTab[x].find(el => el.y == y).ballInside = true;
        let pathReversed: Tile[] = path.reverse()
        var i = 0;
        function animationLoop() {
            setTimeout(function () {
                ball.ball.style.top = 50 * pathReversed[i].y + "px"
                ball.ball.style.left = 50 * pathReversed[i].x + "px"
                i++;
                if (i < pathReversed.length) {
                    animationLoop();
                }
            }, 30)
        }
        animationLoop();
        this.ballTab[ball.x][ball.y] = null
        ball.x = x
        ball.y = y
        this.ballTab[x][y] = ball
        let ballsToDelete = this.checkPlace(x, y, ball)
        if (ballsToDelete.length > 0) {
            ballsToDelete.forEach(el => {
                if (el.x == null) {
                } else {
                    this.tileTab[el.x][el.y].ballInside = false;
                    this.ballTab[el.x][el.y] = null;
                }
                el.destroy()
                this.score++;
            });
            this.updateScore()
        } else {
            this.nextTurn()
        }
    }
    updateScore() {
        document.getElementById("scoreDisplay").innerHTML = this.score.toString()
    }
    @logNext
    nextTurn() {
        this.generateBalls(this.nextColors)
        this.nextColors = this.getColors(3)
        this.displayNextColors()
    }

    checkPlace(x: number, y: number, ball: Ball) {
        
        let verticalBalls: Ball[] = []
        let horizontalBalls: Ball[] = []
        let diagonalUpLeftBalls: Ball[] = []
        let diagonalDownLeftBalls: Ball[] = []
        //vertical
        this.ballTab[x].forEach(el => {
            if (el != null) {
                verticalBalls.push(el)
            }
        });
        //horizontal
        for (let x = 0; x < this.size; x++) {
            if (this.ballTab[x][y] != null) {
                horizontalBalls.push(this.ballTab[x][y])
            }
        }
        //diagonalUpLeftBalls
        let tempX: number = x
        let tempY: number = y
        while (tempX > 0 && tempY > 0) {
            if (tempX > 0) {
                tempX--
            }
            if (tempY > 0) {
                tempY--
            }
        }
        while (tempX < this.size && tempY < this.size) {
            if (this.ballTab[tempX][tempY] != null) {
                diagonalUpLeftBalls.push(this.ballTab[tempX][tempY])
            }
            tempX++
            tempY++
        }
        //diagonalDownLeftBalls
        tempX = x
        tempY = y
        while (tempX > 0 && tempY < this.size) {
            if (tempX > 0) {
                tempX--
            }
            if (tempY > 0) {
                tempY++
            }
        }
        while (tempX < this.size && tempY > 0) {
            if (this.ballTab[tempX][tempY] != null) {
                diagonalDownLeftBalls.push(this.ballTab[tempX][tempY])
            }
            tempX++
            tempY--
        }

        let ballsNeededToScore: number = 5
        let allBallsToDelete: Ball[] = []
        let axisBallsToDelete: Ball[] = []
        let tempAdjacentBalls: Ball[] = []
        let tempBallIndex: number;

        //Delete vertical
        //Delete vertical
        //Delete vertical
        if (verticalBalls.length >= ballsNeededToScore) {
            tempAdjacentBalls.push(ball)
            tempBallIndex = verticalBalls.indexOf(ball)
            while (tempBallIndex > 0) {
                tempBallIndex--
                if (verticalBalls[tempBallIndex] != undefined) {

                    if (verticalBalls[tempBallIndex].y + 1 == verticalBalls[tempBallIndex + 1].y) {
                        tempAdjacentBalls.unshift(verticalBalls[tempBallIndex])
                    } else {
                        break
                    }
                } else {
                    break
                }
            }
            tempBallIndex = verticalBalls.indexOf(ball)
            while (tempBallIndex < verticalBalls.length) {
                tempBallIndex++
                if (verticalBalls[tempBallIndex] != undefined) {
                    if (verticalBalls[tempBallIndex].y - 1 == verticalBalls[tempBallIndex - 1].y) {
                        tempAdjacentBalls.push(verticalBalls[tempBallIndex])
                    } else {
                        break
                    }
                } else {
                    break
                }
            }

            if (tempAdjacentBalls.length >= ballsNeededToScore) {
                axisBallsToDelete.push(ball)
                tempBallIndex = tempAdjacentBalls.indexOf(ball)
                while (tempBallIndex > 0) {
                    tempBallIndex--
                    if (tempAdjacentBalls[tempBallIndex] != undefined) {
                        if (tempAdjacentBalls[tempBallIndex].color == ball.color) {
                            axisBallsToDelete.unshift(tempAdjacentBalls[tempBallIndex])
                        } else {
                            break
                        }
                    } else {
                        break
                    }
                }
                tempBallIndex = tempAdjacentBalls.indexOf(ball)
                while (tempBallIndex < tempAdjacentBalls.length) {
                    tempBallIndex++
                    if (tempAdjacentBalls[tempBallIndex] != undefined) {
                        if (tempAdjacentBalls[tempBallIndex].color == ball.color) {
                            axisBallsToDelete.push(tempAdjacentBalls[tempBallIndex])
                        } else {
                            break
                        }
                    } else {
                        break
                    }
                }
            }
            if (axisBallsToDelete.length >= 5) {
                axisBallsToDelete.forEach(el => {
                    allBallsToDelete.push(el)
                });
                
            } else {
            }
            axisBallsToDelete = []
            tempAdjacentBalls = []
        }
        //Delete horizontalBalls
        //Delete horizontalBalls
        //Delete horizontalBalls
        if (horizontalBalls.length >= ballsNeededToScore) {
            tempAdjacentBalls.push(ball)
            tempBallIndex = horizontalBalls.indexOf(ball)
            while (tempBallIndex > 0) {
                tempBallIndex--
                if (horizontalBalls[tempBallIndex] != undefined) {

                    if (horizontalBalls[tempBallIndex].x + 1 == horizontalBalls[tempBallIndex + 1].x) {
                        tempAdjacentBalls.unshift(horizontalBalls[tempBallIndex])
                    } else {
                        break
                    }
                } else {
                    break
                }
            }
            tempBallIndex = horizontalBalls.indexOf(ball)
            while (tempBallIndex < horizontalBalls.length) {
                tempBallIndex++
                if (horizontalBalls[tempBallIndex] != undefined) {
                    if (horizontalBalls[tempBallIndex].x - 1 == horizontalBalls[tempBallIndex - 1].x) {
                        tempAdjacentBalls.push(horizontalBalls[tempBallIndex])
                    } else {
                        break
                    }
                } else {
                    break
                }
            }

            if (tempAdjacentBalls.length >= ballsNeededToScore) {
                axisBallsToDelete.push(ball)
                tempBallIndex = tempAdjacentBalls.indexOf(ball)
                while (tempBallIndex > 0) {
                    tempBallIndex--
                    if (tempAdjacentBalls[tempBallIndex] != undefined) {
                        if (tempAdjacentBalls[tempBallIndex].color == ball.color) {
                            axisBallsToDelete.unshift(tempAdjacentBalls[tempBallIndex])
                        } else {
                            break
                        }
                    } else {
                        break
                    }
                }
                tempBallIndex = tempAdjacentBalls.indexOf(ball)
                while (tempBallIndex < tempAdjacentBalls.length) {
                    tempBallIndex++
                    if (tempAdjacentBalls[tempBallIndex] != undefined) {
                        if (tempAdjacentBalls[tempBallIndex].color == ball.color) {
                            axisBallsToDelete.push(tempAdjacentBalls[tempBallIndex])
                        } else {
                            break
                        }
                    } else {
                        break
                    }
                }
            }
            if (axisBallsToDelete.length >= 5) {
                axisBallsToDelete.forEach(el => {
                    allBallsToDelete.push(el)
                });
                
            } else {
                
            }
            axisBallsToDelete = []
            tempAdjacentBalls = []

        }
        //Delete diagonalUpLeftBalls
        //Delete diagonalUpLeftBalls
        //Delete diagonalUpLeftBalls
        if (diagonalUpLeftBalls.length >= ballsNeededToScore) {
            tempAdjacentBalls.push(ball)
            tempBallIndex = diagonalUpLeftBalls.indexOf(ball)
            while (tempBallIndex > 0) {
                tempBallIndex--
                if (diagonalUpLeftBalls[tempBallIndex] != undefined) {

                    if (diagonalUpLeftBalls[tempBallIndex].x + 1 == diagonalUpLeftBalls[tempBallIndex + 1].x && diagonalUpLeftBalls[tempBallIndex].y + 1 == diagonalUpLeftBalls[tempBallIndex + 1].y) {
                        tempAdjacentBalls.unshift(diagonalUpLeftBalls[tempBallIndex])
                    } else {
                        break
                    }
                } else {
                    break
                }
            }
            tempBallIndex = diagonalUpLeftBalls.indexOf(ball)
            while (tempBallIndex < diagonalUpLeftBalls.length) {
                tempBallIndex++
                if (diagonalUpLeftBalls[tempBallIndex] != undefined) {
                    if (diagonalUpLeftBalls[tempBallIndex].x - 1 == diagonalUpLeftBalls[tempBallIndex - 1].x && diagonalUpLeftBalls[tempBallIndex].y - 1 == diagonalUpLeftBalls[tempBallIndex - 1].y) {
                        tempAdjacentBalls.push(diagonalUpLeftBalls[tempBallIndex])
                    } else {
                        break
                    }
                } else {
                    break
                }
            }

            if (tempAdjacentBalls.length >= ballsNeededToScore) {
                axisBallsToDelete.push(ball)
                tempBallIndex = tempAdjacentBalls.indexOf(ball)
                while (tempBallIndex > 0) {
                    tempBallIndex--
                    if (tempAdjacentBalls[tempBallIndex] != undefined) {
                        if (tempAdjacentBalls[tempBallIndex].color == ball.color) {
                            axisBallsToDelete.unshift(tempAdjacentBalls[tempBallIndex])
                        } else {
                            break
                        }
                    } else {
                        break
                    }
                }
                tempBallIndex = tempAdjacentBalls.indexOf(ball)
                while (tempBallIndex < tempAdjacentBalls.length) {
                    tempBallIndex++
                    if (tempAdjacentBalls[tempBallIndex] != undefined) {
                        if (tempAdjacentBalls[tempBallIndex].color == ball.color) {
                            axisBallsToDelete.push(tempAdjacentBalls[tempBallIndex])
                        } else {
                            break
                        }
                    } else {
                        break
                    }
                }
            }
            if (axisBallsToDelete.length >= 5) {
                axisBallsToDelete.forEach(el => {
                    allBallsToDelete.push(el)
                });
                
            } else {
                
            }
            axisBallsToDelete = []
            tempAdjacentBalls = []

        }
        //Delete diagonalDownLeftBalls
        //Delete diagonalDownLeftBalls
        //Delete diagonalDownLeftBalls
        if (diagonalDownLeftBalls.length >= ballsNeededToScore) {
            tempAdjacentBalls.push(ball)
            tempBallIndex = diagonalDownLeftBalls.indexOf(ball)
            while (tempBallIndex > 0) {
                tempBallIndex--
                if (diagonalDownLeftBalls[tempBallIndex] != undefined) {

                    if (diagonalDownLeftBalls[tempBallIndex].x + 1 == diagonalDownLeftBalls[tempBallIndex + 1].x && diagonalDownLeftBalls[tempBallIndex].y - 1 == diagonalDownLeftBalls[tempBallIndex + 1].y) {
                        tempAdjacentBalls.unshift(diagonalDownLeftBalls[tempBallIndex])
                    } else {
                        break
                    }
                } else {
                    break
                }
            }
            tempBallIndex = diagonalDownLeftBalls.indexOf(ball)
            while (tempBallIndex < diagonalDownLeftBalls.length) {
                tempBallIndex++
                if (diagonalDownLeftBalls[tempBallIndex] != undefined) {
                    if (diagonalDownLeftBalls[tempBallIndex].x - 1 == diagonalDownLeftBalls[tempBallIndex - 1].x && diagonalDownLeftBalls[tempBallIndex].y + 1 == diagonalDownLeftBalls[tempBallIndex - 1].y) {
                        tempAdjacentBalls.push(diagonalDownLeftBalls[tempBallIndex])
                    } else {
                        break
                    }
                } else {
                    break
                }
            }

            if (tempAdjacentBalls.length >= ballsNeededToScore) {
                axisBallsToDelete.push(ball)
                tempBallIndex = tempAdjacentBalls.indexOf(ball)
                while (tempBallIndex > 0) {
                    tempBallIndex--
                    if (tempAdjacentBalls[tempBallIndex] != undefined) {
                        if (tempAdjacentBalls[tempBallIndex].color == ball.color) {
                            axisBallsToDelete.unshift(tempAdjacentBalls[tempBallIndex])
                        } else {
                            break
                        }
                    } else {
                        break
                    }
                }
                tempBallIndex = tempAdjacentBalls.indexOf(ball)
                while (tempBallIndex < tempAdjacentBalls.length) {
                    tempBallIndex++
                    if (tempAdjacentBalls[tempBallIndex] != undefined) {
                        if (tempAdjacentBalls[tempBallIndex].color == ball.color) {
                            axisBallsToDelete.push(tempAdjacentBalls[tempBallIndex])
                        } else {
                            break
                        }
                    } else {
                        break
                    }
                }
            }
            if (axisBallsToDelete.length >= 5) {
                axisBallsToDelete.forEach(el => {
                    allBallsToDelete.push(el)
                });
                
            } else {
                
            }
            axisBallsToDelete = []
            tempAdjacentBalls = []
        }
        
        return allBallsToDelete
    }

}

export default { GameGrid }

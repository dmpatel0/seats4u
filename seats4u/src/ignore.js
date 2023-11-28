import { toHaveAccessibleDescription } from "@testing-library/jest-dom/matchers"

export class Cell {

    constructor(r, c, color, isColor) {
        this.row = r
        this.column = c
        this.color = color
        this.isColor = isColor
        //this.isNinjaSe = isNinjaSe
    }

}

export class Puzzle {

    constructor(nr, nc, ninjaRow, ninjaColumn, initial) {
        this.nr = nr
        this.nc = nc
        // Since ninjase is anchored in the top left
        this.maxNinjaRow = this.nr-1
        this.maxNinjaColumn = ""
        this.isSolved = false

        switch(this.nc) {
            case '4':
                this.maxNinjaColumn = "C"
                break
            case '5':
                this.maxNinjaColumn = "D"
                break
            case '6':
                this.maxNinjaColumn = "E"
                break
            default:
                break
        }

        this.ninjaRow = parseInt(ninjaRow) // These are updated as NinjaSe moves
        this.ninjaColumn = ninjaColumn // These are updated as NinjaSe moves
        this.initial = []
        this.initial = initial

        this.alphabetToNumber = new Map()
        this.numbertoAlphabet = new Map()

        this.alphabetToNumber.set("A", 1)
        this.alphabetToNumber.set("B", 2)
        this.alphabetToNumber.set("C", 3)
        this.alphabetToNumber.set("D", 4)
        this.alphabetToNumber.set("E", 5)
        this.alphabetToNumber.set("F", 6)

        this.numbertoAlphabet.set(1, "A")
        this.numbertoAlphabet.set(2, "B")
        this.numbertoAlphabet.set(3, "C")
        this.numbertoAlphabet.set(4, "D")
        this.numbertoAlphabet.set(5, "E")
        this.numbertoAlphabet.set(6, "F")

        this.cells = []

        for (let r = 0; r < nr; r++) {
            this.cells[r] = []; 

            for (let c = 0; c < nc; c++) {

                let cellAdded = 0

                for(let i = 0; i < this.initial.length; i++) {
                    if((this.alphabetToNumber.get(this.initial[i].column)-1 === c) && (this.initial[i].row-1 === r)) {
                        this.cells[r][c] = new Cell(r, c, this.initial[i].color, true)
                        cellAdded = 1
                        break
                    }
                }
                
                if(cellAdded) {
                    continue
                } else if(((this.ninjaRow-1 === r) && (this.alphabetToNumber.get(this.ninjaColumn) === c)) || 
                          ((this.ninjaRow-1 === r) && (this.alphabetToNumber.get(this.ninjaColumn)-1 === c)) || 
                          ((this.ninjaRow === r) && (this.alphabetToNumber.get(this.ninjaColumn)-1 === c)) || 
                          ((this.ninjaRow === r) && (this.alphabetToNumber.get(this.ninjaColumn) === c))) {
                    this.cells[r][c] = new Cell(r, c, "#22b14c", false)
                } else {
                    this.cells[r][c] = new Cell(r, c, "#ffffff", false)
                }

            }

        }  

    }

    moveRight() {

        let numPushed = 0

        if(this.ninjaColumn !== this.maxNinjaColumn) {

            let topRightOfNinjaSe = this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))+1]
            let bottomRightOfNinjaSe = this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))+1]
            
            if(topRightOfNinjaSe.isColor || bottomRightOfNinjaSe.isColor) {

                if(this.ninjaColumn === this.numbertoAlphabet.get((this.alphabetToNumber.get((this.maxNinjaColumn))-1))) {
                    // Actually moving ninjaSe
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))+1].color = "#22b14c"// top right
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))+1].isColor = false// top right
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))+1].color = "#22b14c"// bottom right
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))+1].isColor = false// bottom right
                    
                    // Make previous top left of ninjaSe a blank cell
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))-1].isColor = false
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))-1].color = "#ffffff"
                    // Make previous bottom left of ninjaSe a blank cell
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))-1].isColor = false
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))-1].color = "#ffffff"
                    // Update ninjaSe location
                    let curCol = this.alphabetToNumber.get(this.ninjaColumn)
                    console.log(curCol)
                    this.ninjaColumn = this.numbertoAlphabet.get(curCol+1)

                    console.log("PUSHING COLOR OFF BOARD....")

                    return 1;
                }

                let twoSquaresOverTOP = this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))+2]
                let twoSquaresOverBOTTOM = this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))+2]

                if(twoSquaresOverTOP.isColor !== true || twoSquaresOverBOTTOM.isColor !== true) {
                    if(topRightOfNinjaSe.isColor) {

                            // Make the next empty cell next to the color the colored cell
                            //this.cells[this.ninjaRow-1][this.ninjaColumn-3].isNinjaSe = false
                            this.cells[this.ninjaRow-1][this.alphabetToNumber.get(this.ninjaColumn)+2].isColor = true
                            this.cells[this.ninjaRow-1][this.alphabetToNumber.get(this.ninjaColumn)+2].color = topRightOfNinjaSe.color

                            numPushed++
                        
                    }

                    if(bottomRightOfNinjaSe.isColor) {

                            // Make the next empty cell next to the color the colored cell
                            //this.cells[this.ninjaRow-2][this.ninjaColumn-3].isNinjaSe = false
                            this.cells[this.ninjaRow][this.alphabetToNumber.get(this.ninjaColumn)+2].isColor = true
                            this.cells[this.ninjaRow][this.alphabetToNumber.get(this.ninjaColumn)+2].color = bottomRightOfNinjaSe.color

                            numPushed++
                        
                    }

                    // Actually moving ninjaSe
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))+1].color = "#22b14c"// top right
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))+1].isColor = false// top right
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))+1].color = "#22b14c"// bottom right
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))+1].isColor = false// bottom right
                    
                    // Make previous top left of ninjaSe a blank cell
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))-1].isColor = false
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))-1].color = "#ffffff"
                    // Make previous bottom left of ninjaSe a blank cell
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))-1].isColor = false
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))-1].color = "#ffffff"
                    // Update ninjaSe location
                    let curCol = this.alphabetToNumber.get(this.ninjaColumn)
                    this.ninjaColumn = this.numbertoAlphabet.get(curCol+1)

                    return (numPushed)

                } else {
                    console.log("MULTIPLE PUSH NOT YET IMPLEMENTED!!")
                    return -1;
                }

            } else {
                // Actually moving ninjaSe
                this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))+1].color = "#22b14c"// top right
                this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))+1].isColor = false// top right
                this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))+1].color = "#22b14c"// bottom right
                this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))+1].isColor = false// bottom right
                
                // Make previous top left of ninjaSe a blank cell
                this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))-1].isColor = false
                this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))-1].color = "#ffffff"
                // Make previous bottom left of ninjaSe a blank cell
                this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))-1].isColor = false
                this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))-1].color = "#ffffff"
                // Update ninjaSe location
                let curCol = this.alphabetToNumber.get(this.ninjaColumn)
                this.ninjaColumn = this.numbertoAlphabet.get(curCol+1)

                console.log(`Sending move right request...`)
                return 0 
            } 

            
        } else {
            console.log("UNABLE TO MOVE... AT THE EDGE OF THE BOARD")
            return -1
        }
    }

    moveLeft() {    

        let numPushed = 0

        if(this.ninjaColumn !== "A") {

            let topLeftOfNinjaSe = this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))-2]
            let bottomLeftOfNinjaSe = this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))-2]
            
            if((topLeftOfNinjaSe.isColor || bottomLeftOfNinjaSe.isColor)) {

                if(this.ninjaColumn === "B") {
                    // Actually moving ninjaSe
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))-2].color = "#22b14c"// top left
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))-2].isColor = false
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))-2].color = "#22b14c"// bottom left
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))-2].isColor = false // bottom left
                    
                    // Make previous top right of ninjaSe a blank cell
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))].isColor = false
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))].color = "#ffffff"
                    // Make previous bottom right of ninjaSe a blank cell
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))].isColor = false
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))].color = "#ffffff"
                    // Update ninjaSe location
                    let curCol = this.alphabetToNumber.get(this.ninjaColumn)
                    this.ninjaColumn = this.numbertoAlphabet.get(curCol-1)

                    console.log("MOVING COLOR OFF BOARD...")
                    return 1;
                }

                let twoSquaresOverTOP = this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))-3]
                let twoSquaresOverBOTTOM = this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))-3]

                if(twoSquaresOverTOP.isColor !== true || twoSquaresOverBOTTOM.isColor !== true) {
                    if(topLeftOfNinjaSe.isColor) {
    
                            // Make the next empty cell next to the color the colored cell
                            //this.cells[this.ninjaRow-1][this.ninjaColumn-3].isNinjaSe = false
                            this.cells[this.ninjaRow-1][this.alphabetToNumber.get(this.ninjaColumn)-3].isColor = true
                            this.cells[this.ninjaRow-1][this.alphabetToNumber.get(this.ninjaColumn)-3].color = topLeftOfNinjaSe.color

                            numPushed++
                        
                    }
    
                    if(bottomLeftOfNinjaSe.isColor) {
    
                            // Make the next empty cell next to the color the colored cell
                            //this.cells[this.ninjaRow-2][this.ninjaColumn-3].isNinjaSe = false
                            this.cells[this.ninjaRow][this.alphabetToNumber.get(this.ninjaColumn)-3].isColor = true
                            this.cells[this.ninjaRow][this.alphabetToNumber.get(this.ninjaColumn)-3].color = bottomLeftOfNinjaSe.color

                            numPushed++
                        
                    }
                    // Actually moving ninjaSe
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))-2].color = "#22b14c"// top left
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))-2].isColor = false
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))-2].color = "#22b14c"// bottom left
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))-2].isColor = false // bottom left
                    
                    // Make previous top right of ninjaSe a blank cell
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))].isColor = false
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))].color = "#ffffff"
                    // Make previous bottom right of ninjaSe a blank cell
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))].isColor = false
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))].color = "#ffffff"
                    // Update ninjaSe location
                    let curCol = this.alphabetToNumber.get(this.ninjaColumn)
                    this.ninjaColumn = this.numbertoAlphabet.get(curCol-1)
                    console.log(`Sending move left request...`)
                    return (numPushed)
                } else {
                    console.log("MULTIPLE PUSH NOT YET IMPLEMENTED!!")
                    return -1;
                }
            } else {
                // Actually moving ninjaSe
                this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))-2].color = "#22b14c"// top left
                this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))-2].isColor = false
                this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))-2].color = "#22b14c"// bottom left
                this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))-2].isColor = false // bottom left
                
                // Make previous top right of ninjaSe a blank cell
                this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))].isColor = false
                this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))].color = "#ffffff"
                // Make previous bottom right of ninjaSe a blank cell
                this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))].isColor = false
                this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))].color = "#ffffff"
                // Update ninjaSe location
                let curCol = this.alphabetToNumber.get(this.ninjaColumn)
                this.ninjaColumn = this.numbertoAlphabet.get(curCol-1)

                console.log(`Sending move left request...`)
                return 0
            }
            
        } else {
            console.log("UNABLE TO MOVE... AT THE EDGE OF THE BOARD")
            return -1
        }
    }

    moveUp() {

        let numPushed = 0

        if(this.ninjaRow !== 1) {

            let rightTopOfNinjaSe = this.cells[this.ninjaRow-2][(this.alphabetToNumber.get(this.ninjaColumn))]
            let leftTopOfNinjaSe = this.cells[this.ninjaRow-2][(this.alphabetToNumber.get(this.ninjaColumn))-1]
            
            if((rightTopOfNinjaSe.isColor || leftTopOfNinjaSe.isColor)) {

                if(this.ninjaRow === 2) {
                    // Actually moving ninjaSe
                    this.cells[this.ninjaRow-2][(this.alphabetToNumber.get(this.ninjaColumn))-1].color = "#22b14c"// top left
                    this.cells[this.ninjaRow-2][(this.alphabetToNumber.get(this.ninjaColumn))-1].isColor = false// top left
                    this.cells[this.ninjaRow-2][(this.alphabetToNumber.get(this.ninjaColumn))].color = "#22b14c"// top right
                    this.cells[this.ninjaRow-2][(this.alphabetToNumber.get(this.ninjaColumn))].isColor = false// top right
                    
                    // Make previous bottom right a blank cell
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))].isColor = false
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))].color = "#ffffff"
                    // Make previous bottom left of ninjaSe a blank cell
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))-1].isColor = false
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))-1].color = "#ffffff"
                    // Update ninjaSe location
                    let curRow = this.ninjaRow
                    this.ninjaRow = curRow-1

                    console.log("PUSHING COLOR OFF THE BOARD")
                    return 1;
                }

                let twoSquaresAboveLeft = this.cells[this.ninjaRow-3][(this.alphabetToNumber.get(this.ninjaColumn))-1]
                let twoSquaresAboveRight = this.cells[this.ninjaRow-3][(this.alphabetToNumber.get(this.ninjaColumn))]

                if(twoSquaresAboveLeft.isColor !== true && twoSquaresAboveRight.isColor !== true) {

                    if(leftTopOfNinjaSe.isColor) {

                            // Make the next empty cell next to the color the colored cell
                            //this.cells[this.ninjaRow-1][this.ninjaColumn-3].isNinjaSe = false
                            this.cells[this.ninjaRow-3][this.alphabetToNumber.get(this.ninjaColumn)-1].isColor = true
                            this.cells[this.ninjaRow-3][this.alphabetToNumber.get(this.ninjaColumn)-1].color = leftTopOfNinjaSe.color

                            numPushed++
                        
                    }

                    if(rightTopOfNinjaSe.isColor) {

                            // Make the next empty cell next to the color the colored cell
                            //this.cells[this.ninjaRow-2][this.ninjaColumn-3].isNinjaSe = false
                            this.cells[this.ninjaRow-3][this.alphabetToNumber.get(this.ninjaColumn)].isColor = true
                            this.cells[this.ninjaRow-3][this.alphabetToNumber.get(this.ninjaColumn)].color = rightTopOfNinjaSe.color

                            numPushed++
                        
                    }

                    // Actually moving ninjaSe
                    this.cells[this.ninjaRow-2][(this.alphabetToNumber.get(this.ninjaColumn))-1].color = "#22b14c"// top left
                    this.cells[this.ninjaRow-2][(this.alphabetToNumber.get(this.ninjaColumn))-1].isColor = false// top left
                    this.cells[this.ninjaRow-2][(this.alphabetToNumber.get(this.ninjaColumn))].color = "#22b14c"// top right
                    this.cells[this.ninjaRow-2][(this.alphabetToNumber.get(this.ninjaColumn))].isColor = false// top right
                    
                    // Make previous bottom right a blank cell
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))].isColor = false
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))].color = "#ffffff"
                    // Make previous bottom left of ninjaSe a blank cell
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))-1].isColor = false
                    this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))-1].color = "#ffffff"
                    // Update ninjaSe location
                    let curRow = this.ninjaRow
                    this.ninjaRow = curRow-1

                    console.log(`Sending move up request...`)
                    return (numPushed)
                } else {
                    console.log("MULTIPLE PUSH NOT YET IMPLEMENTED!!")
                    return -1;
                }

            } else {
                // Actually moving ninjaSe
                this.cells[this.ninjaRow-2][(this.alphabetToNumber.get(this.ninjaColumn))-1].color = "#22b14c"// top left
                this.cells[this.ninjaRow-2][(this.alphabetToNumber.get(this.ninjaColumn))-1].isColor = false// top left
                this.cells[this.ninjaRow-2][(this.alphabetToNumber.get(this.ninjaColumn))].color = "#22b14c"// top right
                this.cells[this.ninjaRow-2][(this.alphabetToNumber.get(this.ninjaColumn))].isColor = false// top right
                
                // Make previous bottom right a blank cell
                this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))].isColor = false
                this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))].color = "#ffffff"
                // Make previous bottom left of ninjaSe a blank cell
                this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))-1].isColor = false
                this.cells[this.ninjaRow][(this.alphabetToNumber.get(this.ninjaColumn))-1].color = "#ffffff"
                // Update ninjaSe location
                let curRow = this.ninjaRow
                this.ninjaRow = curRow-1

                console.log(`Sending move up request...`)
                return 0
            } 

            
        } else {
            console.log("UNABLE TO MOVE... AT THE EDGE OF THE BOARD")
            return -1
        }
    }

    moveDown() {

        let numPushed = 0

        if(this.ninjaRow !== this.maxNinjaRow) {

            let rightBottomOfNinjaSe = this.cells[this.ninjaRow+1][(this.alphabetToNumber.get(this.ninjaColumn))]
            let leftBottomOfNinjaSe = this.cells[this.ninjaRow+1][(this.alphabetToNumber.get(this.ninjaColumn))-1]

            if((rightBottomOfNinjaSe.isColor || leftBottomOfNinjaSe.isColor)) {

                if(this.ninjaRow === this.maxNinjaRow-1) {
                    // Actually moving ninjaSe
                    this.cells[this.ninjaRow+1][(this.alphabetToNumber.get(this.ninjaColumn))-1].color = "#22b14c" // bottom left
                    this.cells[this.ninjaRow+1][(this.alphabetToNumber.get(this.ninjaColumn))-1].isColor = false // bottom left
                    this.cells[this.ninjaRow+1][(this.alphabetToNumber.get(this.ninjaColumn))].color = "#22b14c"// bottom right
                    this.cells[this.ninjaRow+1][(this.alphabetToNumber.get(this.ninjaColumn))].isColor = false// bottom right
                    
                    // Make previous top right a blank cell
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))].isColor = false
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))].color = "#ffffff"
                    // Make previous top left of ninjaSe a blank cell
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))-1].isColor = false
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))-1].color = "#ffffff"
                    // Update ninjaSe location
                    let curRow = this.ninjaRow
                    this.ninjaRow = curRow+1

                    console.log("PUSHING COLOR OFF THE BOARD")
                    return 1;
                }

                let twoSquaresBelowLeft = this.cells[this.ninjaRow+1][(this.alphabetToNumber.get(this.ninjaColumn))-1]
                let twoSquaresBelowRight = this.cells[this.ninjaRow+1][(this.alphabetToNumber.get(this.ninjaColumn))]
    
                if(twoSquaresBelowLeft.isColor !== true || twoSquaresBelowRight.isColor !== true) {
                    if(leftBottomOfNinjaSe.isColor) {

                            // Make the next empty cell next to the color the colored cell
                            //this.cells[this.ninjaRow-1][this.ninjaColumn-3].isNinjaSe = false
                            this.cells[this.ninjaRow+2][this.alphabetToNumber.get(this.ninjaColumn)-1].isColor = true
                            this.cells[this.ninjaRow+2][this.alphabetToNumber.get(this.ninjaColumn)-1].color = leftBottomOfNinjaSe.color

                            numPushed++ 
                    }

                    if(rightBottomOfNinjaSe.isColor) {

                            // Make the next empty cell next to the color the colored cell
                            //this.cells[this.ninjaRow-2][this.ninjaColumn-3].isNinjaSe = false
                            this.cells[this.ninjaRow+2][this.alphabetToNumber.get(this.ninjaColumn)].isColor = true
                            this.cells[this.ninjaRow+2][this.alphabetToNumber.get(this.ninjaColumn)].color = rightBottomOfNinjaSe.color

                            numPushed++
                    }

                    // Actually moving ninjaSe
                    this.cells[this.ninjaRow+1][(this.alphabetToNumber.get(this.ninjaColumn))-1].color = "#22b14c" // bottom left
                    this.cells[this.ninjaRow+1][(this.alphabetToNumber.get(this.ninjaColumn))-1].isColor = false // bottom left
                    this.cells[this.ninjaRow+1][(this.alphabetToNumber.get(this.ninjaColumn))].color = "#22b14c"// bottom right
                    this.cells[this.ninjaRow+1][(this.alphabetToNumber.get(this.ninjaColumn))].isColor = false// bottom right
                    
                    // Make previous top right a blank cell
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))].isColor = false
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))].color = "#ffffff"
                    // Make previous top left of ninjaSe a blank cell
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))-1].isColor = false
                    this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))-1].color = "#ffffff"
                    // Update ninjaSe location
                    let curRow = this.ninjaRow
                    this.ninjaRow = curRow+1

                    console.log(`Sending move down request...`)
                    return (numPushed)
                } else {
                    console.log("MULTIPLE PUSH NOT YET IMPLEMENTED!!")
                    return -1;
                }

            } else {
                // Actually moving ninjaSe
                this.cells[this.ninjaRow+1][(this.alphabetToNumber.get(this.ninjaColumn))-1].color = "#22b14c"// bottom left
                this.cells[this.ninjaRow+1][(this.alphabetToNumber.get(this.ninjaColumn))].color = "#22b14c"// bottom right
                
                // Make previous top right a blank cell
                this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))].isColor = false
                this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))].color = "#ffffff"
                // Make previous top left of ninjaSe a blank cell
                this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))-1].isColor = false
                this.cells[this.ninjaRow-1][(this.alphabetToNumber.get(this.ninjaColumn))-1].color = "#ffffff"
                // Update ninjaSe location
                let curRow = this.ninjaRow
                this.ninjaRow = curRow+1

                console.log(`Sending move down request...`)
                return 0
            } 

            
        } else {
            console.log("UNABLE TO MOVE... AT THE EDGE OF THE BOARD")
            return -1
        }
    }

    removeColorGroups() {

        let numRemoved = 0

        for(let r = 0; r < this.nr; r++) {
            for(let c = 0; c < this.nc; c++) {

                // Don't bother checking edge of board since the square grouping is checked left to right anyway
                // Group cannot possibly exist off the board
                if(r === this.nr-1 || c === this.nc-1) {
                    continue;
                }

                let cellColor = this.cells[r][c].color

                if(this.cells[r][c].isColor) {
                    if((this.cells[r][c+1].color === cellColor) &&
                       (this.cells[r+1][c].color === cellColor) &&
                       (this.cells[r+1][c+1].color === cellColor))
                    {

                        this.cells[r][c].isColor = false
                        this.cells[r][c+1].isColor = false
                        this.cells[r+1][c].isColor = false
                        this.cells[r+1][c+1].isColor = false

                        this.cells[r][c].color = "#ffffff"
                        this.cells[r][c+1].color = "#ffffff"
                        this.cells[r+1][c].color = "#ffffff"
                        this.cells[r+1][c+1].color = "#ffffff"

                        numRemoved++;
                    }
                }
            }
        }

        return numRemoved
    }

    checkSolved() {
        for(let r = 0; r < this.nr; r++) {
            for(let c = 0; c < this.nc; c++) {
                if(this.cells[r][c].isColor) {
                    return 0
                }
            }
        }
        this.isSolved = true
        return 1
    }

}

export class Model {

    constructor(config) {
        this.config = config
        this.configName = ""
        switch(this.config.name) {
            case "Configuration #1":
                this.configName = "config_5x5"
                break
            case "Configuration #2":
                this.configName = "config_4x4"
                break
            case "Configuration #3":
                this.configName = "config_6x6"
                break
        }
        let nr = this.config.numRows
        let nc = this.config.numColumns
        let ninjaRow = this.config.ninjaRow
        let ninjaColumn = this.config.ninjaColumn
        let initial = this.config.initial
        this.puzzle = new Puzzle(nr, nc, ninjaRow, ninjaColumn, initial)
        this.isSolved = 0

        this.score = 0
        this.numMoves = 0
    }

    moveHandler(direction) {

        switch(direction) {
          case "right":
            if(!this.puzzle.isSolved) {
                let retVal_r = this.puzzle.moveRight()
                if(retVal_r >= 0) {
                    this.score += retVal_r
                    this.numMoves++
                }
            }
            
            break
          case "left":
            if(!this.puzzle.isSolved) {
                let retVal_l = this.puzzle.moveLeft()
                if(retVal_l >= 0) {
                    this.score += retVal_l
                    this.numMoves++
                }
            }
            
            break
          case "up":
            if(!this.puzzle.isSolved) {
                let retVal_u = this.puzzle.moveUp()
                if(retVal_u >= 0) {
                    this.score += retVal_u
                    this.numMoves++
                }
            }
            break
          case "down":
            if(!this.puzzle.isSolved) {
                let retVal_d = this.puzzle.moveDown()
                if(retVal_d >= 0) {
                    this.score += retVal_d
                    this.numMoves++
                }
            }
            break
          default:
            break
        } 
    }

    solveHandler() {
        let numRemoved = this.puzzle.removeColorGroups()
        if(numRemoved > 0) {
            this.numMoves++
        }
        this.score += (4*numRemoved)
        this.isSolved = this.puzzle.checkSolved()
    }

}
import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';
import Click from './sounds/select.mp3';
import Win from './sounds/win.mp3'
import { Howl, Howler } from "howler"


/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

 let audioClips = [
    {sound : Click, label : "Click"},
    {sound : Win, label : "Win"}
]

class Board extends Component {

  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: 0.25
  }
  constructor(props) {
    super(props);

    this.state = {
      hasWon: false,
      board : this.createBoard(),
    }
  }

  soundPlay (src) {
    let sound = new Howl({
      src
    })
    sound.play()
  }
  
  createBoard() {
    let board = [];
    for (let y = 0; y < this.props.nrows; y++) {
      let row = [];
      for (let x = 0; x < this.props.ncols; x++) {
        row.push(Math.random() < this.props.chanceLightStartsOn)
      }
      board.push(row)
    }

    return board
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    this.soundPlay(audioClips[0].sound)
    let { ncols, nrows } = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);
    function flipCell(y, x) {
      // if this coord is actually on board, flip it

      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }

    flipCell(y,x) // FLIP CLICKED CELL
    flipCell(y, x+1) // FLIP RIGHT CELL
    flipCell(y, x-1) // FLIP LEFT CELL
    flipCell(y+1, x) // FLIP ABOVE CELL
    flipCell(y-1, x) // FLIP BELOW CELL

    // win when every cell is turned off
    // TODO: determine is the game has been won

    let hasWon = board.every(row => row.every(cell => !cell))

    this.setState({ board: board, hasWon: hasWon });
  }
  render() {
    Howler.volume(0.2)
    let { board } = this.state

    let drawBoard = () => {
      let tblBoard = [];
      for (let y = 0; y < this.props.nrows; y++) {
      let row = [];
      for (let x = 0; x < this.props.ncols; x++) {
        let coord = `${y}-${x}`
        row.push(<Cell key={ coord } isLit={ board[y][x]  } flipCellsAroundMe={ () => this.flipCellsAround(coord) } />)
      }
      tblBoard.push(<tr key={ y }>{ row }</tr>)
      }
      return tblBoard
    }
    return (
      <div>
        { this.state.hasWon && this.soundPlay(audioClips[1].sound) }
        { 
        this.state.hasWon 
        ? (
            <div className="Board-title">
                <div className="winner">
                  <span className="neon-orange">YOU</span>
                  <span className="neon-blue">WIN !</span>
                </div>
            </div>
          )
        : (
          <div>
            <div className="Board-title">
          <span className="neon-orange">Lights</span>
          <span className="neon-blue">Out</span>
            </div>
            <table className="Board">
            <tbody>
              { drawBoard() }
            </tbody>
            </table>
          </div>
          )
        }
      </div>
    )
  }
}


export default Board;

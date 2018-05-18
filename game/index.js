import {Map} from 'immutable';
import {combineReducers} from 'redux';
let board = Map()
// .set(0,{0:'_', 1:'_', 2:'_'})
// .set(1,{0:'_', 1:'_', 2:'_'})
// .set(2,{0:'_', 1:'_', 2:'_'});
const MOVE = 'MOVE';

export const move = ( player, coord) => ({
  type: MOVE,
  coord,
  player,
})

const initialState = {turn:'X', board}

function winner(board) {
  for(let i=0; i!=3; i++){
      if(board.getIn([i,0]) === board.getIn([i,1]) && board.getIn([i,2]) === board.getIn([i,1])){
          return board.getIn([i, 1])
      }else if(board.getIn([0,i]) === board.getIn([1, i]) && board.getIn([2, i]) === board.getIn([1,i])){
          return board.getIn([1, i])
      }
  }
  if(board.getIn([0,0]) === board.getIn([1,1]) && board.getIn([2,2]) === board.getIn([1,1])){
      return board.getIn([1, 1])
  }
  else if(board.getIn([2,0]) === board.getIn([1,1]) && board.getIn([0,2]) === board.getIn([1,1])){
      return board.getIn([1,1])    
  }
  else if(board.every(row => row.count() === 3)){
      return 'DRAW'
  }
  return null
}

function bad(state, action){
  if(action.type === MOVE){
    const [row, col] = action.coord;
    if(!Array.isArray(action.coord) || row > 2 || col > 2 || row < 0 || col < 0 || isNaN(row) || isNaN(col)){
      return 'bad coordinates'
    }else if(state.turn !== action.player){
      return 'not your turn'
    }else if(state.board.hasIn(action.coord)){
      return 'already taken'
    }else{
      return null
    }
  }
}

// export default function reducer(state = initialState, action) {
//   switch(action.type){
//     case MOVE:
//       const newBoard = state.board.setIn(action.coord, action.player);
//       const newState = {turn: state.turn === 'X' ? 'O' : 'X', board:newBoard }
//       return newState
//     default:
//       return state;
//   }
//   return state
// }


function turnReducer(state = 'X', action){
  if(action.type === MOVE){
    return state === 'X' ? 'O' : 'X'
  }else{
    return state
  }
}

function boardReducer(state = board, action){
  if(action.type === MOVE){
    return state.setIn(action.coord, action.player)
  }else{
    return state
  }
}

export default function reducer(state={}, action) {
  const error = bad(state, action);
  if(error){
    return Object.assign({},state, {error})
  }
  const nextBoard = boardReducer(state.board, action)
  const winnerState = winner(nextBoard)

  return {
    board: nextBoard,
    turn: turnReducer(state.turn, action),
    winner: winnerState,
  }
}

// export default combineReducers({
//   turnReducer,
//   boardReducer
// })
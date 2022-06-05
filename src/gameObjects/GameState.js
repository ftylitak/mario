class GameState {
    static StateSearchingPrincess = "searchingPrincess"
    static StateJustReachedDanceFloor = "justReachedDanceFloor"
    static StateReboundDancing = "reboundDancing"
    static StateHeadingToShip = "headingToShip"
    static StateOnShip = "onShip"
    static StateReachedCrete = "reachedCrete"
    static StateFinale = "finale"

    static scenarioStates = [
        GameState.StateSearchingPrincess,
        GameState.StateJustReachedDanceFloor,
        GameState.StateReboundDancing,
        GameState.StateHeadingToShip,
        GameState.StateOnShip,
        GameState.StateReachedCrete,
        GameState.StateFinale,
    ]

    static currentStateIndex = 0

    static getCurrentGameState() {
        return GameState.scenarioStates[GameState.currentStateIndex]
    }

    static goToNextState() {
        GameState.currentStateIndex++
    }
}

export default GameState;

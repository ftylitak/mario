class GameState {
    static StateSearchingPrincess = "searchingPrincess"
    static StateJustReachedDanceFloor = "justReachedDanceFloor"
    static StateReboundDancing = "reboundDancing"
    static StateHeadingToShip = "headingToShip"
    static StateOnShipMario = "onShipMario"
    static StateOnShipPrincess = "onShipPrincess"
    static StateReachedCrete = "reachedCrete"
    static StateFinale = "finale"

    static scenarioStates = [
        GameState.StateSearchingPrincess,
        GameState.StateJustReachedDanceFloor,
        GameState.StateReboundDancing,
        GameState.StateHeadingToShip,
        GameState.StateOnShipMario,
        GameState.StateOnShipPrincess,
        GameState.StateReachedCrete,
        GameState.StateFinale,
    ]

    static currentStateIndex = 0

    static getCurrentGameState() {
        return GameState.scenarioStates[GameState.currentStateIndex]
    }

    static goToNextState() {
        GameState.currentStateIndex++
        console.log("new game state: ", GameState.getCurrentGameState())
    }

    static goToNextStateTimed(timeoutMs=3000) {
        setTimeout(() => {
            GameState.goToNextState()
        }, timeoutMs);
    }
}

export default GameState;

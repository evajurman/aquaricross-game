type Position = {
  x: number;
  y: number;
};

type CTX = CanvasRenderingContext2D;

type GameState = {
  screen: "Menu" | "Settings" | "Board";
};

type GameStateMenu = {
  selection: "Play" | "Settings";
};

type GameStateBoard = {
  startTime: Date;
  endTime: Date | undefined;
  selection: [number, number];
  mode: "Nonogram" | "Aquarium";
  fills: [number, number][];
  crosses: [number, number][];
  solution: [number, number][];
  tanks: [number, number][][];
};

type GameInput = {
  buttonUp: boolean;
  buttonDown: boolean;
  buttonRight: boolean;
  buttonLeft: boolean;
  buttonSelect: boolean;
  buttonBack: boolean;
  buttonFillSquare: boolean;
  buttonCrossSquare: boolean;
  buttonShiftBoard: boolean;
};

interface Window {
  frameNumber: number;
  gameState: GameState;
  gameStateMenu: GameStateMenu;
  gameStateBoard: GameStateBoard;
  input: {
    p1: GameInput;
    p2: GameInput;
    p1Previous: GameInput;
    p2Previous: GameInput;
  };
  keySettings: {
    buttonUp: string;
    buttonDown: string;
    buttonRight: string;
    buttonLeft: string;
    buttonSelect: string;
    buttonBack: string;
    buttonFillSquare: string;
    buttonCrossSquare: string;
    buttonShiftBoard: string;
  };
}

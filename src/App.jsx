import Game from "./Game"

import fs from 'fs';
import path from 'path';

export function GET_PRESETS(subdirectory) {
  let presetsPath = path.join(process.cwd(), '/presets_library/' + subdirectory);
  let files = fs.readdirSync(presetsPath);
  return new Response(files);
}

function App() {

  return (
    <>
      <Game />
    </>
  );
}

export default App

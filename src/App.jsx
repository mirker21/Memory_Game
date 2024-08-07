import Game from "./Game"

import fs from 'fs';
import path from 'path';

export function GET_PRESETS(subdirectory) {
  let presetsPath = path.join(process.cwd(), '/presets_library/' + subdirectory);
  let files = fs.readdirSync(presetsPath);
  return new Response(files);
}

const presets = GET_PRESETS('layout_presets')
console.log(presets)

function App() {

  return (
    <>
      <Game />
    </>
  );
}

export default App

import './style.css'

import { Emitter } from './emitter';

const limit = 100;
const chunkSize = 10;

const [command, event] = [new Emitter<Commands>(), new Emitter<Events>()]

function initWorker(){
  const worker = new Worker(new URL('./worker.ts', import.meta.url));
  worker.onmessage = ({data}) => event.emit(data.type, ...data.data);

  command.on('execute', (limit, chunkSize) => worker.postMessage({
    type: 'execute', data: [limit, chunkSize]
  }));

  event.on('chunckCreated', (index, chunk) => {
    updateView(index, chunk)
    console.log('Created a new chat thread!', index, chunk)
  });
}



function updateView(index: number, chunk: Array<number>){
  const [output, view] = ['#output', '#view'].map(id => document.querySelector(id))
  if(!view) throw new Error('View not found')
  if(!output) throw new Error('Output not found')

  // const line = `<div>Chunk ${index} [${chunk[0]}${'.'.repeat(10)}${chunk[chunk.length-1]}]</div>`
  const line = `<div>Chunk ${index} ${JSON.stringify(chunk)}</div>`
  output.innerHTML =  output.innerHTML.concat(line);
  view.scrollIntoView({block: "end", behavior: "smooth"});
}

initWorker()

export function setupCounter(element: HTMLButtonElement) {
  let counter = 0
  const setCounter = (count: number) => {
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element.addEventListener('click', () => command.emit('execute', limit, chunkSize))
  setCounter(0)
}

const JpNums = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']


document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="view">
    <div class="card">
      <button id="counter">Start huge chunk task</button>
    </div>
    <div id="output">
    </div>

  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

type Commands = {
  execute: [size: number, chunkSize: number]
}

type Events = {
  chunckCreated: [index: number, data: number[]]
}

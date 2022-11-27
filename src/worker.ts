export type Command = {type: 'execute', data: [limit: number, chunkSize: number]}

function iterate(limit: number, chunkSize: number){
  let i = 0;
  let chunk = []
  while(i <= limit) {
    chunk.push(i+1);
    if(chunk.length === chunkSize) {
      postMessage({type: 'chunckCreated', data: [i, chunk]});
      chunk = [];
      i++;
    }
  }
}

onmessage = ({data}: {data: Command}) => {
  console.log('worker created', data)
  if(data.type == 'execute'){
    iterate.apply(null, data.data)
  }
};

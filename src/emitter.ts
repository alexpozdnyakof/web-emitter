import {EventEmitter} from 'events'

export class Emitter<Events extends Record<string, unknown[]>>{
private emitter = new EventEmitter

    emit<K extends keyof Events>(
      channel: K,
      ...data: Events[K]
    ){
      return this.emitter.emit(channel as string, ...data)
    }
    on<K extends keyof Events>(channel: K, listener: (...data: Events[K]) => void){
      return this.emitter.on(channel as string, listener);
    }
}
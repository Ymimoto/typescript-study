import * as url from 'url';
import * as fs from 'fs';
import * as socketIo from 'socket.io';
import {Template} from './template';

export class SocketIo {
    
    static socket;

    public initSocket(server){
        SocketIo.socket = socketIo.listen(server);
        console.log("socket.io稼働開始");
    }
    /*
    public setConnection(func): void{
        SocketIo.socket.on("connection",(socket) => this.setEvents(socket, func));
    }
    */

    static setEmit(eventname, data){
        this.socket.emit(eventname, data);
    }

    private setEvents(socket, func){
        console.log("socket.io 接続開始");
        func.apply();
    }
}
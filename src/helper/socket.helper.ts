class SocketHelper {
   public io: any;
   constructor(io: any) {
      this.io = io;
      this.checkConnection();
      console.log("Websocket server is ready to accept the connection")
   }

   checkConnection(): void {
      this.io.on('connection', (socket: any) => {
         console.log('Socket connected successfully ---------->');
         
         socket.on('disconnect', () => {
           console.log('Socket disconnected ------------->');
         });
       }).on('error', (error: any) => {
         console.log('error ' + error);
       });
   }
}

export default SocketHelper;

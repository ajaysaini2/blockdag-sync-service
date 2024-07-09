import * as express from 'express';
import { Server } from "http";
import { getBlockAndTransaction } from "./helper/getBlockAndTransaction.helper";
import SocketHelper from "./helper/socket.helper";
import Block from './models/Block';
import Transaction from './models/Transaction';
// import { utxoBlockAndTrx } from './helper/utxoBlockAndTransaction.helper';



declare global {
  namespace NodeJS {
     interface Global {
        socket?: Socket;
     }
  }
}
const globalData: any = global;
class App {
  public app: express.Application;
  constructor() {
    (async () => {
      this.app = express();
      this.initializeMiddlewares();
      await Block.sync();
      await Transaction.sync();
      getBlockAndTransaction();
      // utxoBlockAndTrx
    })();
  }

  
  public listen() {
    const instance: Server = this.app.listen(
      process.env.PORT ? process.env.PORT : 7200, () => {
        console.log(`App listening on the port ${process.env.PORT ? process.env.PORT : 7200}`);
      
        
      }
    );
    this.socketConnect(instance);
  }
  public getServer(): express.Application {
    return this.app;
  }
  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

  }
  private socketConnect(serverInstance: Server) {
    /*eslint-disable */
    const io = require('socket.io')(serverInstance,{
      cors: {
        origin: "*",
      },
    });
    globalData.socket = io;
    global = globalData;
    new SocketHelper(io);
  }
}
export default App;

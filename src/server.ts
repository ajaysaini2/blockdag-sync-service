import App from './app';
import * as config from './config';

(async () => {
   await config.initiate();
})();

const app = new App();
app.listen();
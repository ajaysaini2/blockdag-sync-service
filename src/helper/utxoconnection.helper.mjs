import { CardanoSyncClient } from "@utxorpc/sdk";;

  
  const username= 'test';
  const password = 'test';
  const authHeader = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
  
  const clientOptions = {
    uri: 'http://3.14.177.55:38131',
    headers: {
      Authorization: authHeader,
    },
  };
export const client = new CardanoSyncClient(clientOptions);


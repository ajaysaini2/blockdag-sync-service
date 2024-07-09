import Block from "../models/Block";
import Transaction from '../models/Transaction';
import * as cron from 'node-cron';
import socketEmitterHelper from './socketEmitter.helper';
import Web3 from 'web3';

const web3 = new Web3(process.env.SOCKET_HOST as string);
export const getBlockAndTransaction = async () => {
  cron.schedule('*/6 * * * * *', async () => {
    try {
      const latestBlockNumber = await web3?.eth?.getBlockNumber();
      const latestBlockBlockData = await web3.eth.getBlock(latestBlockNumber);
      const burnedFees = Number(latestBlockBlockData?.baseFeePerGas * latestBlockBlockData?.gasUsed) / 10 ** 18;
        const fixedBlockReward = 2;
      const blockDetail = {
        blockHash: latestBlockBlockData?.hash,
        blockNumber: latestBlockBlockData?.number.toString(),
        blockHeight: latestBlockBlockData?.number.toString(),
        blockReward: (burnedFees + fixedBlockReward).toString(),
        blockSize: latestBlockBlockData?.size.toString(),
        totalDifficulty: latestBlockBlockData?.totalDifficulty.toString(),
        gasUsed: latestBlockBlockData?.gasUsed.toString(),
        parentHash: latestBlockBlockData?.parentHash.toString(),
        timestamp: latestBlockBlockData?.timestamp.toString(),
      }
      socketEmitterHelper.emitMessage('BlockData', blockDetail)
      if (latestBlockBlockData.transactions) {  
        const transactionDetails = await Promise.all(
          latestBlockBlockData.transactions.map(async (txnHash: any) => {
            const txn = await web3?.eth?.getTransactionReceipt(txnHash)
            const txnData = await web3?.eth?.getTransaction(txnHash);
            return { txn, txnData };
          })
        );
        await Promise.all(
          transactionDetails.map(async ({ txn, txnData }) => {
              const transaction = {
              status: txn?.status ? 'success' : 'failed',
              txnHash: txn?.transactionHash,
              blockHash: txn?.blockHash,
              blockNumber: txn?.blockNumber.toString(),
              from: txn?.from,
              to: txn?.to,
              value: Number(txnData?.value) / 10 ** 18,
              txnfee: Number(txnData?.gasPrice) * Number(txnData?.gas)/ 10 ** 18,
              txnGasPrice: Number(txnData?.gasPrice) / 10 ** 6,
              timestamp: blockDetail.timestamp.toString(),
            };
            socketEmitterHelper.emitMessage('TransactionData', transaction)
          })
        );
      }
      const lastBlock = await Block.findOne({
        order: [['blockNumber', 'DESC']],
      });
      let startBlockNumber = lastBlock ? lastBlock.dataValues.blockNumber + 1 : 0;
      for (let blockNumber = startBlockNumber; blockNumber <= latestBlockNumber; blockNumber++) {
        const blockData = await web3.eth.getBlock(blockNumber);
        const burnedFees = Number(blockData?.baseFeePerGas * blockData?.gasUsed) / 10 ** 18;
        const fixedBlockReward = 2;
        const blocks = {
          blockNumber: blockData?.number,
          blockHeight: blockData?.number,
          timestamp: blockData?.timestamp,
          blockReward: burnedFees + fixedBlockReward,
          totalDifficulty: blockData?.totalDifficulty,
          blockSize: blockData?.size,
          gasUsed: blockData?.gasUsed,
          blockHash: blockData?.hash,
          parentHash: blockData?.parentHash,
        }
        const savedBlocks = await Block.create(blocks);
        console.log("Saved Block ===============>", savedBlocks.dataValues);

        if (blockData.transactions) {
          const transactionDetails = await Promise.all(
            blockData.transactions.map(async (txnHash: any) => {
              const txn = await web3?.eth?.getTransactionReceipt(txnHash)
              const txnData = await web3?.eth?.getTransaction(txnHash);
              return { txn, txnData };
            })
          );
          await Promise.all(
            transactionDetails.map(async ({ txn, txnData }) => {
              const transaction = {
                status: txn?.status ? 'success' : 'failed',
                txnHash: txn?.transactionHash,
                blockHash: txn?.blockHash,
                blockNumber: txn?.blockNumber,
                from: txn?.from,
                to: txn?.to,
                value: Number(txnData?.value) / 10 ** 18,
                txnfee: parseFloat(txnData?.gasPrice) * parseFloat(txnData?.gas)/ 10 ** 18,
                txnGasPrice: parseFloat(txnData?.gasPrice) / 10 ** 9,
                timestamp: savedBlocks.dataValues.timestamp,
              };
              const savedTransaction = await Transaction.create(transaction);
              socketEmitterHelper.emitMessage('TransactionData', savedTransaction)
              console.log("Saved Transactions =================>", savedTransaction.dataValues);
            })
          );
        }
      }
    } catch (error) {
      console.error('Error fetching latest block number', error);
    }
  });
}
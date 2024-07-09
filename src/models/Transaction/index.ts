const Sequelize = require("sequelize-cockroachdb");
import { sequelize } from "../../dbconnection";

const Transaction = sequelize.define("transactions", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true, 
        primaryKey: true,
    },
    status: {
        type: Sequelize.STRING,
    },
    txnHash: {
        type: Sequelize.STRING,
    },
    blockNumber: {
        type: Sequelize.INTEGER,
        unique:true
    },
    from: {
        type: Sequelize.STRING,
    },
    to: {
        type: Sequelize.STRING,
    },
    value: {
        type: Sequelize.INTEGER,
    },
    txnfee: {
        type: Sequelize.FLOAT,
    },
    txnGasPrice: {
        type: Sequelize.FLOAT,
    },
    timestamp: {
        type: Sequelize.INTEGER,
    }
});

export default Transaction;
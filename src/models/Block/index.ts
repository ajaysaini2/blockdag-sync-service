const Sequelize = require("sequelize-cockroachdb");
import { sequelize } from "../../dbconnection";

const Block = sequelize.define("blocks", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true, 
        primaryKey: true,
    },
    blockNumber: {
        type: Sequelize.INTEGER,
        unique:true
    },
    blockHeight: {
        type: Sequelize.INTEGER,
    },
    status: {
        type: Sequelize.STRING,
        defaultValue: 'finalize'
    },
    timestamp : {
        type: Sequelize.INTEGER
    },
    blockReward : {
        type: Sequelize.FLOAT,
    },
    totalDifficulty : {
        type: Sequelize.INTEGER,
    },
    blockSize : {
        type: Sequelize.INTEGER,
    },
    gasUsed: {
        type: Sequelize.INTEGER,
    },
    blockHash: {
        type: Sequelize.STRING,
    },
    parentHash: {
        type: Sequelize.STRING,
    },
});

export default Block;
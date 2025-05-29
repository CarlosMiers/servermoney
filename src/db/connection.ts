import { Sequelize } from 'sequelize';
import config from "../config/varenv";

const sequelize = new Sequelize(config.db.db!, config.db.user!, config.db.pass!, {
  host: config.db.host!,
  dialect: 'mysql'
});

export default sequelize;
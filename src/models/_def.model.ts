import * as Sequelize from 'sequelize';
import { v1 as uuidv1 } from 'uuid';

let sequelize: Sequelize.Sequelize;
let db_env: string;

if (process.env.DATABASE_URL) {
  try {
    console.log(`process.env.DATABASE_URL:`, process.env.DATABASE_URL);
    db_env = 'Production PostgreSQL';
    sequelize = new Sequelize.Sequelize(process.env.DATABASE_URL, {
      logging: false,
      dialect: 'postgres',
      query: {
        raw: false,
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    });
  } catch (e) {
    console.log(e);
    console.log(`error connecting to prod postgresql database; using local sqlite...`);
    
    throw e;
  }
} else if (process.env.DATABASE_URL_DEV) {
  try {
    console.log(`process.env.DATABASE_URL_DEV:`, process.env.DATABASE_URL_DEV);
    db_env = 'Development PostgreSQL';
    sequelize = new Sequelize.Sequelize(<string> process.env.DATABASE_URL_DEV, {
      dialect: 'postgres',
      query: {
        raw: false,
      },
      dialectOptions: {
        ssl: false,
        rejectUnauthorized: false
      },
      logging: false
    });
  } catch (e) {
    console.log(e);
    console.log(`error connecting to dev postgresql database; using local sqlite...`);
    
    db_env = 'Development (sqlite)';
    sequelize = new Sequelize.Sequelize('database', 'username', 'password', {
      dialect: 'sqlite',
      storage: 'database.sqlite',
      logging: false,
      query: {
        raw: false,
      },
    });
  }
} else {
  db_env = 'Development (sqlite)';
  sequelize = new Sequelize.Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: false
  });
}

export const sequelizeInst = sequelize;
export const DB_ENV = db_env;

export const common_model_options: Sequelize.InitOptions = {
  sequelize: sequelizeInst,

  paranoid: true,
  timestamps: true,
  freezeTableName: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
};

export const common_model_fields = {
  id:           { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  uuid:         { type: Sequelize.STRING, defaultValue: uuidv1 },
  metadata:     { type: Sequelize.JSON, allowNull: true },
};

export const core_model_options = {
  target_type:               { type: Sequelize.TEXT, allowNull: false, unique: 'target_model' },
  target_id:                 { type: Sequelize.INTEGER, allowNull: false, unique: 'target_model' },
};




/** Init Database */

export const avenger_db_init = async () => {
  const sequelize_db_sync_options: Sequelize.SyncOptions = {
    // force: true,
    // alter: true,
  };
  
  console.log({
    DB_ENV,
    sequelize_db_sync_options,
  });

  // await sequelize.drop();

  return sequelize.sync(sequelize_db_sync_options)
    .then(() => {
      console.log('\n\nDatabase Initialized! ENV: ' + DB_ENV);
    })
    .catch((error) => {
      console.log('\n\nDatabase Failed!', error);
      throw error;
    });
};


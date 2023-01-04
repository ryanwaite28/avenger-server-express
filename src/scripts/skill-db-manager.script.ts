
import * as dotenv from 'dotenv';
dotenv.config();

import { checkSkillName } from "../utils/helpers.utils";
import { Skill } from "../models/avenger.model";
import { IMyModel } from "../interfaces/common.interface";
import { avenger_db_init } from "../models/_def.model";






const read = async (query: number | string /* could be name or ID */): Promise<IMyModel | null> => {
  const useQuery: string = query.toString();
  const isNumber = (/[\d]+/).test(useQuery);
  const check_model: IMyModel | null = isNumber
    ? await Skill.findOne({ where: { id: parseInt(useQuery, 10) } })
    : await Skill.findOne({ where: { name: checkSkillName(useQuery) } })
  console.log(`read:`, { check_model });
  return check_model;
};

const create = async (skill_name: string): Promise<IMyModel> => {
  const useSkillName: string = checkSkillName(skill_name);
  const check_model: IMyModel = await read(skill_name);
  if (check_model) {
    throw new Error(`Skill already exists by name: ${useSkillName}`);
  }
  const skill = await Skill.create({ name: useSkillName });
  console.log(`new skill:`, { ...skill.dataValues });
  return skill;
};

const update = async (query: number | string /* could be name or ID */, newName: string /* the new name to use */) => {
  const check_model: IMyModel = await read(query);
  if (!check_model) {
    console.log(`no skill found by query:`, { query });
    return process.exit(1);
  }
  const useSkillName: string = checkSkillName(newName);
  const updates = await check_model.update({ name: useSkillName });
  const reloaded_model = await check_model.reload();
  console.log(reloaded_model.dataValues);
  return reloaded_model;
};

const destroy = async (query: number | string /* could be name or ID */) => {
  const check_model: IMyModel = await read(query);
  if (!check_model) {
    console.log(`no skill found by query:`, { query });
    return process.exit(1);
  }
  const deletes = await check_model.destroy();
  console.log({ deletes });
  return deletes;
};

const db_fn_map = {
  create,
  read,
  update,
  destroy
};

const givenArgs = process.argv.slice(2);
console.log(`process argv:`, process.argv, { givenArgs });

const command = givenArgs[0];



const start = () => {
  switch (command) {
    case `create`: {
      const skill_name = givenArgs[1];
      create(skill_name);
      break;
    }
  
    case `read`: {
      const skill_name = givenArgs[1];
      read(skill_name);
      break;
    }
  
    case `update`: {
      break
    }
  
    case `destroy`: {
      break
    }
    
    
  
    default: {
      throw new Error(`Invalid command provided: ${command}. Valid commands are: ${Object.keys(db_fn_map).join(', ')}`);
    }
  }
};


avenger_db_init().then(() => {
  start();
});
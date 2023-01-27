import {
  fn,
  Includeable,
  Model,
  Op,
  WhereOptions
} from 'sequelize';
import { user_attrs_slim } from '../utils/constants.utils';
import {
  create_model_crud_repo_from_model_class,
} from '../utils/helpers.utils';


import { STATUSES } from '../enums/common.enum';
import { IAssessment, IQuestion, IAnswer } from '../interfaces/avenger.models.interface';
import { Assessment, Question, Answer } from '../models/avenger.model';





const assessment_crud = create_model_crud_repo_from_model_class<IAssessment>(Assessment);
const question_crud = create_model_crud_repo_from_model_class<IQuestion>(Question);
const answer_crud = create_model_crud_repo_from_model_class<IAnswer>(Answer);










/** READ */





/** CREATE */





/** UPDATE */





/** DELETE */
import { Router } from 'express';
import { ValidateRequestBodyDto } from '../middlewares/class-transformer-validator.middleware';
import { YouAuthorizedSlim } from '../guards/you.guard';
import { SkillRequestHandler } from '../request-handlers/skill.handler';
import { UserSkillAddDto } from '../dto/skill.dto';



export const SkillRouter: Router = Router({ mergeParams: true });






/** GET */

SkillRouter.get(`/name/:name`, SkillRequestHandler.get_skill_by_name);
SkillRouter.get(`/query/:query`, SkillRequestHandler.get_skill_by_query);
SkillRouter.get(`/:id/users`, SkillRequestHandler.get_users_by_skill_id);
SkillRouter.get(`/:id`, SkillRequestHandler.get_skill_by_id);






/** POST */

SkillRouter.post('/submit', YouAuthorizedSlim, ValidateRequestBodyDto(UserSkillAddDto), SkillRequestHandler.add_user_skill);



/** PUT */




/** DELETE */






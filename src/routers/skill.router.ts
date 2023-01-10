import { Router } from 'express';
import { SkillRequestHandler } from '../request-handlers/skill.handler';



export const SkillRouter: Router = Router({ mergeParams: true });



// GET

SkillRouter.get(`/name/:name`, SkillRequestHandler.get_skill_by_name);
SkillRouter.get(`/:id`, SkillRequestHandler.get_skill_by_id);

SkillRouter.get(`/:id/users`, SkillRequestHandler.get_users_by_skill_id);
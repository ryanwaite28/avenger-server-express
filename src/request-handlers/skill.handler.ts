import { Request, Response } from 'express';
import { IUser } from '../interfaces/avenger.models.interface';
import { ExpressResponse, ServiceMethodResults } from '../interfaces/common.interface';
import { CatchRequestHandlerError } from '../decorators/service-method-error-handler.decorator';
import { SkillService } from '../services/skill.service';
import { UserSkillAddDto, UserSkillRatingCreateDto } from '../dto/skill.dto';



export class SkillRequestHandler {

  @CatchRequestHandlerError()
  static async get_skill_by_id(request: Request, response: Response): ExpressResponse {
    const skill_id: number = parseInt(request.params.id, 10);
    const serviceMethodResults: ServiceMethodResults = await SkillService.get_skill_by_id(skill_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async get_skill_by_name(request: Request, response: Response): ExpressResponse {
    const serviceMethodResults: ServiceMethodResults = await SkillService.get_skill_by_name(request.params.name);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async get_skill_by_query(request: Request, response: Response): ExpressResponse {
    const serviceMethodResults: ServiceMethodResults = await SkillService.get_skill_by_query(request.params.query);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async get_users_by_skill_id(request: Request, response: Response): ExpressResponse {
    const skill_id: number = parseInt(request.params.id, 10);
    const serviceMethodResults: ServiceMethodResults = await SkillService.get_users_by_skill_id(skill_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }



  @CatchRequestHandlerError()
  static async get_user_skills_all(request: Request, response: Response): ExpressResponse {
    const user_id: number = parseInt(request.params.user_id, 10);
    const serviceMethodResults: ServiceMethodResults = await SkillService.get_user_skills_all(user_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  @CatchRequestHandlerError()
  static async get_user_skills(request: Request, response: Response): ExpressResponse {
    const user_id: number = parseInt(request.params.user_id, 10);
    const user_skill_id: number = parseInt(request.params.user_skill_id, 10);
    const serviceMethodResults: ServiceMethodResults = await SkillService.get_user_skills(user_id, user_skill_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }

  // @CatchRequestHandlerError()
  // static async get_user_skill_ratings_all(request: Request, response: Response): ExpressResponse {
  //   const user_skill_id: number = parseInt(request.params.user_skill_id, 10);
  //   const serviceMethodResults: ServiceMethodResults = await SkillService.get_user_skill_ratings_all(user_skill_id);
  //   return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  // }

  // @CatchRequestHandlerError()
  // static async get_user_skill_ratings(request: Request, response: Response): ExpressResponse {
  //   const user_skill_id: number = parseInt(request.params.user_skill_id, 10);
  //   const rating_id: number = parseInt(request.params.rating_id, 10);
  //   const serviceMethodResults: ServiceMethodResults = await SkillService.get_user_skill_ratings(user_skill_id, rating_id);
  //   return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  // }

  @CatchRequestHandlerError()
  static async add_user_skill(request: Request, response: Response): ExpressResponse {
    const dto: UserSkillAddDto = response.locals[`dto`];
    const serviceMethodResults: ServiceMethodResults = await SkillService.add_user_skill(dto);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }
  
  @CatchRequestHandlerError()
  static async remove_user_skill(request: Request, response: Response): ExpressResponse {
    const user_skill_id: number = parseInt(request.params.user_skill_id, 10);
    const serviceMethodResults: ServiceMethodResults = await SkillService.remove_user_skill(user_skill_id);
    return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  }




  // @CatchRequestHandlerError()
  // static async create_user_skill_rating(request: Request, response: Response): ExpressResponse {
  //   const dto: UserSkillRatingCreateDto = response.locals[`dto`]; 
  //   const serviceMethodResults: ServiceMethodResults = await SkillService.create_user_skill_rating(dto);
  //   return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  // }


  // @CatchRequestHandlerError()
  // static async check_user_skill_rating_reaction(request: Request, response: Response): ExpressResponse {
  //   const user_id: number = parseInt(request.params.user_id, 10);
  //   const rating_id: number = parseInt(request.params.rating_id, 10); 
  //   const serviceMethodResults: ServiceMethodResults = await SkillService.check_user_skill_rating_reaction(user_id, rating_id);
  //   return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  // }

  // @CatchRequestHandlerError()
  // static async add_user_skill_rating_reaction(request: Request, response: Response): ExpressResponse {
  //   const you: IUser = response.locals.you;
  //   const rating_id: number = parseInt(request.params.rating_id, 10); 
  //   const reaction_type: string = request.body.reaction_type;
  //   const serviceMethodResults: ServiceMethodResults = await SkillService.add_user_skill_rating_reaction({ user_id: you.id, rating_id, reaction_type });
  //   return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  // }

  // @CatchRequestHandlerError()
  // static async update_user_skill_rating_reaction(request: Request, response: Response): ExpressResponse {
  //   const reaction_id: number = parseInt(request.params.reaction_id, 10); 
  //   const reaction_type: string = request.body.reaction_type;
  //   const serviceMethodResults: ServiceMethodResults = await SkillService.update_user_skill_rating_reaction(reaction_id, reaction_type);
  //   return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  // }

  // @CatchRequestHandlerError()
  // static async remove_user_skill_rating_reaction(request: Request, response: Response): ExpressResponse {
  //   const reaction_id: number = parseInt(request.params.reaction_id, 10); 
  //   const serviceMethodResults: ServiceMethodResults = await SkillService.remove_user_skill_rating_reaction(reaction_id);
  //   return response.status(serviceMethodResults.status).json(serviceMethodResults.info);
  // }
}


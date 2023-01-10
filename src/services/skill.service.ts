import {
  add_user_skill,
  add_user_skill_rating_reaction,
  check_user_skill_rating_reaction,
  check_user_skill_submission_pending,
  create_user_skill_rating,
  get_skill_by_id,
  get_skill_by_name,
  get_users_by_skill_id,
  get_user_skills,
  get_user_skills_all,
  get_user_skills_requests_submitted,
  get_user_skills_requests_submitted_all,
  get_user_skill_ratings,
  get_user_skill_ratings_all,
  remove_user_skill,
  remove_user_skill_rating_reaction,
  submit_user_skill,
  update_user_skill_rating_reaction,
  update_user_skill_submission,
} from "../repos/skill.repo";
import {
  ISkill, IUser, IUserSkill, IUserSkillRating, IUserSkillSubmitRequest
} from "../interfaces/avenger.models.interface";
import {
  ServiceMethodResults
} from "../interfaces/common.interface";
import { HttpStatusCode } from "../enums/http-codes.enum";
import { UserSkillAddDto, UserSkillRatingCreateDto } from "../dto/skill.dto";
import { STATUSES } from "../enums/common.enum";



export class SkillService {
  
  static async get_skill_by_id(skill_id: number) {
    const skill: ISkill = await get_skill_by_id(skill_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: skill
      }
    };
    return serviceMethodResults;
  }

  static async get_skill_by_name(name: string) {
    const skill: ISkill = await get_skill_by_name(name);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: skill
      }
    };
    return serviceMethodResults;
  }

  static async get_users_by_skill_id(skill_id: number) {
    const usersBySkill: IUserSkill[] = await get_users_by_skill_id(skill_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: usersBySkill
      }
    };
    return serviceMethodResults;
  }


  static async get_user_skills_all(you_id: number) {
    const skills: IUserSkill[] = await get_user_skills_all(you_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: skills
      }
    };
    return serviceMethodResults;
  }

  static async get_user_skills(you_id: number, user_skill_id?: number) {
    const skills: IUserSkill[] = await get_user_skills(you_id, user_skill_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: skills
      }
    };
    return serviceMethodResults;
  }


  static async get_user_skill_ratings_all(you_id: number) {
    const ratings: IUserSkillRating[] = await get_user_skill_ratings_all(you_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: ratings
      }
    };
    return serviceMethodResults;
  }

  static async get_user_skill_ratings(you_id: number, user_skill_id?: number) {
    const ratings: IUserSkillRating[] = await get_user_skill_ratings(you_id, user_skill_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: ratings
      }
    };
    return serviceMethodResults;
  }


  static async add_user_skill(dto: UserSkillAddDto) {
    const data: IUserSkill = await add_user_skill(dto);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data
      }
    };
    return serviceMethodResults;
  }

  static async remove_user_skill(user_skill_id: number) {
    const results: number = await remove_user_skill(user_skill_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: results
      }
    };
    return serviceMethodResults;
  }

  static async get_user_skills_requests_submitted_all(user_id: number) {
    const skill_requests: IUserSkill[] = await get_user_skills_requests_submitted_all(user_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: skill_requests
      }
    };
    return serviceMethodResults;
  }

  static async get_user_skills_requests_submitted(user_id: number, user_skill_id?: number) {
    const skill_requests: IUserSkill[] = await get_user_skills_requests_submitted(user_id, user_skill_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: skill_requests
      }
    };
    return serviceMethodResults;
  }


  static async check_user_skill_submission_pending(dto: UserSkillAddDto) {
    const check = await check_user_skill_submission_pending(dto);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: check,
      }
    };
    return serviceMethodResults;
  }
  static async submit_user_skill(dto: UserSkillAddDto) {
    const submission = await submit_user_skill(dto);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: submission
      }
    };
    return serviceMethodResults;
  }
  static async cancel_user_skill_submission(skill_submission_request_id: number) {
    const updates = await update_user_skill_submission(skill_submission_request_id, STATUSES.CANCELED);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: updates,
      }
    };
    return serviceMethodResults;
  }
  static async accept_user_skill_submission(skill_submission_request_id: number) {
    const updates = await update_user_skill_submission(skill_submission_request_id, STATUSES.ACCEPTED);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: updates,
      }
    };
    return serviceMethodResults;
  }
  static async decline_user_skill_submission(skill_submission_request_id: number) {
    const updates = await update_user_skill_submission(skill_submission_request_id, STATUSES.DECLINED);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: updates,
      }
    };
    return serviceMethodResults;
  }

  static async create_user_skill_rating(dto: UserSkillRatingCreateDto) {
    const rating = await create_user_skill_rating(dto);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: rating,
      }
    };
    return serviceMethodResults;
  }


  static async check_user_skill_rating_reaction(you_id: number, rating_id: number) {
    const data = await check_user_skill_rating_reaction(you_id, rating_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async add_user_skill_rating_reaction(params: { user_id: number, rating_id: number, reaction_type: string }) {
    const data = await add_user_skill_rating_reaction(params);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async update_user_skill_rating_reaction(reaction_id: number, reaction_type: string) {
    const data = await update_user_skill_rating_reaction(reaction_id, reaction_type);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }

  static async remove_user_skill_rating_reaction(reaction_id: number) {
    const data = await remove_user_skill_rating_reaction(reaction_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data,
      }
    };
    return serviceMethodResults;
  }
  

}



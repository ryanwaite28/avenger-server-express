import {
  add_user_skill,
  // add_user_skill_rating_reaction,
  // check_user_skill_rating_reaction,
  // create_user_skill_rating,
  get_skill_by_id,
  get_skill_by_like_query,
  get_skill_by_name,
  get_users_by_skill_id,
  get_user_skills,
  get_user_skills_all,
  // get_user_skill_ratings,
  // get_user_skill_ratings_all,
  remove_user_skill,
  // remove_user_skill_rating_reaction,
  // update_user_skill_rating_reaction,
} from "../repos/skill.repo";
import {
  IRating,
  ISkill,
  IUser,
} from "../interfaces/avenger.models.interface";
import {
  ServiceMethodResults
} from "../interfaces/common.interface";
import { HttpStatusCode } from "../enums/http-codes.enum";
import { UserSkillAddDto, UserSkillRatingCreateDto } from "../dto/skill.dto";
import { STATUSES } from "../enums/common.enum";



export class SkillService {
  
  static async get_skill_by_id(skill_id: number) {
    if (!skill_id) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `ID is required`
        }
      };
      return serviceMethodResults;
    }

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
    if (!name) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Skill name is required`
        }
      };
      return serviceMethodResults;
    }

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

  static async get_skill_by_query(query: string) {
    if (!query) {
      const serviceMethodResults: ServiceMethodResults = {
        status: HttpStatusCode.BAD_REQUEST,
        error: true,
        info: {
          message: `Query is required`
        }
      };
      return serviceMethodResults;
    }

    const skill: ISkill[] = await get_skill_by_like_query(query);
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
    const usersBySkill: IUser[] = await get_users_by_skill_id(skill_id);
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
    const skills: ISkill[] = await get_user_skills_all(you_id);
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
    const skills: ISkill[] = await get_user_skills(you_id, user_skill_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: skills
      }
    };
    return serviceMethodResults;
  }


  // static async get_user_skill_ratings_all(you_id: number) {
  //   const ratings: IRating[] = await get_user_skill_ratings_all(you_id);
  //   const serviceMethodResults: ServiceMethodResults = {
  //     status: HttpStatusCode.OK,
  //     error: false,
  //     info: {
  //       data: ratings
  //     }
  //   };
  //   return serviceMethodResults;
  // }

  // static async get_user_skill_ratings(you_id: number, user_skill_id?: number) {
  //   const ratings: IRating[] = await get_user_skill_ratings(you_id, user_skill_id);
  //   const serviceMethodResults: ServiceMethodResults = {
  //     status: HttpStatusCode.OK,
  //     error: false,
  //     info: {
  //       data: ratings
  //     }
  //   };
  //   return serviceMethodResults;
  // }


  static async add_user_skill(dto: UserSkillAddDto) {
    const data: ISkill = await add_user_skill(dto);
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
    const results = await remove_user_skill(user_skill_id);
    const serviceMethodResults: ServiceMethodResults = {
      status: HttpStatusCode.OK,
      error: false,
      info: {
        data: results
      }
    };
    return serviceMethodResults;
  }

  // static async create_user_skill_rating(dto: UserSkillRatingCreateDto) {
  //   const rating = await create_user_skill_rating(dto);
  //   const serviceMethodResults: ServiceMethodResults = {
  //     status: HttpStatusCode.OK,
  //     error: false,
  //     info: {
  //       data: rating,
  //     }
  //   };
  //   return serviceMethodResults;
  // }


  // static async check_user_skill_rating_reaction(you_id: number, rating_id: number) {
  //   const data = await check_user_skill_rating_reaction(you_id, rating_id);
  //   const serviceMethodResults: ServiceMethodResults = {
  //     status: HttpStatusCode.OK,
  //     error: false,
  //     info: {
  //       data,
  //     }
  //   };
  //   return serviceMethodResults;
  // }

  // static async add_user_skill_rating_reaction(params: { user_id: number, rating_id: number, reaction_type: string }) {
  //   const data = await add_user_skill_rating_reaction(params);
  //   const serviceMethodResults: ServiceMethodResults = {
  //     status: HttpStatusCode.OK,
  //     error: false,
  //     info: {
  //       data,
  //     }
  //   };
  //   return serviceMethodResults;
  // }

  // static async update_user_skill_rating_reaction(reaction_id: number, reaction_type: string) {
  //   const data = await update_user_skill_rating_reaction(reaction_id, reaction_type);
  //   const serviceMethodResults: ServiceMethodResults = {
  //     status: HttpStatusCode.OK,
  //     error: false,
  //     info: {
  //       data,
  //     }
  //   };
  //   return serviceMethodResults;
  // }

  // static async remove_user_skill_rating_reaction(reaction_id: number) {
  //   const data = await remove_user_skill_rating_reaction(reaction_id);
  //   const serviceMethodResults: ServiceMethodResults = {
  //     status: HttpStatusCode.OK,
  //     error: false,
  //     info: {
  //       data,
  //     }
  //   };
  //   return serviceMethodResults;
  // }
  

}



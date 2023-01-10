import * as dotenv from 'dotenv';
dotenv.config();

import { checkSkillName } from "../utils/helpers.utils";
import { Notice, NoticeAudio, NoticePhoto, NoticeVideo, User } from "../models/avenger.model";
import { IMyModel } from "../interfaces/common.interface";
import { avenger_db_init } from "../models/_def.model";
import { create_user } from '../repos/users.repo';
import { user_attrs_slim } from '../utils/constants.utils';
import { fn, col, cast, FindAttributeOptions, ProjectionAlias } from 'sequelize';




async function test() {

  const userA = await create_user({
    username: `johndoe`,
    displayname: `John Doe`,
    email: `test@test.com`,
    password: `password`,
  });
  // console.log(userA);

  const userB = await create_user({
    username: `janedoe`,
    displayname: `Jane Doe`,
    email: `test2@test.com`,
    password: `password`,
  });
  // console.log(userB);



  // text creating notices
  const noticeA = await Notice.create({
    owner_id: userA.id,

    parent_notice_id: null,
    quoting_notice_id: null,
    share_notice_id: null,

    body: `A notice`,
    tags: '',
  });
  const noticeB = await Notice.create({
    owner_id: userB.id,

    parent_notice_id: null,
    quoting_notice_id: null,
    share_notice_id: null,

    body: `Another notice`,
    tags: '',
  });


  // test replying
  const noticeC = await Notice.create({
    owner_id: userB.id,

    parent_notice_id: noticeA.dataValues.id,
    quoting_notice_id: null,
    share_notice_id: null,

    body: `A notice reply`,
    tags: '',
  });

  // test quoting
  const noticeD = await Notice.create({
    owner_id: userA.id,

    parent_notice_id: null,
    quoting_notice_id: noticeB.dataValues.id,
    share_notice_id: null,

    body: `A notice quote`,
    tags: '',
  });

  // test share
  const noticeE = await Notice.create({
    owner_id: userA.id,

    parent_notice_id: null,
    quoting_notice_id: null,
    share_notice_id: noticeB.dataValues.id,

    body: '',
    tags: '',
  });



  // now log all notices
  const repliesCountProjection: ProjectionAlias = [cast(fn('COUNT', col('Notice.id')), 'integer'), 'replies_count'];

  const notices = await Notice.findAll({
    include: [
      // { model: User, as: `owner`, attributes: user_attrs_slim },

      // { model: Notice, as: `notice_replies`, attributes: null, include: [{ model: User, as: `owner`, attributes: user_attrs_slim }] },
      // { model: Notice, as: `parent_notice`, attributes: null, include: [{ model: User, as: `owner`, attributes: user_attrs_slim }] },
      // { model: Notice, as: `notice_quotes`, attributes: null, include: [{ model: User, as: `owner`, attributes: user_attrs_slim }] },
      // { model: Notice, as: `quote_notice`, attributes: null, include: [{ model: User, as: `owner`, attributes: user_attrs_slim }] },
      // { model: Notice, as: `notice_shares`, attributes: null, include: [{ model: User, as: `owner`, attributes: user_attrs_slim }] },
      // { model: Notice, as: `share_notice`, attributes: null, include: [{ model: User, as: `owner`, attributes: user_attrs_slim }] },

      // { model: NoticePhoto, as: `notice_photos` },
      // { model: NoticeVideo, as: `notice_videos` },
      // { model: NoticeAudio, as: `notice_audios` },
    ],
    attributes: {
      include: [
        repliesCountProjection
      ]
    },
    group: ['Notice.parent_notice_id', 'Notice.id']
  });

  const data = notices.map(model => model.dataValues);

  console.log(`notices:\n\n`, JSON.stringify(data), '\n\n');



  
  // const noticeStats = await Notice.findAll({
  //   attributes: [
  //     [fn('COUNT', col('Notice.id')), 'replies_count']
  //   ],
  //   // group: ['Notice.parent_notice_id', 'Notice.id'],
  // });

  // console.log(`noticeStats:\n\n`, JSON.stringify(noticeStats), );


  // const noticeA_replies = await Notice.count({ where: { parent_notice_id: noticeA.id } });
  // const noticeA_quotes = await Notice.count({ where: { quoting_notice_id: noticeA.id } });
  // const noticeA_shares = await Notice.count({ where: { share_notice_id: noticeA.id } });

  // const noticeB_replies = await Notice.count({ where: { parent_notice_id: noticeB.id } });
  // const noticeB_quotes = await Notice.count({ where: { quoting_notice_id: noticeB.id } });
  // const noticeB_shares = await Notice.count({ where: { share_notice_id: noticeB.id } });

  // console.log(`noticeStats:\n\n`, JSON.stringify({ noticeA_replies, noticeA_quotes, noticeA_shares, noticeB_replies, noticeB_quotes, noticeB_shares }), '\n\n');

}



avenger_db_init().then(() => {
  test();
});
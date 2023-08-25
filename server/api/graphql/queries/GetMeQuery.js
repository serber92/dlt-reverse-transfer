const database = require("../../../config/database");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { StudentDataType } = require("../types");
const { Profile, Address, Verification } = require("../../models");

const GetMeQuery = {
  type: StudentDataType,
  args: {},
  resolve: async (parent, args, context) => {
    try {

      const user = await context.user
      const profile = await Profile.findOne({
        where: {
          [Op.or]: [
            {
              name: `${user.given_name} ${user.family_name}`,
            },
            {
              email: user.email,
            }
          ],
          student_id: {
            [Op.not]: null,
          }
        },
        include: [
          {
            model: Verification,
          },
          {
            model: Address,
          },
        ],
      });

      if (!profile) {
        return {
          profile : null,
          assertions: null,
        }
      }

      const asserts = await database.query('select ass.id ,ass.term , ass.issued_on, ach.name ach_name,ach.level, ach.id ach_id, ach.achievement_type , ach.credits_available, ass.credits_earned, ach.human_code, ach.field_of_study, ach.source_key, ach.description, r1.result_type, r1.value, r1.id result_id from identity id join identification if on if."identity" = id.id and if.identity_type = :identity_type join profile p2 on p2.id = if.profile  join assertion ass on ass.recipient = id.id::text join result r1 on r1.id = any(ass.results) join achievement ach on ach.id = ass.achievement where id.identity = :identity',
      {
        replacements: {
          identity_type: 'ASU_ID',
          identity: profile.student_id
        },
        type: Sequelize.QueryTypes.SELECT
      })

      let assertions = []

      asserts.map(assert => {
        let assertion = {}

        const indexof = assertions.findIndex(el => el.id === assert.id)

        if (indexof !== -1) {
          //already have 
          assertion = assertions[indexof]
          assertion.results.push({
            id: assert.result_id,
            result_type: assert.result_type,
            value: assert.value,
            alignment: assert.alignment,
          })
        } else {
          //new 
          assertion = {
            id: assert.id,
            issued_on: assert.issued_on,
            term: assert.term,
            Achievement: {
              id: assert.ach_id,
              achievement_type: assert.achievement_type,
              credits_available: assert.credits_available,
              human_code: assert.human_code,
              field_of_study: assert.field_of_study,
              source_key: assert.source_key,
              description: assert.description,
              name: assert.ach_name,
              level: assert.level,
            },
            credits_earned: assert.credits_earned,
            results: [
              {
                id: assert.result_id,
                result_type: assert.result_type,
                value: assert.value,
                alignment: assert.alignment,
              }
            ]
          }
          assertions.push(assertion)

        }
      })
      return {
        profile,
        assertions,
      }
    } catch (error) {
      throw error
    }

  }
  
};

module.exports = { GetMeQuery };

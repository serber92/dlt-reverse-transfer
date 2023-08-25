const { GraphQLString } = require("graphql");
const database = require("../../../config/database");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { StudentDataType } = require("../types");
const { Profile, Address, Verification, Alignment } = require("../../models");

const GetStudentDataQuery = {
  type: StudentDataType,
  args: {
    name: {
      name: "name",
      type: GraphQLString,
    },
    email: {
      name: "email",
      type: GraphQLString,
    },
    studentId: {
      studentId: "studentId",
      type: GraphQLString,
    },
  },
  resolve: async (parent, args) => {
    try {
      const profile = await Profile.findOne({
        where: {
          [Op.or]: [
            {
              name: args.name,
            },
            {
              email: args.email,
            },
            {
              student_id: args.studentId,
            },
          ],
          student_id: {
            [Op.not]: null,
          },
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
          profile: null,
          assertions: null,
        };
      }

      const asserts = await database.query(
        'select ass.id ,ass.term , ass.issued_on, ass.recipient, ach.name ach_name,ach.level, ach.id ach_id, ach.achievement_type, ach.alignments, ach.credits_available, ass.credits_earned, ach.human_code, ach.field_of_study, ach.source_key, ach.description, r1.result_type, r1.value, r1.id result_id from identity id join identification if on if."identity" = id.id and if.identity_type = :identity_type join profile p2 on p2.id = if.profile  join assertion ass on ass.recipient = id.id::text join result r1 on r1.id = any(ass.results) join achievement ach on ach.id = ass.achievement where id.identity = :identity',
        {
          replacements: {
            identity_type: "ASU_ID",
            identity: profile.student_id,
          },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      let assertions = [];
      let totalCredit = 0;
      profile.lastIssuedOn = "0000000000000";
      for (let assert of asserts) {
        let assertion = {};

        const indexof = assertions.findIndex((el) => el.id === assert.id);

        if (indexof !== -1) {
          //already have
          assertion = assertions[indexof];

          if (assertion.results.findIndex((el) => el.id === assert.result_id) === -1) {
            assertion.results.push({
              id: assert.result_id,
              result_type: assert.result_type,
              value: assert.value,
            });
          }
        } else {
          //new
          let alignments = [];
          if (assert.alignments) {

            alignments = await Alignment.findAll({
              where: {
                id: {
                  [Op.in]: assert.alignments,
                },
              },
            });
          }

          assertion = {
            id: assert.id,
            issued_on: assert.issued_on,
            recipient: assert.recipient,
            term: assert.term,
            achievement: {
              id: assert.ach_id,
              achievement_type: assert.achievement_type,
              credits_available: assert.credits_available,
              human_code: assert.human_code,
              field_of_study: assert.field_of_study,
              source_key: assert.source_key,
              description: assert.description,
              name: assert.ach_name,
              level: assert.level,
              alignments: alignments,
            },
            credits_earned: assert.credits_earned,
            results: [
              {
                id: assert.result_id,
                result_type: assert.result_type,
                value: assert.value,
              },
            ],
          };
          assertions.push(assertion);

          if (
            assert.result_type === "CreditHours" &&
            (assert.achievement_type === "Course" || assert.achievement_type === "TransferCredit" || assert.achievement_type === "ExamCredit")
          ) {
            totalCredit += parseFloat(assert.value);
          }

          let lastIssuedOn = profile.lastIssuedOn;
          let thisIssuedOn = assert.issued_on;

          if (thisIssuedOn > lastIssuedOn) {
            profile.lastIssuedOn = thisIssuedOn;
          }
        }
      }

      profile.totalCredit = totalCredit;
      return {
        profile,
        assertions,
      };
    } catch (error) {
      throw error;
    }
  },
};

module.exports = { GetStudentDataQuery };

const { GraphQLInt, GraphQLString } = require("graphql");
const { get, cloneDeep } = require("lodash");
const moment = require("moment");
const parser = require("js-sql-parser");
const database = require("../../../config/database");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { StudentsCursorType } = require("../types");
const { Profile, Address } = require("../../models");
const { convertNodeToCursor, convertCursorToNodeId } = require("../util");

const ListStudentsQuery = {
  type: StudentsCursorType,
  args: {
    after: {
      name: "after",
      type: GraphQLString,
    },
    first: {
      name: "first",
      type: GraphQLInt,
    },
    SQL: {
      name: "SQL",
      type: GraphQLString,
    },
    school: {
      name: "school",
      type: GraphQLString,
    },
    StudentID: {
      name: "StudentID",
      type: GraphQLString,
    },
  },
  resolve: async (parent, args) => {
    try {
      let finalUserList = [];
      let lastCursor;
      let hasNextPage;
      let newArgs = args;

      if (!newArgs.first || newArgs.first < 0) {
        newArgs.first = 10;
      }
      let identity_type = "ASU_ID";
      let AllAsserts;

      if (args.school === "ASU") {
        identity_type = "ASU_ID";
      } else if (args.school === "MCC") {
        identity_type = "MCC_ID";
      }

      if (args.StudentID && args.StudentID !== "") {
        AllAsserts = await database.query(
          'select id.identity, ass.id ,ass.term , ass.issued_on, ach.name ach_name,ach.level, ach.id ach_id, ach.achievement_type , ach.credits_available, ass.credits_earned, ach.human_code, ach.field_of_study, ach.source_key, ach.description, r1.result_type, r1.value, r1.id result_id from identity id join identification if on if."identity" = id.id and if.identity_type = :identity_type join profile p2 on p2.id = if.profile  join assertion ass on ass.recipient = id.id::text join result r1 on r1.id = any(ass.results) join achievement ach on ach.id = ass.achievement where id.identity = :identity',
          {
            replacements: {
              identity_type,
              identity: args.StudentID,
            },
            type: Sequelize.QueryTypes.SELECT,
          }
        );
      } else {
        AllAsserts = await database.query(
          'select id.identity, ass.id ,ass.term , ass.issued_on, ach.name ach_name,ach.level, ach.id ach_id, ach.achievement_type , ach.credits_available, ass.credits_earned, ach.human_code, ach.field_of_study, ach.source_key, ach.description, r1.result_type, r1.value, r1.id result_id from identity id join identification if on if."identity" = id.id and if.identity_type = :identity_type join profile p2 on p2.id = if.profile  join assertion ass on ass.recipient = id.id::text join result r1 on r1.id = any(ass.results) join achievement ach on ach.id = ass.achievement',
          {
            replacements: {
              identity_type,
            },
            type: Sequelize.QueryTypes.SELECT,
          }
        );
      }

      while (1) {
        let { userList, lastCursor: sublastCursor, hasNextPage: subhasNextPage } = await getStudents(newArgs, AllAsserts);
        finalUserList = finalUserList.concat(userList);
        if (finalUserList.length < args.first && subhasNextPage) {
          newArgs.after = sublastCursor;
          lastCursor = sublastCursor;
          hasNextPage = subhasNextPage;
        } else {
          lastCursor = sublastCursor;
          hasNextPage = subhasNextPage;
          break;
        }
      }

      return {
        edges: finalUserList,
        pageInfo: {
          lastCursor,
          hasNextPage,
        },
      };
    } catch (error) {
      throw error;
    }
  },
};

const getStudents = async (args, AllAsserts) => {
  let afterIndex = 0;
  let first = args.first;
  let SQL = args.SQL;

  let conditions = [];

  if (!first || first < 0) {
    first = 10;
  }

  let profiles;
  let whereValue;

  if (args.after) {
    const id = convertCursorToNodeId(args.after);
    whereValue = {
      [Op.and]: [
        {
          id: {
            [Op.gt]: id,
          },
        },
      ],
    };
  } else {
    whereValue = {};
  }

  if (args.StudentID && args.StudentID !== "") {
    whereValue = {
      student_id: args.StudentID,
    };
  }

  profiles = await Profile.findAll({
    where: whereValue,
    order: [["id", "ASC"]],
    limit: first,
    include: [
      {
        model: Address,
      },
    ],
  });

  if (profiles.length > 0) {
    let last = profiles[profiles.length - 1].id;

    let lastCursor = convertNodeToCursor(last);
    var hasNextPage = true;
    if (profiles.length < first) {
      hasNextPage = false;
    }

    var userList = [];


    const studentIDs = await database.query(
      `select id.identity, if.identity_type, if.profile from identity id join identification if on if.identity = id.id  and (if.identity_type = 'MCC_ID' or if.identity_type = 'ASU_ID') and if.profile IN (:ids)`,
      {
        replacements: {
          ids: profiles.map(el => el.id),
        },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    for (let student of profiles) {
      let assertions = [];
      let totalCredit = 0;
      student.lastIssuedOn = "0000000000000";

      if (student.student_id) {
        const asserts = AllAsserts.filter((ass) => ass.identity === student.student_id);
      
        for (let assert of asserts) {
          let assertion = {};
  
          const indexof = assertions.findIndex((el) => el.id === assert.id);
  
          if (indexof !== -1) {
            //already have
            assertion = assertions[indexof];
            assertion.results.push({
              id: assert.result_id,
              result_type: assert.result_type,
              value: assert.value,
              alignment: assert.alignment,
            });
          } else {
            //new
  
            assertion = {
              id: assert.id,
              issued_on: assert.issued_on,
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
              },
              credits_earned: assert.credits_earned,
              results: [
                {
                  id: assert.result_id,
                  result_type: assert.result_type,
                  value: assert.value,
                  alignment: assert.alignment,
                },
              ],
            };
            assertions.push(assertion);
            if (assert.achievement_type === "Course" || assert.achievement_type === "TransferCredit" || assert.achievement_type === "ExamCredit") {
              totalCredit += parseFloat(assert.credits_earned);
            }
          }
  
          let lastIssuedOn = student.lastIssuedOn;
          let thisIssuedOn = assert.issued_on;
  
          if (thisIssuedOn > lastIssuedOn) {
            student.lastIssuedOn = thisIssuedOn;
          }
        }
  
        student.totalCredit = totalCredit;
      }
      
      let ASU_ID = studentIDs.filter(idItem => idItem.identity_type === "ASU_ID" && idItem.profile === student.id)
      if (ASU_ID.length > 0) {
        ASU_ID = ASU_ID[0].identity
      } else {
        ASU_ID = -1;
      }

      let MCC_ID = studentIDs.filter(idItem => idItem.identity_type === "MCC_ID" && idItem.profile === student.id)
      if (MCC_ID.length > 0) {
        MCC_ID = MCC_ID[0].identity
      } else {
        MCC_ID = -1;
      }

      student.ASU_ID = ASU_ID;
      student.MCC_ID = MCC_ID;

      userList.push({
        cursor: convertNodeToCursor(student.id),
        node: {
          profile: student,
          assertions,
        },
      });
    }
    userList = userList.filter((el) => el !== null);

    if (SQL && SQL !== "") {
      const ast = parser.parse(`select *from STUDENT WHERE ${SQL}`); // mysql sql grammer parsed by default

      const whereCondition = get(ast, "value.where");
      
      userList = filterData(whereCondition, userList);
    }
    return { userList, lastCursor, hasNextPage };
  } else {
    return { userList: [], lastCursor: null, hasNextPage: false };
  }
};

const filterData = (condition, userList) => {
  if (condition.type === "OrExpression" || condition.type === "AndExpression") {
    // we only have AND and OR condition for now
    const leftData = filterData(condition.left, userList);
    const rightData = filterData(condition.right, userList);
    
    let result = [];
    if (condition.type === "AndExpression") {
      result = leftData.filter((e1) => rightData.filter((e2) => e1.node.profile.student_id === e2.node.profile.student_id).length > 0);
    } else {
      result = [...new Set([...leftData, ...rightData])];
    }

    return result;
  } else {
    const filterdUserList = filterUserData(condition, userList);
    return filterdUserList;
  }
};

const filterUserData = (condition, userList) => {
  const fieldName = condition.left.value.toLowerCase();
  const value = condition.right.value.replace(/["']/g, "");

  if (fieldName === "name") {
    if (condition.type === "LikePredicate") {
      const result = cloneDeep(
        userList.filter((user) => {
          const name = get(user, "node.profile.name", "").toLowerCase();
          return name.includes(value.toLowerCase());
        })
      );
      return result;
    } else if (condition.operator === "=") {
      return userList.filter((user) => (get(user, "node.profile.name", "").toLowerCase() = value.toLowerCase()));
    }
  } else if (fieldName === "credit") {
    const result = cloneDeep(
      userList.filter((user) => {
        const totalCredit = get(user, "node.profile.totalCredit", 0);
        return mathResult(parseFloat(totalCredit), condition.operator, parseFloat(value));
      })
    );
    return result;
  } else if (fieldName === "issuedon") {
    const valueDate = moment(value, "YYYY-MM-DD").valueOf();

    const result = cloneDeep(
      userList.filter((user) => {
        const assertions = get(user, "node.assertions", []);

        let findIssue = false;
        for (let assertion of assertions) {
          const issued_on = moment(assertion.issued_on, "YYYY-MM-DD").valueOf();

          let rowType = get(assertion, "achievement.achievement_type");

          if (mathResult(issued_on, condition.operator, valueDate)) {
            findIssue = true;
            break;
          }
        }
        return findIssue;
      })
    );
    return result;
  } else if (fieldName === "class") {
    const result = cloneDeep(
      userList.filter((user) => {
        const assertions = get(user, "node.assertions", []);

        let findIssue = false;
        for (let assertion of assertions) {
          const name = get(assertion, "achievement.name", "");
          if (mathResult(name, condition.operator, value)) {
            findIssue = true;
            break;
          }
        }
        return findIssue;
      })
    );
    return result;
  } else if (fieldName === "degree") {
    const result = cloneDeep(
      userList.filter((user) => {
        const assertions = get(user, "node.assertions", []);

        let findIssue = false;
        for (let assertion of assertions) {
          const achievement_type = get(assertion, "achievement.achievement_type", "");
          if (achievement_type === "Degree") {
            findIssue = true;
            break;
          }
        }
        if (value === "TRUE") {
          return findIssue;
        } else {
          return !findIssue;
        }
      })
    );
    return result;
  } else {
    return [];
  }
};

const mathResult = (op1, operator, op2) => {
  if (operator === "=") {
    return op1 === op2;
  } else if (operator === "<") {
    return op1 < op2;
  } else if (operator === "<=") {
    return op1 <= op2;
  } else if (operator === ">") {
    return op1 > op2;
  } else if (operator === ">=") {
    return op1 >= op2;
  } else if (operator === ">") {
    return op1 > op2;
  } else if (operator === "<>") {
    return op1 !== op2;
  } else if (operator === "IN") {
    return op2.filter((el) => el === op1).length > 0;
  } else {
    return false;
  }
};
module.exports = { ListStudentsQuery };

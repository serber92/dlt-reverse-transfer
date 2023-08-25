const { GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql");
const { AlignmentType } = require("./AlignmentType");
const AchievementType = new GraphQLObjectType({
  name: "AchievementType",
  description: "This represents a Achievement",
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: (parent) => parent.id,
    },
    // last_updated: {
    //   type: GraphQLString,
    //   resolve: (parent) => parent.last_updated,
    // },
    // type: {
    //   type: GraphQLString,
    //   resolve: (parent) => parent.type,
    // },
    // created_by: {
    //   type: GraphQLString,
    //   resolve: (parent) => parent.created_by,
    // },
    achievement_type: {
      type: GraphQLString,
      resolve: (parent) => parent.achievement_type,
    },
    alignments: {
      type: new GraphQLList(AlignmentType),
      resolve: (parent) => parent.alignments,
    },
    // associations: {
    //   type: GraphQLString,
    //   resolve: (parent) => parent.associations,
    // },
    credits_available: {
      type: GraphQLString,
      resolve: (parent) => parent.credits_available,
    },
    description: {
      type: GraphQLString,
      resolve: (parent) => parent.description,
    },
    // endorsements: {
    //   type: new GraphQLList(GraphQLString),
    //   resolve: (parent) => parent.endorsements,
    // },
    human_code: {
      type: GraphQLString,
      resolve: (parent) => parent.human_code,
    },
    name: {
      type: GraphQLString,
      resolve: (parent) => parent.name,
    },
    field_of_study: {
      type: GraphQLString,
      resolve: (parent) => parent.field_of_study,
    },
    // image: {
    //   type: GraphQLString,
    //   resolve: (parent) => parent.image,
    // },
    issuer: {
      type: GraphQLString,
      resolve: (parent) => parent.issuer,
    },
    level: {
      type: GraphQLString,
      resolve: (parent) => parent.level,
    },
    // requirement: {
    //   type: GraphQLString,
    //   resolve: (parent) => parent.requirement,
    // },
    result_descriptions: {
      type: new GraphQLList(GraphQLString),
      resolve: (parent) => parent.result_descriptions,
    },
    // signed_endorsements: {
    //   type: new GraphQLList(GraphQLString),
    //   resolve: (parent) => parent.signed_endorsements,
    // },
    source_key: {
      type: GraphQLString,
      resolve: (parent) => parent.source_key,
    },
    // specialization: {
    //   type: GraphQLString,
    //   resolve: (parent) => parent.specialization,
    // },
    // tags: {
    //   type: GraphQLString,
    //   resolve: (parent) => parent.tags,
    // },
    // properties: {
    //   type: GraphQLString,
    //   resolve: (parent) => parent.properties,
    // },
  }),
});

module.exports = { AchievementType };

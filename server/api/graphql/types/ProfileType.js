const { GraphQLObjectType, GraphQLString, GraphQLFloat } = require("graphql");
const { AddressType } = require("./AddressType");
const { VerificationType } = require("./VerificationType");

const ProfileType = new GraphQLObjectType({
  name: "Profile",
  description: "This represents a Profile",
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: (profile) => profile.id,
    },
    last_updated: {
      type: GraphQLString,
      resolve: (profile) => profile.last_updated,
    },
    created_by: {
      type: GraphQLString,
      resolve: (profile) => profile.created_by,
    },
    type: {
      type: GraphQLString,
      resolve: (profile) => profile.type,
    },
    birthdate: {
      type: GraphQLString,
      resolve: (profile) => profile.birthdate,
    },
    description: {
      type: GraphQLString,
      resolve: (profile) => profile.description,
    },
    email: {
      type: GraphQLString,
      resolve: (profile) => profile.email,
    },
    endorsements: {
      type: GraphQLString,
      resolve: (profile) => profile.endorsements,
    },
    name: {
      type: GraphQLString,
      resolve: (profile) => profile.name,
    },
    image: {
      type: GraphQLString,
      resolve: (profile) => profile.image,
    },
    revocation_list: {
      type: GraphQLString,
      resolve: (profile) => profile.revocation_list,
    },
    signed_endorsements: {
      type: GraphQLString,
      resolve: (profile) => profile.signed_endorsements,
    },
    source_id: {
      type: GraphQLString,
      resolve: (profile) => profile.source_id,
    },
    student_id: {
      type: GraphQLString,
      resolve: (profile) => profile.student_id,
    },
    ASU_ID: {
      type: GraphQLString,
      resolve: (profile) => profile.ASU_ID,
    },
    MCC_ID: {
      type: GraphQLString,
      resolve: (profile) => profile.MCC_ID,
    },
    telephone: {
      type: GraphQLString,
      resolve: (profile) => profile.telephone,
    },
    url: {
      type: GraphQLString,
      resolve: (profile) => profile.url,
    },
    totalCredit: {
      type: GraphQLFloat,
      resolve: (profile) => profile.totalCredit,
    },
    lastIssuedOn: {
      type: GraphQLString,
      resolve: (profile) => profile.lastIssuedOn,
    },
    verification: {
      type: VerificationType,
      resolve: (profile) => {
        if (profile.Verification) {
          return {
            id: profile.Verification.id,
            last_updated: profile.Verification.last_updated,
            type: profile.Verification.type,
            allowed_origins: profile.Verification.allowed_origins,
            creator: profile.Verification.creator,
            starts_with: profile.Verification.starts_with,
            verification_property: profile.Verification.verification_property,
          };
        } else {
          return null;
        }
      },
    },
    address: {
      type: AddressType,
      resolve: (profile) => {
        if (profile.Address) {
          return {
            id: profile.Address.id,
            last_updated: profile.Address.last_updated,
            created_by: profile.Address.created_by,
            type: profile.Address.type,
            address_country: profile.Address.address_country,
            address_locality: profile.Address.address_locality,
            address_region: profile.Address.address_region,
            postal_code: profile.Address.postal_code,
            post_office_box_number: profile.Address.post_office_box_number,
            street_address: profile.Address.street_address,
          };
        } else {
          return null;
        }
      },
    },
  }),
});

module.exports = { ProfileType };

const { GraphQLObjectType, GraphQLString } = require("graphql");

const AddressType = new GraphQLObjectType({
  name: "Address",
  description: "This represents a address",
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: (address) => address.id,
    },
    last_updated: {
      type: GraphQLString,
      resolve: (address) => address.last_updated,
    },
    created_by: {
      type: GraphQLString,
      resolve: (address) => address.created_by,
    },
    type: {
      type: GraphQLString,
      resolve: (address) => address.type,
    },
    address_country: {
      type: GraphQLString,
      resolve: (address) => address.address_country,
    },
    address_locality: {
      type: GraphQLString,
      resolve: (address) => address.address_locality,
    },
    address_region: {
      type: GraphQLString,
      resolve: (address) => address.address_region,
    },
    postal_code: {
      type: GraphQLString,
      resolve: (address) => address.postal_code,
    },
    post_office_box_number: {
      type: GraphQLString,
      resolve: (address) => address.post_office_box_number,
    },
    street_address: {
      type: GraphQLString,
      resolve: (address) => address.street_address,
    },
  }),
});

module.exports = { AddressType };

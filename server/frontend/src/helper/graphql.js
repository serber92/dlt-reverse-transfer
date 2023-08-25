import { gql } from "@apollo/client";

export const SIGNUP = gql`
  mutation createUser($email: String!, $name: String!, $participant_type: String!, $ip_address: String) {
    createUser(email: $email, name: $name, participant_type: $participant_type, ip_address: $ip_address) {
      id
      email
      name
    }
  }
`;

export const SIGNIN = gql`
  mutation loginUser($email: String!) {
    loginUser(email: $email) {
      token
      user {
        name
        email
        participant_type
        active
      }
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($id: String!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

export const GET_STUDENT = gql`
  query getStudent($studentId: String, $name: String, $email: String) {
    getStudent(studentId: $studentId, name: $name, email: $email) {
      profile {
        id
        name
        signed_endorsements
        email
        birthdate
        student_id
        telephone
        totalCredit
        lastIssuedOn
        address {
          id
          postal_code
          address_region
          address_country
          address_locality
          street_address
        }
      }
      assertions {
        id
        credits_earned
        achievement {
          name
          id
          credits_available
          human_code
          field_of_study
          achievement_type
          source_key
          description
          alignments {
            target_code
            target_name
            framework_name
            target_description
            target_url
          }
        }
        issued_on
        recipient
        results {
          id
          result_type
          value
        }
        term
      }
    }
  }
`;

export const LIST_STUDENTS = gql`
  query listStudents($after: String, $first: Int, $SQL: String, $school: String, $StudentID: String) {
    listStudents(after: $after, first: $first, SQL: $SQL, school: $school, StudentID: $StudentID) {
      edges {
        cursor
        node {
          profile {
            name
            email
            birthdate
            student_id
            telephone
            totalCredit
            lastIssuedOn
            ASU_ID
            MCC_ID
            source_id
            address {
              postal_code
              address_country
              address_region
              address_locality
              street_address
            }
          }
          assertions {
            term
            results {
              result_type
              value
            }
            issued_on
            recipient
            start_date
            end_date
            achievement {
              name
              level
              human_code

              description
              field_of_study
              achievement_type
              credits_available
            }
            credits_earned
          }
        }
      }
      pageInfo {
        hasNextPage
        lastCursor
      }
    }
  }
`;

export const GET_USERS = gql`
  query getUsers {
    getUsers {
      id
      name
      email
      participant_type
      ip_address
      active
      created_by
    }
  }
`;

export const CREATE_TSQLQUERY = gql`
  mutation createTSQLQuery($email: String!, $TSQL: String!) {
    createTSQLQuery(email: $email, TSQL: $TSQL) {
      id
      email
      TSQL
    }
  }
`;

export const GET_TSQLQUERY = gql`
  query getTSQL($email: String) {
    getTSQL(email: $email) {
      id
      TSQL
      email
      createdAt
    }
  }
`;

export const DELETE_TSQL = gql`
  mutation deleteTSQLQuery($id: String!) {
    deleteTSQLQuery(id: $id) {
      id
    }
  }
`;

export const UPDATE_NOTE = gql`
  mutation updateNote($email: String!, $note: String!) {
    updateNote(email: $email, note: $note) {
      id
      email
      note
      createdAt
    }
  }
`;

export const GET_NOTE = gql`
  query notes($email: String) {
    notes(email: $email) {
      id
      email
      note
      createdAt
    }
  }
`;

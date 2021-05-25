import {
  challengeDataTest,
  communityData,
  contextData,
  lifecycleData,
  opportunityData,
} from '@test/utils/common-params';
import { graphqlRequestAuth } from '../../../utils/graphql.request';
import { TestUser } from '../../../utils/token.helper';

export const createChildChallengeMutation = async (
  challengeId: string,
  oppName: string,
  oppTextId: string,
  contextTagline?: string
) => {
  const requestParams = {
    operationName: null,
    query: `mutation createChildChallenge($challengeData: CreateChallengeInput!) {
      createChildChallenge(challengeData: $challengeData) {
        ${challengeDataTest}
      }
    }`,
    variables: {
      challengeData: {
        parentID: challengeId,
        name: oppName,
        textID: oppTextId,
        context: {
          background: 'test background',
          vision: 'test vision',
          tagline: `${contextTagline}`,
          who: 'test who',
          impact: 'test impact',
          references: {
            name: 'test ref name',
            uri: 'https://test.com/',
            description: 'test description',
          },
        },
      },
    },
  };

  return await graphqlRequestAuth(requestParams, TestUser.GLOBAL_ADMIN);
};

export const createOpportunityMutation = async (
  challengeId: string,
  oppName: string,
  oppTextId: string,
  contextTagline?: string
) => {
  const requestParams = {
    operationName: null,
    query: `mutation createOpportunity($opportunityData: CreateOpportunityInput!) {
      createOpportunity(opportunityData: $opportunityData) {
        ${opportunityData}
      }
    }`,
    variables: {
      opportunityData: {
        challengeID: challengeId,
        name: oppName,
        textID: oppTextId,
        context: {
          background: 'test background',
          vision: 'test vision',
          tagline: `${contextTagline}`,
          who: 'test who',
          impact: 'test impact',
          references: {
            name: 'test ref name',
            uri: 'https://test.com/',
            description: 'test description',
          },
        },
      },
    },
  };

  return await graphqlRequestAuth(requestParams, TestUser.GLOBAL_ADMIN);
};

export const updateOpportunityOnChallengeMutation = async (
  opportunityId: string
) => {
  const requestParams = {
    operationName: null,
    query: `mutation updateOpportunity($opportunityData: UpdateOpportunityInput!) {
      updateOpportunity(opportunityData: $opportunityData) {
        ${opportunityData}
      }
    }`,
    variables: {
      opportunityData: {
        ID: opportunityId,
        name: '1',
        context: {
          background: '1',
          vision: '1',
          tagline: '1',
          who: '1',
          impact: '1',
        },
      },
    },
  };

  return await graphqlRequestAuth(requestParams, TestUser.GLOBAL_ADMIN);
};

export const addUserToOpportunityMutation = async (
  opportunityId: any,
  userId: any
) => {
  const requestParams = {
    operationName: null,
    query: `mutation addUserToOpportunity($userID: Float!, $opportunityID: Float!) {
      addUserToOpportunity(opportunityID: $opportunityID, userID: $userID) {
        name,
        id,
        members {
          id,
          name
        }
      }
    }`,
    variables: {
      userID: parseFloat(userId),
      opportunityID: parseFloat(opportunityId),
    },
  };

  return await graphqlRequestAuth(requestParams, TestUser.GLOBAL_ADMIN);
};

export const removeOpportunityMutation = async (opportunityId: string) => {
  const requestParams = {
    operationName: null,
    query: `mutation deleteOpportunity($deleteData: DeleteOpportunityInput!) {
      deleteOpportunity(deleteData: $deleteData) {
        id
      }}`,
    variables: {
      deleteData: {
        ID: opportunityId,
      },
    },
  };

  return await graphqlRequestAuth(requestParams, TestUser.GLOBAL_ADMIN);
};

export const queryOpportunity = async (opportunityId: string) => {
  const requestParams = {
    operationName: null,
    query: `query {ecoverse{
      opportunity(ID: "${opportunityId}") {
        ${opportunityData}
      }
    }}`,
  };

  return await graphqlRequestAuth(requestParams, TestUser.GLOBAL_ADMIN);
};

export const queryOpportunities = async () => {
  const requestParams = {
    operationName: null,
    query: `query {
      ecoverse{
      opportunities {
        ${opportunityData}
      }
    }
  }`,
  };

  return await graphqlRequestAuth(requestParams, TestUser.GLOBAL_ADMIN);
};

// remove potentially
export const queryOpportunityGroups = async (opportunityId: any) => {
  const requestParams = {
    operationName: null,
    query: `query {ecoverse{
      opportunity(ID: "${opportunityId}") {
        community{id name groups{id name members{id name}}}
      }
    }
  }`,
  };

  return await graphqlRequestAuth(requestParams, TestUser.GLOBAL_ADMIN);
};

// remove potentially
export const queryOpportunitySubEntities = async (opportunityId: string) => {
  const requestParams = {
    operationName: null,
    query: `query {
      ecoverse{
      opportunity(ID: "${opportunityId}") {
        aspects {

          title
        }
        projects {

          name
        }
        actorGroups {

          name
        }
        relations {

          actorName
        }
        community {
          groups {
            name
          }
        }
        context{

          tagline
        }
      }
    }
  }`,
  };

  return await graphqlRequestAuth(requestParams, TestUser.GLOBAL_ADMIN);
};

// remove potentially
export const queryChallengesSubEntities = async () => {
  const requestParams = {
    operationName: null,
    query: `query {
      ecoverse{
      challenges  {
        ${subChallengesSubEntities}
      }
    }
  }`,
  };

  return await graphqlRequestAuth(requestParams, TestUser.GLOBAL_ADMIN);
};

// remove potentially
export const subChallengesSubEntities = `
  id
  community {
    groups {
      id
    }
  }
  collaboration {
    relations {
      id
    }
    projects {
      id
    }
  }
  context {
    id
    aspects {
      id
    }
    ecosystemModel {
      id
      actorGroups {
        id
        actors {
          id
        }
      }
    }
  }`;

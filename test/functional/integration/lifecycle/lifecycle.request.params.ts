import { TestUser } from '@test/utils/token.helper';
import { graphqlRequestAuth } from '@test/utils/graphql.request';

export const lifecycleData = `
lifecycle {
  id
  state
  nextEvents
  machineDef
  templateId
}`;

export const eventOnChallengeMutation = async (
  challengeId: string,
  eventsName: string
) => {
  const requestParams = {
    operationName: null,
    query: `mutation eventOnChallenge($challengeEventData: ChallengeEventInput!) {
      eventOnChallenge(challengeEventData: $challengeEventData) {
        id
        ${lifecycleData}
      }
    }`,
    variables: {
      challengeEventData: {
        ID: parseFloat(challengeId),
        eventName: `${eventsName}`,
      },
    },
  };

  return await graphqlRequestAuth(requestParams, TestUser.GLOBAL_ADMIN);
};

export const eventOnOpportunityMutation = async (
  opportunityId: string,
  eventsName: string
) => {
  const requestParams = {
    operationName: null,
    query: `mutation eventOnOpportunity($opportunityEventData: OpportunityEventInput!) {
      eventOnOpportunity(opportunityEventData: $opportunityEventData) {
        id
        ${lifecycleData}
      }
    }`,
    variables: {
      opportunityEventData: {
        ID: parseFloat(opportunityId),
        eventName: `${eventsName}`,
      },
    },
  };

  return await graphqlRequestAuth(requestParams, TestUser.GLOBAL_ADMIN);
};

export const eventOnProjectMutation = async (
  projectId: string,
  eventsName: string
) => {
  const requestParams = {
    operationName: null,
    query: `mutation eventOnProject($projectEventData: ProjectEventInput!) {
      eventOnProject(projectEventData: $projectEventData) {
        id
        ${lifecycleData}
      }
    }`,
    variables: {
      projectEventData: {
        ID: parseFloat(projectId),
        eventName: `${eventsName}`,
      },
    },
  };

  return await graphqlRequestAuth(requestParams, TestUser.GLOBAL_ADMIN);
};

export const eventOnApplicationMutation = async (
  applicationId: string,
  eventsName: string
) => {
  const requestParams = {
    operationName: null,
    query: `mutation eventOnApplication($applicationEventData: ApplicationEventInput!) {
      eventOnApplication(applicationEventData: $applicationEventData) {
        id
        ${lifecycleData}
      }
    }`,
    variables: {
      applicationEventData: {
        ID: parseFloat(applicationId),
        eventName: `${eventsName}`,
      },
    },
  };

  return await graphqlRequestAuth(requestParams, TestUser.GLOBAL_ADMIN);
};
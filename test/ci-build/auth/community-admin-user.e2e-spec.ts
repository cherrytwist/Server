import { graphqlRequest, graphqlRequestAuth } from '../../utils/graphql.request';
import { TestUser } from '../../utils/token.helper';
import '../../utils/array.matcher';
import { appSingleton } from '../../utils/app.singleton';
import {
  name,
  hostMembers,
  hostGroups,
  hostProfile,
  contextTagline,
  contextBackground,
  contextVision,
  contextImpact,
  contextWho,
  contextReferencesName,
  usersName,
  usersAccountUPN,
  usersProfile,
  usersMemberofGroupsName,
  usersMemberofChallengesName,
  usersMemberofOrganisationsName,
  userName,
  userAccountUPN,
  userProfile,
  userMemberofGroupsName,
  userMemberofChallengesName,
  userMemberofOrganisationsName,
  usersById,
  groupsName,
  groupsFocalPointName,
  groupsProfile,
  groupsMembersName,
  groupsParentChallenge,
  groupsParentEcoverse,
  groupsParentOpportunity,
  groupsWithTagName,
  groupsWithTagFocalPointName,
  groupsWithTagProfile,
  groupsWithTagMembersName,
  groupsWithTagParentChallenge,
  groupsWithTagParentEcoverse,
  groupsWithTagParentOpportunity,
  challengesName,
  challengesTextId,
  challengesState,
  challengesContext,
  challengesLeadOrganisation,
  challengesLeadOrganisationGroups,
  challengesContributors,
  challengesTagsets,
  challengesGroups,
  challengesOpportunities,
  challengeName,
  challengeTextId,
  challengeState,
  challengeContext,
  challengeLeadOrganisation,
  challengeLeadOrganisationGroups,
  challengeTagsets,
  challengeGroups,
  challengeContributors,
  challengeOpportunities,
  opportunitiesName,
  opportunitiesTextId,
  opportunitiesState,
  opportunitiesContext,
  opportunitiesGroups,
  opportunitiesContributors,
  opportunitiesProjectsName,
  opportunitiesProjectsAspectsName,
  opportunitiesActorgroupsName,
  opportunitiesActorGroupsActorsName,
  opportunitiesAspects,
  opportunitiesRelationsName,
  projectsName,
  projectsTextId,
  projectsDescription,
  projectsState,
  projectsTagset,
  projectsAspects,
  templatesName,
  templatesDescription,
  templatesUsersName,
} from './queries';

import {
  createOrganisationMutation,
  createOrganisationVariables,
  createGroupOnEcoverseMutation,
  createGroupOnEcoverseVariables,
  createUserMutation,
  createUserVariables,
  createReferenceOnProfileMutation,
  createReferenceOnProfileVariable,
  createTemplateMutation,
  createTemplateVariables,
  createChallengeMutation,
  createChallengeVariables,
  createGroupOnChallengeMutation,
  createGroupOnChallengeVariables,
  createOpportunityMutation,
  createOpportunityVariables,
  createGroupOnOpportunityMutations,
  createGroupOnOpportunityVariables,
  createProjectMutation,
  createProjectVariables,
  createActorGroupMutation,
  createActorGroupVariables,
  createActorMutation,
  createActorVariables,
  createAspectOnOpportunityMutation,
  createAspectOnOpportunityVariables,
  createRelationMutation,
  createRelationVariables,
  createAspectOnProjectMutation,
  createAspectOnProjectVariables,
  createReferenceOnContextMutation,
  createReferenceOnContextVariables,
  createTagsetOnProfileMutation,
  createTagsetOnProfileVariables,
} from './create-mutations';

import {
  updateUserMutation,
  updateUserVariables,
  updateProfileMutation,
  updateProfileVariables,
  updateOrganisationMutation,
  updateOrganisationVariabls,
  updateChallengeMutation,
  updateChallengeVariables,
  updateOpportunityMutation,
  updateOpportunityVariables,
  updateAspectMutation,
  updateAspectVariable,
  updateActorMutation,
  updateActorVariables,
  addTagsOnTagsetMutation,
  addTagsOnTagsetVariables,
  replaceTagsOnTagsetMutation,
  replaceTagsOnTagsetVariables,
  addUserToChallengeMutation,
  addUserToChallengeVariables,
  addUserToGroupMutation,
  addUserToGroupVariables,
  addUserToOpportunityMutation,
  addUserToOpportunityVariables,
  assignGroupFocalPointMutation,
  assignGroupFocalPointVariables,
  removeGroupFocalPointMutation,
  removeGroupFocalPointVariables,
  addChallengeLeadToOrganisationMutation,
  addChallengeLeadToOrganisationVariables,
  removeUserFromGroupMutation,
  removeUserFromGroupVariables,
} from './update-mutations';

import {
  removeUserMutation,
  removeUserVariables,
  removeChallengeMutation,
  removeChallengeVariables,
  removeAspectMutation,
  removeAspectVariables,
  removeActorMutation,
  removeActorVariables,
  removeActorGroupMutation,
  removeActorGroupVariables,
} from './remove-mutations';

const notAuthorizedCode = `"code":"UNAUTHENTICATED"`;
const forbiddenCode = `"code":"FORBIDDEN"`;

beforeAll(async () => {
  if (!appSingleton.Instance.app) await appSingleton.Instance.initServer();
});

afterAll(async () => {
  if (appSingleton.Instance.app) await appSingleton.Instance.teardownServer();
});

describe('DDT community admin user - queries - authorized', () => {
  // Arrange
  test.each`
    query                                 | expected
    ${name}                               | ${notAuthorizedCode}
    ${hostGroups}                         | ${notAuthorizedCode}
    ${hostMembers}                        | ${notAuthorizedCode}
    ${hostProfile}                        | ${notAuthorizedCode}
    ${contextTagline}                     | ${notAuthorizedCode}
    ${contextBackground}                  | ${notAuthorizedCode}
    ${contextVision}                      | ${notAuthorizedCode}
    ${contextWho}                         | ${notAuthorizedCode}
    ${contextImpact}                      | ${notAuthorizedCode}
    ${contextReferencesName}              | ${notAuthorizedCode}
    ${usersName}                          | ${notAuthorizedCode}
    ${usersAccountUPN}                    | ${notAuthorizedCode}
    ${usersProfile}                       | ${notAuthorizedCode}
    ${usersMemberofGroupsName}            | ${notAuthorizedCode}
    ${usersMemberofChallengesName}        | ${notAuthorizedCode}
    ${usersMemberofOrganisationsName}     | ${notAuthorizedCode}
    ${userName}                           | ${notAuthorizedCode}
    ${userAccountUPN}                     | ${notAuthorizedCode}
    ${userProfile}                        | ${notAuthorizedCode}
    ${userMemberofGroupsName}             | ${notAuthorizedCode}
    ${userMemberofChallengesName}         | ${notAuthorizedCode}
    ${userMemberofOrganisationsName}      | ${notAuthorizedCode}
    ${usersById}                          | ${notAuthorizedCode}
    ${groupsName}                         | ${notAuthorizedCode}
    ${groupsFocalPointName}               | ${notAuthorizedCode}
    ${groupsProfile}                      | ${notAuthorizedCode}
    ${groupsMembersName}                  | ${notAuthorizedCode}
    ${groupsParentChallenge}              | ${notAuthorizedCode}
    ${groupsParentEcoverse}               | ${notAuthorizedCode}
    ${groupsParentOpportunity}            | ${notAuthorizedCode}
    ${groupsWithTagName}                  | ${notAuthorizedCode}
    ${groupsWithTagFocalPointName}        | ${notAuthorizedCode}
    ${groupsWithTagProfile}               | ${notAuthorizedCode}
    ${groupsWithTagMembersName}           | ${notAuthorizedCode}
    ${groupsWithTagParentChallenge}       | ${notAuthorizedCode}
    ${groupsWithTagParentEcoverse}        | ${notAuthorizedCode}
    ${groupsWithTagParentOpportunity}     | ${notAuthorizedCode}
    ${challengesName}                     | ${notAuthorizedCode}
    ${challengesTextId}                   | ${notAuthorizedCode}
    ${challengesState}                    | ${notAuthorizedCode}
    ${challengesContext}                  | ${notAuthorizedCode}
    ${challengesLeadOrganisation}         | ${notAuthorizedCode}
    ${challengesLeadOrganisationGroups}   | ${notAuthorizedCode}
    ${challengesContributors}             | ${notAuthorizedCode}
    ${challengesTagsets}                  | ${notAuthorizedCode}
    ${challengesGroups}                   | ${notAuthorizedCode}
    ${challengesOpportunities}            | ${notAuthorizedCode}
    ${challengeName}                      | ${notAuthorizedCode}
    ${challengeTextId}                    | ${notAuthorizedCode}
    ${challengeState}                     | ${notAuthorizedCode}
    ${challengeContext}                   | ${notAuthorizedCode}
    ${challengeLeadOrganisation}          | ${notAuthorizedCode}
    ${challengeLeadOrganisationGroups}    | ${notAuthorizedCode}
    ${challengeContributors}              | ${notAuthorizedCode}
    ${challengeTagsets}                   | ${notAuthorizedCode}
    ${challengeGroups}                    | ${notAuthorizedCode}
    ${challengeOpportunities}             | ${notAuthorizedCode}
    ${opportunitiesName}                  | ${notAuthorizedCode}
    ${opportunitiesTextId}                | ${notAuthorizedCode}
    ${opportunitiesState}                 | ${notAuthorizedCode}
    ${opportunitiesContext}               | ${notAuthorizedCode}
    ${opportunitiesContributors}          | ${notAuthorizedCode}
    ${opportunitiesGroups}                | ${notAuthorizedCode}
    ${opportunitiesActorgroupsName}       | ${notAuthorizedCode}
    ${opportunitiesActorGroupsActorsName} | ${notAuthorizedCode}
    ${opportunitiesAspects}               | ${notAuthorizedCode}
    ${opportunitiesRelationsName}         | ${notAuthorizedCode}
    ${projectsName}                       | ${notAuthorizedCode}
    ${projectsTextId}                     | ${notAuthorizedCode}
    ${projectsDescription}                | ${notAuthorizedCode}
    ${projectsState}                      | ${notAuthorizedCode}
    ${projectsTagset}                     | ${notAuthorizedCode}
    ${projectsAspects}                    | ${notAuthorizedCode}
    ${templatesName}                      | ${notAuthorizedCode}
    ${templatesDescription}               | ${notAuthorizedCode}
  `(
    "should expect: '$expected' for query: '$query'",
    async ({ query, expected }) => {
      // Act
      const requestParamsQueryData = {
        operationName: null,
        query: `${query}`,
        variables: null,
      };
      const response = await graphqlRequestAuth(
        requestParamsQueryData,
        TestUser.COMMUNITY_ADMIN
      );
      let responseData = JSON.stringify(response.body).replace('\\', '');

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).not.toContain(expected);
    }
  );
});

// Failing scenarios BUG: https://app.zenhub.com/workspaces/cherrytwist-5ecb98b262ebd9f4aec4194c/issues/cherrytwist/server/578
// ${opportunitiesProjectsId}          | ${notAuthorizedCode}
// ${opportunitiesProjectsAspectsId}   | ${notAuthorizedCode}

describe('DDT community admin user - Create mutations - authorized', () => {
  // Arrange
  test.each`
    mutation                            | variables                            | expected
    ${createOrganisationMutation}       | ${createOrganisationVariables}       | ${notAuthorizedCode}
    ${createUserMutation}               | ${createUserVariables}               | ${notAuthorizedCode}
    ${createReferenceOnProfileMutation} | ${createReferenceOnProfileVariable}  | ${notAuthorizedCode}
    ${createReferenceOnContextMutation} | ${createReferenceOnContextVariables} | ${notAuthorizedCode}
    ${createTagsetOnProfileMutation}    | ${createTagsetOnProfileVariables}    | ${notAuthorizedCode}
  `(
    "should expect: '$expected' for create mutation: '$mutation' and variables: '$variables'",
    async ({ mutation, variables, expected }) => {
      // Act
      const requestParamsCreateMutations = {
        operationName: null,
        query: `${mutation}`,
        variables: `${variables}`,
      };
      const response = await graphqlRequestAuth(
        requestParamsCreateMutations,
        TestUser.COMMUNITY_ADMIN
      );
      let responseData = JSON.stringify(response.body).replace('\\', '');

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).not.toContain(expected);
    }
  );
});

describe('DDT community admin user - Create mutations - NOT authorized', () => {
  // Arrange
  test.each`
    mutation                             | variables                             | expected
    ${createGroupOnEcoverseMutation}     | ${createGroupOnEcoverseVariables}     | ${forbiddenCode}
    ${createTemplateMutation}            | ${createTemplateVariables}            | ${forbiddenCode}
    ${createChallengeMutation}           | ${createChallengeVariables}           | ${forbiddenCode}
    ${createGroupOnChallengeMutation}    | ${createGroupOnChallengeVariables}    | ${forbiddenCode}
    ${createOpportunityMutation}         | ${createOpportunityVariables}         | ${forbiddenCode}
    ${createGroupOnOpportunityMutations} | ${createGroupOnOpportunityVariables}  | ${forbiddenCode}
    ${createProjectMutation}             | ${createProjectVariables}             | ${forbiddenCode}
    ${createActorGroupMutation}          | ${createActorGroupVariables}          | ${forbiddenCode}
    ${createActorMutation}               | ${createActorVariables}               | ${forbiddenCode}
    ${createAspectOnOpportunityMutation} | ${createAspectOnOpportunityVariables} | ${forbiddenCode}
    ${createRelationMutation}            | ${createRelationVariables}            | ${forbiddenCode}
    ${createAspectOnProjectMutation}     | ${createAspectOnProjectVariables}     | ${forbiddenCode}
  `(
    "should expect: '$expected' for create mutation: '$mutation' and variables: '$variables'",
    async ({ mutation, variables, expected }) => {
      // Act
      const requestParamsCreateMutations = {
        operationName: null,
        query: `${mutation}`,
        variables: `${variables}`,
      };
      const response = await graphqlRequestAuth(
        requestParamsCreateMutations,
        TestUser.COMMUNITY_ADMIN
      );
      let responseData = JSON.stringify(response.body).replace('\\', '');

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toContain(expected);
    }
  );
});

describe('DDT community admin user - Update mutations - authorized', () => {
  // Arrange
  test.each`
    mutation                                  | variables                                  | expected
    ${updateUserMutation}                     | ${updateUserVariables}                     | ${notAuthorizedCode}
    ${updateProfileMutation}                  | ${updateProfileVariables}                  | ${notAuthorizedCode}
    ${updateOrganisationMutation}             | ${updateOrganisationVariabls}              | ${notAuthorizedCode}
    ${addTagsOnTagsetMutation}                | ${addTagsOnTagsetVariables}                | ${notAuthorizedCode}
    ${replaceTagsOnTagsetMutation}            | ${replaceTagsOnTagsetVariables}            | ${notAuthorizedCode}
    ${addUserToChallengeMutation}             | ${addUserToChallengeVariables}             | ${notAuthorizedCode}
    ${addUserToGroupMutation}                 | ${addUserToGroupVariables}                 | ${notAuthorizedCode}
    ${addUserToOpportunityMutation}           | ${addUserToOpportunityVariables}           | ${notAuthorizedCode}
    ${assignGroupFocalPointMutation}          | ${assignGroupFocalPointVariables}          | ${notAuthorizedCode}
    ${removeGroupFocalPointMutation}          | ${removeGroupFocalPointVariables}          | ${notAuthorizedCode}
    ${addChallengeLeadToOrganisationMutation} | ${addChallengeLeadToOrganisationVariables} | ${notAuthorizedCode}
    ${removeUserFromGroupMutation}            | ${removeUserFromGroupVariables}            | ${notAuthorizedCode}
  `(
    "should expect: '$expected' for update mutation: '$mutation' and variables: '$variables'",
    async ({ mutation, variables, expected }) => {
      // Act
      const requestParamsUpdateMutations = {
        operationName: null,
        query: `${mutation}`,
        variables: `${variables}`,
      };
      const response = await graphqlRequestAuth(
        requestParamsUpdateMutations,
        TestUser.COMMUNITY_ADMIN
      );
      let responseData = JSON.stringify(response.body).replace('\\', '');

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).not.toContain(expected);
    }
  );
});

describe('DDT community admin user - Update mutations - NOT authorized', () => {
  // Arrange
  test.each`
    mutation                     | variables                     | expected
    ${updateChallengeMutation}   | ${updateChallengeVariables}   | ${forbiddenCode}
    ${updateOpportunityMutation} | ${updateOpportunityVariables} | ${forbiddenCode}
    ${updateAspectMutation}      | ${updateAspectVariable}       | ${forbiddenCode}
    ${updateActorMutation}       | ${updateActorVariables}       | ${forbiddenCode}
  `(
    "should expect: '$expected' for update mutation: '$mutation' and variables: '$variables'",
    async ({ mutation, variables, expected }) => {
      // Act
      const requestParamsUpdateMutations = {
        operationName: null,
        query: `${mutation}`,
        variables: `${variables}`,
      };
      const response = await graphqlRequestAuth(
        requestParamsUpdateMutations,
        TestUser.COMMUNITY_ADMIN
      );
      let responseData = JSON.stringify(response.body).replace('\\', '');

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toContain(expected);
    }
  );
});

describe('DDT community admin user - Remove mutations - authorized', () => {
  // Arrange
  test.each`
    mutation              | variables              | expected
    ${removeUserMutation} | ${removeUserVariables} | ${notAuthorizedCode}
  `(
    "should expect: '$expected' for remove mutation: '$mutation' and variables: '$variables'",
    async ({ mutation, variables, expected }) => {
      // Act
      const requestParamsRemoveMutations = {
        operationName: null,
        query: `${mutation}`,
        variables: `${variables}`,
      };
      const response = await graphqlRequestAuth(
        requestParamsRemoveMutations,
        TestUser.COMMUNITY_ADMIN
      );
      let responseData = JSON.stringify(response.body).replace('\\', '');

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).not.toContain(expected);
    }
  );
});

describe('DDT community admin user - Remove mutations - NOT authorized', () => {
  // Arrange
  test.each`
    mutation                    | variables                    | expected
    ${removeChallengeMutation}  | ${removeChallengeVariables}  | ${forbiddenCode}
    ${removeAspectMutation}     | ${removeAspectVariables}     | ${forbiddenCode}
    ${removeActorGroupMutation} | ${removeActorGroupVariables} | ${forbiddenCode}
    ${removeActorMutation}      | ${removeActorVariables}      | ${forbiddenCode}
  `(
    "should expect: '$expected' for remove mutation: '$mutation' and variables: '$variables'",
    async ({ mutation, variables, expected }) => {
      // Act
      const requestParamsRemoveMutations = {
        operationName: null,
        query: `${mutation}`,
        variables: `${variables}`,
      };
      const response = await graphqlRequestAuth(
        requestParamsRemoveMutations,
        TestUser.COMMUNITY_ADMIN
      );
      let responseData = JSON.stringify(response.body).replace('\\', '');

      // Assert
      expect(response.status).toBe(200);
      expect(responseData).toContain(expected);
    }
  );
});
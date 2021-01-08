import { createUserMutation, removeUserMutation } from './user.request.params';
import { graphqlRequestAuth } from '@test/utils/graphql.request';
import '@test/utils/array.matcher';
import { appSingleton } from '@test/utils/app.singleton';
import { TestUser } from '../../../utils/token.helper';

let userName = '';
let userId = '';
let userPhone = '';
let userEmail = '';
let uniqueId = '';

beforeAll(async () => {
  if (!appSingleton.Instance.app) await appSingleton.Instance.initServer();
});

afterAll(async () => {
  if (appSingleton.Instance.app) await appSingleton.Instance.teardownServer();
});

beforeEach(() => {
  uniqueId = Math.random()
    .toString(36)
    .slice(-6);
  userName = `testUser${uniqueId}`;
  userPhone = `userPhone ${uniqueId}`;
  userEmail = `${uniqueId}@test.com`;
});

describe('Remove user', () => {
  test('should remove created user', async () => {
    // Arrange
    const response = await createUserMutation(userName);
    userId = response.body.data.createUser.id;

    // Act
    const responseQuery = await removeUserMutation(userId);

    // Assert
    expect(responseQuery.status).toBe(200);
    expect(responseQuery.body.data.removeUser).toBe(true);
  });

  test('should receive a message for removing already removed user', async () => {
    // Arrange
    const response = await createUserMutation(userName);
    userId = response.body.data.createUser.id;
    await removeUserMutation(userId);

    // Act
    const responseQuery = await removeUserMutation(userId);

    // Assert
    expect(responseQuery.status).toBe(200);
    expect(responseQuery.text).toContain(
      `Could not locate specified user: ${userId}`
    );
  });

  test('should receive a message for removing unexisting user', async () => {
    // Act
    const responseQuery = await removeUserMutation(77777);

    // Assert
    expect(responseQuery.status).toBe(200);
    expect(responseQuery.text).toContain(
      'Could not locate specified user: 77777'
    );
  });

  test('should not get result for quering removed user', async () => {
    // Arrange
    const response = await createUserMutation(userName);
    userId = response.body.data.createUser.id;
    await removeUserMutation(userId);

    // Act
    const requestParamsQueryUser = {
      query: `{user(ID: "${userId}") {
          name
          id
        }}`,
    };
    const responseQueryResult = await graphqlRequestAuth(
      requestParamsQueryUser,
      TestUser.GLOBAL_ADMIN
    );

    // Assert
    expect(responseQueryResult.status).toBe(200);
    expect(responseQueryResult.text).toContain(
      `Unable to locate user with given id: ${userId}`
    );
  });
});
import { MatrixClient } from '../types/matrix.client.type';
import { IMatrixEventHandler } from './matrix.event.dispatcher';

const noop = function() {
  // empty
};

export class AutoAcceptGroupMembershipMonitorFactory {
  static create(
    client: MatrixClient
  ): IMatrixEventHandler['groupMyMembershipMonitor'] {
    return {
      complete: noop,
      error: noop,
      next: async ({ group }) => {
        if (group.myMembership === 'invite') {
          try {
            await client.acceptGroupInvite(
              group.groupId /* There are additional options, but not documented... saw that some are used in synapse */
            );
          } catch (ex) {
            console.info(
              'Suppressing exception when user is invited to a non-public group resulting in failure'
            );
            console.error(ex);
          }
        }
      },
    };
  }
}

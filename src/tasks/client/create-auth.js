const {success, failure} = require('../../lib/result');
const {
  alreadyExists: errorAlreadyExists,
  insufficientPrivileges: errorInsufficientPrivileges,
} = require('./auth/errors');

/**
 * Init create auth task
 * @param {AuthRepository} authRepository Auth Repository
 * @returns {ClientTasks#createAuth} Create auth task
 */
module.exports = ({authRepository}) =>
  /**
   * @function ClientTasks#createAuth
   * @param {AuthModel} authToken Authorization
   * @param {object} data Data
   * @returns {Result<AuthModel>}
   */
  async ({authToken, data}) => {
    const {scope, realmId} = authToken;

    if (scope !== 'admin') {
      return failure(errorInsufficientPrivileges({
        action: 'create an auth token',
      }));
    }

    try {
      const createdAuth = await authRepository.create({
        ...data,
        realmId,
      });
      return success(createdAuth);
    } catch (creationError) {
      if (creationError.isDuplicateKeyError) {
        return failure(errorAlreadyExists(), creationError);
      }
      throw creationError;
    }
  };

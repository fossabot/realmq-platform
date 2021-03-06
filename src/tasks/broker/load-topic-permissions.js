/**
 *
 * @param {ChannelRepository} channelRepository Channel repository
 * @param {SubscriptionRepository} subscriptionRepository Subscription repository
 * @param {function({topic: string}): object} lookupStaticPermissions Lookup of static permissions
 * @returns {Function} loadTopicPermissions
 */
module.exports = ({channelRepository, subscriptionRepository, lookupStaticPermissions}) =>
  /**
   * @function BrokerTasks#loadTopicPermissions
   * @param {string} realmId Realm ID
   * @param {string} userId User ID
   * @param {string} topic Topic
   * @returns {Promise<?{read: boolean, write: boolean}>}
   */
  async ({realmId, userId, topic}) => {
    const staticPermission = lookupStaticPermissions({topic});
    if (staticPermission) {
      return staticPermission;
    }

    const [channel, subscription] = await Promise.all([
      channelRepository.findOne({realmId, id: topic}),
      subscriptionRepository.findOneByChannelAndUserId({realmId, channelId: topic, userId}),
    ]);

    if (!channel || !subscription) {
      return {read: false, write: false};
    }

    return {
      read: subscription.allowRead,
      write: subscription.allowWrite,
    };
  };

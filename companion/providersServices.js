const checkProviderStatus = members => {
  const statuses = members.reduce((prev, el) => {
    switch (el.providerType.id) {
      case 'aws':
        return {
          ...prev,
          aws: el.status === 'Ok' && prev.status !== null ? ++prev.aws : null
        }
      case 'azure':
        return {
          ...prev,
          azure: el.status === 'Ok' && prev.status !== null ? ++prev.azure : null
        }
      case 'ncs':
        return {
          ...prev,
          ncs: el.status === 'Ok' && prev.status !== null ? ++prev.ncs : null
        }
      default:
        throw new Error('wrong status');
    }
  }, { aws: 0, azure: 0, ncs: 0 });

  const stats = {
    up: 0,
    down: 0
  };

  Object.values(statuses).forEach((value) => {
    if (value !== null) {
      stats.up++;
    } else {
      stats.down++;
    }
  });
  statuses.stats = stats;
  return statuses;
};

export { checkProviderStatus };
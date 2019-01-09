const projectsSummury = response => ({
  deployments: response.members.reduce((total, el) => total + el.deployments.total, 0),
  total: response.members.length
});

const fullProjectsList = members => {
  const fullList = members.map(el => {
    return {
      name: el.name,
      id: el.id,
      deployments: el.deployments.total
    };
  });
  return fullList;
};

export { projectsSummury, fullProjectsList };
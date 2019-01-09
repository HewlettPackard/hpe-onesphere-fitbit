const fullDeploymentList = members => {

  const fullList = members.map(el => {
    return {
      name: el.name,
      id:   el.id
    };
  });
    return fullList;
};


export { fullDeploymentList };
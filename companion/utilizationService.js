const getPcUtilization = (members, header) => {
  try {
    const names = [
      'server.cpu.total',
      'server.cpu.usage',
      'storage.total',
      'storage.available'
    ];
    const fullList = members.reduce((r, el) => {
      if (names.includes(el.name)) {
        r.push({
          name:  el.name,
          value: Math.trunc(el.values[el.values.length - 1].value)
        })
      }
      return r;
    }, []);
    const result = {
      title: `${header}`,
      serverCpuTotals: `CPU ${fullList[1].value}/${fullList[0].value}`,
      serverStorageTotals: `Storage ${fullList[2].value - fullList[3].value}/${fullList[2].value}`
    };

    return result;
  } catch (err) {
    console.log(err)
  }
};

const getAwsUtilization = (members, header) => {
  try {
    const names = [
      'vm.cpu.total',
      'vm.cpu.usage'
    ];
    const fullList = members.reduce((r, el) => {
      if (names.includes(el.name)) {
        r.push({
          name:  el.name,
          value: Math.trunc(el.values[el.values.length - 1].value)
        })
      }
      return r;
    }, []);
    const result = {
      title:           `${header}`,
      serverCpuTotals: `CPU ${fullList[1].value}/${fullList[0].value}`,
    };
    return result;
  } catch (err) {
    console.log(err)
  }
};

const getAzureUtilization = (members, header) => {
  try {
    const names = [
      'vm.cpu.total',
      'vm.cpu.usage'
    ];

    const fullList = members.reduce((r, el) => {
      if (names.includes(el.name)) {
        r.push({
          name: el.name,
          value: Math.trunc(el.values[el.values.length - 1].value)
        })
      }
      
      return r;
    }, []);
    const result = {
      title: `${header}`,
      serverCpuTotals: `CPU ${fullList[1].value}/${fullList[0].value}`,
    };
    return result;
  } catch (err) {
    console.log(err)
  }
};

export { getPcUtilization, getAwsUtilization, getAzureUtilization };
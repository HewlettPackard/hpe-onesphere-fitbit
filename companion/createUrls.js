const createUrls = (onesphereUrl) => {
  const baseUrl = `https://${onesphereUrl}/rest`;
  const ratingUrl = type => `metrics?resourceUri=%2Frest%2Fprovider-types%2F${type}&name=score.overall&period=day&periodCount=1&periodStart=`;
  
  return {  
    sessionUrl: `${baseUrl}/session`,
    costUrl: (year, month) => `${baseUrl}/metrics?name=cost.total&name=cost.efficiency&name=cost.usage&period=month&periodStart=${year}-${month}-01T00%3A00%3A00Z&periodCount=-1&category=providers&groupBy=providerTypeUri&view=full`,
    awsUrl: `${baseUrl}/${ratingUrl('aws')}`,
    azureUrl: `${baseUrl}/${ratingUrl('azure')}`,
    pcUrl: `${baseUrl}/${ratingUrl('ncs')}`,
    providerStatusUrl: `${baseUrl}/providers?view=full`,
    projectsListUrl: `${baseUrl}/projects?view=full`,
    deploymentsListUrl: (deploymentId, count) => `${baseUrl}/deployments?query=projectUri+EQ+%2Frest%2Fprojects%2F${deploymentId}&view=full&count=30`,
    
    awsUtilizationUrl: (periodStarts) => `${baseUrl}/metrics?resourceUri=%2Frest%2Fprovider-types%2Faws&name=vm.status_checks&name=vm.status_down&name=vm.cpu.total&name=vm.cpu.usage&name=vm.volume.queue_length&period=day&periodStart=${periodStarts}&periodCount=30`,
    
    azureUtilizationUrl: (periodStarts) => `${baseUrl}/metrics?resourceUri=%2Frest%2Fprovider-types%2Fazure&name=vm.status_checks&name=vm.status_down&name=vm.cpu.total&name=vm.cpu.usage&name=vm.iops.current&name=vm.iops.peak&period=day&periodStart=${periodStarts}&periodCount=30`,
    
    pcUtilizationUrl: (periodStarts) => `${baseUrl}/metrics?resourceUri=%2Frest%2Fprovider-types%2Fncs&name=server.status_checks&name=server.status_down&name=server.cpu.total&name=server.cpu.usage&name=server.memory.total&name=server.memory.usage&name=storage.total&name=storage.available&name=server.network.in_packets&name=server.network.in_packet_errors&name=server.network.in_packet_drops&name=server.network.out_packets&name=server.network.out_packet_errors&name=server.network.out_packet_drops&period=day&periodStart=${periodStarts}&periodCount=30`
  }
};

export default createUrls;
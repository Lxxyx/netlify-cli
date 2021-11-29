const { pluginsList, pluginsUrl } = require('@netlify/plugins-list')
const fetch = require('node-fetch')

// 1 minute
const PLUGINS_LIST_TIMEOUT = 6e4

const getPluginsList = async () => {
  try {
    const response = await fetch(pluginsUrl, { timeout: PLUGINS_LIST_TIMEOUT })
    return await response.json()
  } catch {
    return pluginsList
  }
}

const getPluginInfo = (list, packageName) => list.find(({ package }) => package === packageName)

const isPluginInstalled = (configPlugins, plugin) =>
  configPlugins.some(({ package: configPlugin }) => configPlugin === plugin)

const getRecommendPlugins = (frameworkPlugins, config) =>
  frameworkPlugins.filter((plugin) => !isPluginInstalled(config.plugins, plugin))

const getPluginsToInstall = ({ installSinglePlugin, plugins, recommendedPlugins }) => {
  if (Array.isArray(plugins)) {
    return plugins.map((plugin) => ({ package: plugin }))
  }

  return installSinglePlugin === true ? [{ package: recommendedPlugins[0] }] : []
}

const getUIPlugins = (configPlugins) =>
  configPlugins.filter(({ origin }) => origin === 'ui').map(({ package }) => ({ package }))

module.exports = { getPluginsList, getPluginInfo, getRecommendPlugins, getPluginsToInstall, getUIPlugins }
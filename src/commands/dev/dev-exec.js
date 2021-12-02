const execa = require('execa')

const { generateDescriptionHelp, generateExamplesHelp, injectEnvVariables } = require('../../utils')

/**
 * The dev:exec command
 * @param {import('commander').OptionValues} options
 * @param {import('../base-command').BaseCommand} command
 */
const devExec = async (cmd, options, command) => {
  const { cachedConfig, site } = command.netlify
  await injectEnvVariables({ env: cachedConfig.env, site })

  await execa(cmd, command.args.slice(1), {
    stdio: 'inherit',
  })
}

/**
 * Creates the `netlify dev:exec` command
 * @param {import('../base-command').BaseCommand} program
 * @returns
 */
const createDevExecCommand = (program) =>
  program
    .command('dev:exec')
    .argument('<...cmd>')
    .description('Exec command')
    .allowExcessArguments(true)
    .addHelpText(
      'after',
      generateDescriptionHelp(
        'Runs a command within the netlify dev environment, e.g. with env variables from any installed addons',
      ),
    )
    .addHelpText('after', generateExamplesHelp(['netlify dev:exec npm run bootstrap']))
    .action(devExec)

module.exports = { createDevExecCommand }
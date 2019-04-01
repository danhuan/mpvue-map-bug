const chalk = require('chalk')
const msgPath = process.env.GIT_PARAMS
const msg = require('fs').readFileSync(msgPath, 'utf-8').trim()
/**
 *  feat：新功能（feature）
    fix：修补bug
    docs：文档（documentation）
    style： 格式（不影响代码运行的变动）
    refactor：重构（即不是新增功能，也不是修改bug的代码变动）
    test：增加测试
    chore：构建过程或辅助工具的变动
    types: commit 的类型
 */
const commitRE = /./

if (!commitRE.test(msg)) {
  console.log()
  console.error(
    `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(`invalid commit message format.`)}\n\n` +
    chalk.red(`  Proper commit message format is required for automated changelog generation. Examples:\n\n`) +
    `    ${chalk.green(`feat(compiler): add 'comments' option`)}\n` +
    `    ${chalk.green(`fix(v-model): handle events on blur (close #28)`)}\n\n` +
    chalk.red(`  See .github/COMMIT_CONVENTION.md for more details.\n`) +
    chalk.red(`  You can also use ${chalk.cyan(`npm run commit`)} to interactively generate a commit message.\n`)
  )
  process.exit(1)
}
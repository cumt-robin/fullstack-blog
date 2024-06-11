const options = {
    git: {
        // 具体参考源码 https://github.com/release-it/release-it/blob/master/lib/plugin/git/Git.js
        addUntrackedFiles: true,
        commitMessage: 'chore: release v${version}',
        tagMatch: "[0-9]*"
    },
    // 默认需要 GITHUB_TOKEN 环境变量，可以通过 tokenRef 定制
    github: {
        release: true,
    },
    npm: {
        // 不做 npm publish 操作
        publish: false,
    },
    plugins: {
        '@release-it/conventional-changelog': {
            preset: 'angular',
            infile: 'CHANGELOG.md',
        },
    },
    hooks: {
        'after:release': 'echo Successfully released ${name} v${version} to ${repo.repository}.',
    },
}

module.exports = options
const fetch = require('node-fetch')
const urljoin = require('url-join')
const { app } = require('electron')
const PARAMETERS = require('./parameters')

class GitHub {
    constructor(owner, repo) {
        this.rootUrl = 'https://api.github.com/repos'
        this.owner = owner || 'aleixcam'
        this.repo = repo || 'bolt'
        this.api = 'releases'
    }

    releases() {
        return fetch(urljoin(this.rootUrl, this.owner, this.repo, this.api), {
            method: 'GET'
        }).then(result => {
            return result.json()
        }).then(json => {
            if (Array.isArray(json)) return json
            throw Error(json.message)
        }).then(releases => {
            if (releases.length > 0) return releases
            throw Error('No releases found')
        }).catch(error => {
            console.error(error)
        })
    }

    latestRelease() {
        const beta = PARAMETERS.getByName('betaVersions').value
        return this.releases()
            .then(releases => releases.find(release => (beta ? true : !release.prerelease) && !release.draft))
    }

    checkVersion(callback) {
        return this.latestRelease()
            .then(release => app.getVersion() === release.name ? false : release.tag_name)
    }
}

module.exports = GitHub

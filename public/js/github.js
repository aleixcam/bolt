const path = require('path');

class GitHub {
    constructor() {
        this.rootUrl = 'https://api.github.com/repos'
        this.owner = 'aleixcam'
        this.repo = 'bolt'
        this.api = 'releases'
    }

    releases() {
        return fetch(path.join(this.rootUrl, this.owner, this.repo, this.api), {
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

    getDownloadLink(release, platform) {
        let name
        switch (platform) {
            case 'linux':
                name = `bolt-${release.name}-x86_64.AppImage`
                break
            case 'win32':
                name = `bolt-setup-${release.name}.exe`
                break
            case 'darwin':
            default:
                name = `Bolt-${release.name}-mac.zip`
                break
        }

        const asset = release.assets.find(asset => asset.name === name)
        return asset.browser_download_url
    }

    latestRelease(platform, callback) {
        return this.releases()
            .then(releases => {
                const release = releases.find(release => !release.prerelease && !release.draft)
                const link = this.getDownloadLink(release, platform)
                return callback(link, release.tag_name)
            })
    }
}

module.exports = GitHub

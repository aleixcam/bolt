class GitHub {
    static releases() {
        return fetch('https://api.github.com/repos/aleixcam/bolt/releases', {
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

    static latestRelease(platform, callback) {
        return this.releases()
            .then(releases => releases.find(release => !release.prerelease && !release.draft))
            .then(release => this.getDownloadLink(release, platform))
            .then(link => callback(link))
    }

    static latestPreRelease(platform, callback) {
        return this.releases()
            .then(releases => releases.find(release => release.prerelease && !release.draft))
            .then(release => this.getDownloadLink(release, platform))
            .then(link => callback(link))
    }

    static getDownloadLink(release, platform) {
        let name
        switch (platform) {
            case 'linux':
                name = `Bolt-${release.name}-mac.zip`
                break
            case 'win32':
                name = `bolt-setup-${release.name}.exe`
                break
            case 'darwin':
            default:
                name = `bolt-${release.name}-x86_64.AppImage`
                break
        }

        const asset = release.assets.find(asset => asset.name === name)
        return asset.browser_download_url
    }
}

// To be compatible with landing
try { module.exports = GitHub } catch (e) {}

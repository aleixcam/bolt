class GitHub {
    static releases() {
        return fetch('https://api.github.com/repos/aleixcam/bolt/releases', {
            method: 'GET'
        }).then(result => {
            return result.json()
        }).then(json => {
            if (Array.isArray(json)) return json
            throw Error(json.message)
        }).catch(error => {
            console.error(error)
        })
    }

    static latestRelease() {
        return this.releases().then(releases => releases[0])
    }

    static latestPreRelease() {
        return this.releases().then(releases => releases[0])
    }
}

// To be compatible with landing
try { module.exports = GitHub } catch (e) {}

GitHub.latestRelease(getPlatform(), link => {
    console.log(link);
})

GitHub.latestPreRelease(getPlatform(), link => {
    console.log(link);
})

function getPlatform() {
    let platform
    if (window.navigator.userAgent.indexOf('Mac') != -1) platform = 'darwin'
    if (window.navigator.userAgent.indexOf('Windows') != -1) platform = 'win32'
    if (window.navigator.userAgent.indexOf('Linux') != -1) platform = 'linux'
    return platform
}

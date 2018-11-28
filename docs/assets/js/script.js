const download = document.getElementById('download')
const platform = getPlatform()

GitHub.latestRelease(platform, (link, version) => {
    const downloadButton = document.createElement('a')
    downloadButton.href = link
    downloadButton.className = 'header__button'
    download.appendChild(downloadButton)

    const buttonText = document.createElement('small')
    buttonText.className = 'header__button--text'
    switch (platform) {
        case 'linux':
            buttonText.innerText = 'Download for Linux'
            break
        case 'win32':
            buttonText.innerText = 'Download for Windows'
            break
        case 'darwin':
        default:
            buttonText.innerText = 'Download for Mac'
            break
    }
    downloadButton.appendChild(buttonText)

    const versionTag = document.createElement('small')
    versionTag.className = 'header__button--small'
    versionTag.innerText = version
    downloadButton.appendChild(versionTag)

    const downloadLinks = document.createElement('div')
    downloadLinks.className = 'header-download-links'
    download.appendChild(downloadLinks)

    const sourceLink = document.createElement('a')
    sourceLink.href = `https://github.com/aleixcam/bolt/archive/${version}.zip`
    sourceLink.className = 'header__link'
    sourceLink.innerText = 'Source Code'
    downloadLinks.appendChild(sourceLink)

    const othersLink = document.createElement('a')
    othersLink.href = `https://github.com/aleixcam/bolt/releases/tag/${version}`
    othersLink.className = 'header__link'
    othersLink.innerText = 'Other Downloads'
    downloadLinks.appendChild(othersLink)
})

function getPlatform() {
    let platform
    if (window.navigator.userAgent.indexOf('Mac') != -1) platform = 'darwin'
    if (window.navigator.userAgent.indexOf('Windows') != -1) platform = 'win32'
    if (window.navigator.userAgent.indexOf('Linux') != -1) platform = 'linux'
    return platform
}

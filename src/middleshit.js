function Middleware(Component) {
    try {
        // Import template to render
        const Template = require(`./template/${Component.name}`)

        // Render template
        Component.prototype.render = function() {
            return Template.default.apply(this)
        }
    } catch (e) {
        throw Error(`Cannot find template for Component ${Component.name}`);
    }

    // Return renderized component
    return Component
}

export default Middleware;

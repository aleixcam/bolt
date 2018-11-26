import Selection from '../vendor/selection-js'

export default function createSelection() {
    return Selection.create({
        selectables: ['.selectable'],
        boundaries: ['.main'],

        onSelect(evt) {
            if (!evt.originalEvent.ctrlKey && !evt.originalEvent.metaKey) {
                evt.selectedElements.forEach(s => s.classList.remove('selected'));
                this.clearSelection();
            }

            evt.target.classList.add('selected');
            this.keepSelection();
        },

        onStart(evt) {
            const selectedElements = evt.selectedElements;
            if (!evt.originalEvent.ctrlKey && !evt.originalEvent.metaKey) {
                selectedElements.forEach(s => s.classList.remove('selected'));
                this.clearSelection();
            }
        },

        onMove(evt) {
            const selectedElements = evt.selectedElements;
            const removedElements = evt.changedElements.removed;
            selectedElements.forEach(s => s.classList.add('selected'));
            removedElements.forEach(s => s.classList.remove('selected'));
        },

        onStop() {
            this.keepSelection();
        }
    })
}

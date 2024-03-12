import { Marker3DAnimation } from './scripts/3dMarker.js'
import { animationManager } from './scripts/animationManager.js'

window.onload = (event) => {
    let markerCanvas = document.querySelector('#canvas2')
    let marker = new Marker3DAnimation(markerCanvas)

    animationManager.manage(marker, [animationManager.onLoad], markerCanvas)
    animationManager.startManaging()

    console.log("Application loaded")
}
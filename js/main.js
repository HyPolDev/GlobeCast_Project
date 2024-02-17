console.log("THREE INIT FINE ON MAIN.JS...")
let targetRotationX = 0.05;
let targetRotationY = 0.02;
let mouseX = 0, mouseXOnMouseDown = 0, mouseY = 0, mouseYOnMouseDown = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;
const slowingFactor = 0.90;
const dragFactor = 0.0002;

function onDocumentMouseDown(event) {
    event.preventDefault();
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    mouseXOnMouseDown = event.clientX - windowHalfX;
    mouseYOnMouseDown = event.clientY - windowHalfY;
}

function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    targetRotationX = (mouseX - mouseXOnMouseDown) * dragFactor;
    mouseY = event.clientY - windowHalfY;
    targetRotationY = (mouseY - mouseYOnMouseDown) * dragFactor;
}

function onDocumentMouseUp(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
}

const main = () => {
    //THREE JS ALWAYS NEEDS A CAMERA, A LIGHT SOURCE AND A CANVAS TO DISPLAY THE MODEL ON

    const scene = new THREE.Scene()      // the renderer IS the <canvas>
    const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#globe") })
    renderer.setSize(window.innerWidth, window.innerHeight)

    //CREATE SPHERE MODEL     we using default values for now 
    const earthGeometry = new THREE.SphereGeometry(0.5, 32, 32)
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load("../img/earthTexture.jpg"),
        bumpMap: new THREE.TextureLoader().load("../img/elevationBump.jpg"),
        bumpScale: 0.02,
    })

    // joins a geometry with a material 
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial)

    scene.add(earthMesh)

    // DEFINE LIGHT AND IMPLEMENT LIGHT SOURCES
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
    scene.add(ambientLight)

    const lightSource = new THREE.PointLight(0xffffff, 0.9)
    lightSource.position.set(10, 3, 5)
    scene.add(lightSource)

    //TAKES VALUES => FOV, ASPECT RATIO, POSITION
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
    //  camera.position.x = 2
    // camera.position.y = 2
    camera.position.z = 2

    //FOR EACH ANIMATION FRAME RENDERS ->
    const render = () => {                                          // multiply to ajust movement on zoom
        earthMesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), targetRotationX * (camera.position.z / 3))
        earthMesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), targetRotationY * (camera.position.z / 3))
        targetRotationY *= slowingFactor
        targetRotationX *= slowingFactor
        renderer.render(scene, camera)
    }

    const animate = () => {
        requestAnimationFrame(animate)
        render();
    }

    animate()
    document.addEventListener("mousedown", onDocumentMouseDown, false)

    // EarthDirection will be and obj and XYZ array required for function
    let EarthDirection
    let EarthXYZ

    //gets coordinates on click
    document.addEventListener("click", () => {
        //updates Earth direction 
        EarthDirection = earthMesh.getWorldDirection(new THREE.Vector3())
        EarthXYZ = [
            EarthDirection.x,
            EarthDirection.y,
            EarthDirection.z
        ]
    })

    //ZOOM
    document.addEventListener("wheel", (e) => {
        let delta = Math.sign(e.deltaY)
        if (delta > 0 && camera.position.z < 3) {
            //camera.position.z = camera.position.z + 0.1
            camera.translateZ(0.1)
        }
        else if (delta < 0 && camera.position.z > 0.7) {
            camera.position.z = camera.position.z - 0.1
        }
    })
}

window.onload = main
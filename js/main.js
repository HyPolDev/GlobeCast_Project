console.log("THREE INIT FINE ON MAIN.JS...")
let targetRotationX = 0.05
let targetRotationY = 0.02
let mouseX, mouseXOnMouseDown, mouseY, mouseYOnMouseDown = 0 //lol
const windowHalfX = window.innerWidth / 2
const windowHalfY = window.innerHeight / 2
const dragFactor = 0.0002

const onDocumentMouseMove = (event) => {
    mouseX = event.clientX - windowHalfX
    mouseY = event.clientY - windowHalfY
    targetRotationX = (mouseX - mouseXOnMouseDown) * dragFactor
    targetRotationY = (mouseY - mouseYOnMouseDown) * dragFactor
}

const onDocumentMouseDown = (event) => {
    event.preventDefault()
    document.addEventListener("mousemove", onDocumentMouseMove, false);
    mouseXOnMouseDown = event.clientX - windowHalfX
    mouseYOnMouseDown = event.clientY - windowHalfY
}

const main = () => {
    //THREE JS ALWAYS NEEDS A CAMERA, A LIGHT SOURCE AND A CANVAS TO DISPLAY THE MODEL ON

    const scene = new THREE.Scene()      // the renderer IS the <canvas>
    const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#globe") })
    renderer.setSize(window.innerWidth, window.innerHeight)

    //CREATE SPHERE MODEL     we using default values for now 
    const earthGeometry = new THREE.SphereGeometry(0.5, 32, 32)
    const earthMaterial = new THREE.MeshPhongMaterial({
        //wireframe: true,
        //textura de malla de momento
        // well set a propper texture here later
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

    //thats self explanatory...
    const render = () => {
        earthMesh.rotateOnAxis(new THREE.Vector3(0, 0.5, 0.08), 0.001)
        renderer.render(scene, camera)
    }

    const animate = () => {
        requestAnimationFrame(animate)
        render();
    }

    animate()
    document.addEventListener("mousedown", onDocumentMouseDown, false)
}

window.onload = main
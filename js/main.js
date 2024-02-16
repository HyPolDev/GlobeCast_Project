console.log("THREE INIT FINE ON MAIN.JS...")

const main = () => {
  //THREE JS ALWAYS NEEDS A CAMERA, A LIGHT SOURCE AND A CANVAS TO DISPLAY THE MODEL ON

  const scene = new THREE.Scene() // the renderer IS the <canvas>
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#globe"),
  })
  renderer.setSize(window.innerWidth, window.innerHeight)

  //CREATE SPHERE MODEL     we using default values for now
  const earthGeometry = new THREE.SphereGeometry(0.5, 32, 32)
  const earthMaterial = new THREE.MeshPhongMaterial({
    wireframe: true,
    //textura de malla de momento
    // well set a propper texture here later
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

  //TAKES VALUES => FOV, ASPECT RATIO, CLIPPING PLANES, POSITION
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
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
    render()
  }

  animate()
}

window.onload = main
let respuesta
let location
async function getWeather(value) {
  const response = await fetch(
    ` https://api.weatherapi.com/v1/current.json?key=5b40e69a24c3418b93b142938241602&q=${value}&aqi=yes`
  )
  const data = await response.json()
  console.log(data)
  respuesta = data
  return response
}
getWeather()

const updateLocation = (e) => {
  let value = e.target.value
  console.log(value)
  getWeather(value)
  const infoWeather = document.getElementById("infoWeather")
  console.log(infoWeather)
  if (value) {
    infoWeather.innerHTML = [
      respuesta.location.name,
      `Temp: ${respuesta.current.temp_c}°`,
      `${respuesta.location.region} `,
      `Lat: ${respuesta.location.lat}° `,
      `Long: ${respuesta.location.lon}°`,
    ]
    //Timer out Channel List
    setTimeout(() => {
      infoWeather.innerHTML = ""
    }, 10000)
  }
}

let input = document.addEventListener("input", updateLocation)

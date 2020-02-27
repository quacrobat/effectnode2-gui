const Nodes = {
  ...require('three/examples/jsm/nodes/Nodes.js')
}

export const makeNodeByWin = ({ win }) => {
  const inst = new Nodes[win.NodeClass](...(win.args || []))
  return inst
}

export const makeMat = async ({ wins, connections }) => {
  const nodes = {}

  // instantiate
  wins.filter(e => e.isMaterialNode || e.isNode).forEach((win) => {
    nodes[win._id] = makeNodeByWin({ win })
  })

  // initialization
  const initVals = () => {
    wins.filter(e => e.NodeClass === 'ColorNode').forEach((win) => {
      if (nodes[win._id]) {
        nodes[win._id].value.setStyle(win.color)
      }
    })
    wins.filter(e => e.NodeClass === 'FloatNode').forEach((win) => {
      if (nodes[win._id]) {
        nodes[win._id].value = Number(win.value)
      }
    })
  }
  initVals()

  window.addEventListener('pulse', () => {
    initVals()
  })

  // Link Nodes
  connections.forEach((cnn) => {
    const outputNode = nodes[cnn.output.boxID]
    const inputNode = nodes[cnn.input.boxID]
    inputNode[cnn.input.label] = outputNode
  })

  console.log(wins, connections)

  const root = wins.find(e => e.isMaterialNode)
  if (root) {
    const rootMat = nodes[root._id]
    rootMat.needsUpdate = true
    return rootMat
  }
}

// export const StandardNodeMaterial = () => {
//   const mtl = new Nodes.StandardNodeMaterial()
//   // mtl.color = // albedo (vec3)
//   // mtl.alpha = // opacity (float)
//   // mtl.roughness = // roughness (float)
//   // mtl.metalness = // metalness (float)
//   // mtl.normal = // normal (vec3)
//   // mtl.emissive = // emissive color (vec3)
//   // mtl.ambient = // ambient color (vec3)
//   // mtl.shadow = // shadowmap (vec3)
//   // mtl.light = // custom-light (vec3)
//   // mtl.ao = // ambient occlusion (float)
//   // mtl.environment = // reflection/refraction (vec3)
//   // mtl.position = // vertex local position (vec3)

//   return mtl
// }
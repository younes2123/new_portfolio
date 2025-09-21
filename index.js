// Canvas animation showing evolution from simple to complex
document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('system-canvas')
  const ctx = canvas.getContext('2d')

  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  // Node class for the system visualization
  class Node {
    constructor(x, y, radius, isCore = false) {
      this.x = x
      this.y = y
      this.radius = radius
      this.isCore = isCore
      this.connections = []
      this.pulse = 0
    }

    draw() {
      // Draw connections first
      for (const connection of this.connections) {
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(connection.x, connection.y)
        ctx.strokeStyle = 'rgba(79, 70, 229, 0.2)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw node
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)

      if (this.isCore) {
        // Core node (simple system)
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.radius
        )
        gradient.addColorStop(0, 'rgba(79, 70, 229, 1)')
        gradient.addColorStop(1, 'rgba(79, 70, 229, 0.6)')
        ctx.fillStyle = gradient
      } else {
        // Evolved node (complex system)
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.radius
        )
        gradient.addColorStop(0, 'rgba(124, 58, 237, 1)')
        gradient.addColorStop(1, 'rgba(124, 58, 237, 0.6)')
        ctx.fillStyle = gradient

        // Add pulse effect for complex nodes
        if (this.pulse > 0) {
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.radius + this.pulse, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(124, 58, 237, 0.1)'
          ctx.fill()
          this.pulse -= 0.2
        }
      }

      ctx.fill()
    }

    addPulse() {
      this.pulse = 5
    }
  }

  // Create initial simple system (core nodes)
  const coreNodes = []
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2

  // Create central core node
  const coreNode = new Node(centerX, centerY, 8, true)
  coreNodes.push(coreNode)

  // Create a few initial simple nodes around the core
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2
    const distance = 100
    const x = centerX + Math.cos(angle) * distance
    const y = centerY + Math.sin(angle) * distance

    const node = new Node(x, y, 5, true)
    node.connections.push(coreNode)
    coreNode.connections.push(node)
    coreNodes.push(node)
  }

  // Complex nodes that will emerge over time
  const complexNodes = []

  // Animation loop
  function animate() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw all nodes
    for (const node of [...coreNodes, ...complexNodes]) {
      node.draw()
    }

    // Occasionally add new complex nodes
    if (Math.random() < 0.02 && complexNodes.length < 50) {
      // Connect to a random existing node
      const allNodes = [...coreNodes, ...complexNodes]
      const sourceNode = allNodes[Math.floor(Math.random() * allNodes.length)]

      // Create new node at a distance
      const angle = Math.random() * Math.PI * 2
      const distance = 50 + Math.random() * 50
      const x = sourceNode.x + Math.cos(angle) * distance
      const y = sourceNode.y + Math.sin(angle) * distance

      // Ensure it stays within canvas bounds
      const boundedX = Math.max(20, Math.min(canvas.width - 20, x))
      const boundedY = Math.max(20, Math.min(canvas.height - 20, y))

      const newNode = new Node(boundedX, boundedY, 4)
      newNode.connections.push(sourceNode)
      sourceNode.connections.push(newNode)

      // Occasionally connect to additional nodes for complexity
      if (Math.random() < 0.3 && allNodes.length > 2) {
        let additionalNode
        do {
          additionalNode = allNodes[Math.floor(Math.random() * allNodes.length)]
        } while (additionalNode === sourceNode)

        newNode.connections.push(additionalNode)
        additionalNode.connections.push(newNode)
      }

      complexNodes.push(newNode)
      newNode.addPulse()
    }

    // Occasionally add new connections between existing nodes to show complexity growth
    if (Math.random() < 0.01 && complexNodes.length > 5) {
      const node1 =
        complexNodes[Math.floor(Math.random() * complexNodes.length)]
      let node2
      do {
        node2 = complexNodes[Math.floor(Math.random() * complexNodes.length)]
      } while (node1 === node2 || node1.connections.includes(node2))

      node1.connections.push(node2)
      node2.connections.push(node1)
      node1.addPulse()
      node2.addPulse()
    }

    requestAnimationFrame(animate)
  }

  animate()
})

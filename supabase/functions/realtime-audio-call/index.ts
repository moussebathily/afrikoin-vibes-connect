import "https://deno.land/x/xhr@0.1.0/mod.ts"

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

Deno.serve(async (req) => {
  // Handle WebSocket upgrade
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response("Expected WebSocket", { status: 400 })
  }

  const { socket, response } = Deno.upgradeWebSocket(req)
  let openaiWs: WebSocket | null = null

  socket.onopen = async () => {
    console.log("Client connected")
    
    try {
      // Connect to OpenAI Realtime API
      openaiWs = new WebSocket(
        "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01",
        {
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "OpenAI-Beta": "realtime=v1"
          }
        }
      )

      openaiWs.onopen = () => {
        console.log("Connected to OpenAI")
      }

      openaiWs.onmessage = (event) => {
        // Forward OpenAI messages to client
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(event.data)
        }
      }

      openaiWs.onerror = (error) => {
        console.error("OpenAI WebSocket error:", error)
        socket.send(JSON.stringify({
          type: 'error',
          error: 'OpenAI connection error'
        }))
      }

      openaiWs.onclose = () => {
        console.log("OpenAI connection closed")
        if (socket.readyState === WebSocket.OPEN) {
          socket.close()
        }
      }
    } catch (error) {
      console.error("Error connecting to OpenAI:", error)
      socket.send(JSON.stringify({
        type: 'error',
        error: 'Failed to connect to OpenAI'
      }))
    }
  }

  socket.onmessage = (event) => {
    // Forward client messages to OpenAI
    if (openaiWs && openaiWs.readyState === WebSocket.OPEN) {
      openaiWs.send(event.data)
    }
  }

  socket.onclose = () => {
    console.log("Client disconnected")
    if (openaiWs && openaiWs.readyState === WebSocket.OPEN) {
      openaiWs.close()
    }
  }

  socket.onerror = (error) => {
    console.error("Client WebSocket error:", error)
  }

  return response
})

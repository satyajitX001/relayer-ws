import { test, describe, expect } from 'bun:test'

const BACKEND_URL = 'ws://localhost:8080'

describe('Chat Application', () => {
    test("Message send from room1 reached to another in room1", async () => {
        const ws1 = new WebSocket(BACKEND_URL)
        const ws2 = new WebSocket(BACKEND_URL)
        //wait for user to join
        await new Promise<void>((resolve, reject) => {
            let ws1Ready = false
            let ws2Ready = false
            
            const checkBothReady = () => {
                if (ws1Ready && ws2Ready) {
                    resolve()
                }
            }
            
            ws1.onopen = () => { 
                ws1Ready = true
                checkBothReady()
            }
            ws2.onopen = () => { 
                ws2Ready = true
                checkBothReady()
            }
        })

        //room joined
        ws1.send(JSON.stringify({ type: 'join-room', room: 'room1' }))
        ws2.send(JSON.stringify({ type: 'join-room', room: 'room1' }))

        //send message
        await new Promise<void>((resolve, reject) => {
            ws2.onmessage = (event) => {
                const parsedData = JSON.parse(event.data)
                expect(parsedData.type).toBe('chat')
                expect(parsedData.message).toBe('Hello from user 1')
                resolve()
            }
            ws1.send(JSON.stringify({ type: 'chat', room: 'room1', message: 'Hello from user 1' }))
        })
        // await new Promise<void>((resolve, reject) => {
        //     ws2.onmessage = (event) => {
        //         const data = JSON.parse(event.data)
        //         if (data.type === 'chat' && data.message === 'Hello from user 1') {
        //             resolve()
        //         }
        //     }
        // })
    })
})
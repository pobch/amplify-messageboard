import React, { useState, useEffect } from 'react'
import { Input, Button } from 'antd'
import { SketchPicker } from 'react-color'
import { DataStore } from '@aws-amplify/datastore'
import { Message } from './models'

const initState = { color: '#000000', title: '' }

function App() {
  const [formState, setFormState] = useState(initState)
  const [showPicker, setShowPicker] = useState(false)
  const [messages, setMessages] = useState([])
  useEffect(() => {
    fetchMessages()
    const subscription = DataStore.observe(Message).subscribe(() => {
      fetchMessages()
    })
    return () => subscription.unsubscribe()
  }, [])
  async function fetchMessages() {
    const messages = await DataStore.query(Message)
    setMessages(messages)
  }
  function onChange(e) {
    if (e.hex) {
      setFormState({ ...formState, color: e.hex })
    } else {
      setFormState({ ...formState, [e.target.name]: e.target.value })
    }
  }
  async function createMessage() {
    if (!formState.title) return
    await DataStore.save(new Message({ ...formState }))
    setFormState(initState)
  }

  return (
    <div style={container}>
      <h1 style={heading}>Real Time Message Board</h1>
      <Input
        onChange={onChange}
        value={formState.title}
        name="title"
        placeholder="Message title"
        style={input}
      />
      <div>
        <Button onClick={() => setShowPicker(!showPicker)} style={button}>
          Toggle Color Picker
        </Button>
        <p>
          Color:{' '}
          <span style={{ fontWeight: 'bold', color: formState.color }}>{formState.color}</span>
        </p>
      </div>
      {showPicker && <SketchPicker color={formState.color} onChange={onChange} />}
      <Button type="primary" onClick={createMessage}>
        Create Message
      </Button>
      {messages.map((message) => {
        return (
          <div key={message.id} style={{ ...messageStyle, backgroundColor: message.color }}>
            <div style={{ backgroundColor: 'white ' }}>
              <p style={messageTitle}>{message.title}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

const container = {
  width: '100%',
  maxWidth: 900,
  padding: 40,
}
const heading = {
  fontWeight: 'normal',
  fontSize: 40,
}
const input = {
  marginBottom: 10,
}
const button = {
  marginBottom: 10,
}
const messageStyle = {
  padding: '20px',
  marginTop: 7,
  borderRadius: 4,
}
const messageTitle = {
  margin: 0,
  padding: 9,
  fontSize: 20,
}

export default App

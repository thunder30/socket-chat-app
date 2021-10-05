var socket = io()
function handleName() {
    let name = prompt('Vui lòng nhập tên!').trim()
    socket.emit('set-user', { name, message: '' })
    return name
}

function receiveMessage() {
    socket.on('chat-message', (data) => {
        appendMessage(data)
    })
}

function sendMessage() {
    if (!input.val()) {
        alert('Vui lòng nhập tin nhắn...')
        return
    }
    const data = {
        name,
        message: input.val(),
    }
    appendMessage(data)
    socket.emit('chat-message', data)
    input.val('')
}

function handleTime() {
    function addZero(i) {
        if (i < 10) {
            i = '0' + i
        }
        return i
    }

    const d = new Date()
    const h = addZero(d.getHours())
    const m = addZero(d.getMinutes())
    const s = addZero(d.getSeconds())
    return h + ':' + m
}

function appendMessage(data) {
    const messages = $('#messages')
    const time = handleTime()
    const info = `<span style="font-weight: 500">${data.name}</span>`
    const html = `
    ${info}
    <code>${time}</code>
    <span>
        <br>${data.message}
    </span>
    `
    const li = $('<li></li>').html(html)

    messages.append(li)
    // scrool to bottom
    messages.scrollTop(messages.prop('scrollHeight'))
}

var input = $('input')
var button = $('button')

input.keypress((e) => {
    if (e.keyCode === 13) sendMessage()
})

button.click(sendMessage)

receiveMessage()
var name = handleName()

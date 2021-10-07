//import toast from './toast.js'
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

function onMemberJoin() {
    socket.on('member-join', (data) => {
        const title = 'Thông báo!'
        const time = handleTime()
        const delay = 3000
        const animation = true
        const autohide = true
        const div = $(`
            <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-autohide="${autohide}"
                data-animation="${animation}" data-delay="${delay}">
            </div>`).html(`
                <div class="toast-header">
                    <strong class="mr-auto text-primary">${title}</strong>
                    <small class="text-muted">${time}</small>
                    <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="toast-body">
                <span style="font-weight: 500;">${data.name}</span>  ${
            data.join ? 'vừa tham gia!' : 'vừa rời đi!'
        } 
                </div>
            `)
        div.toast('show')
        $('.container-toast').append(div)
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

var name = handleName()
onMemberJoin()

input.keypress((e) => {
    if (e.keyCode === 13) sendMessage()
})

button.click(sendMessage)

receiveMessage()

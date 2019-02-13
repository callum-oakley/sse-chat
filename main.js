const { h, app } = window.hyperapp

// random user name -----------------------------------------------------------

const choose = a => a[Math.floor(Math.random() * a.length)]

const colours = JSON.parse(
  '["white","silver","gray","black","red","maroon","yellow","olive","lime","green","aqua","teal","blue","navy","fuchsia","purple"]',
)

const animals = JSON.parse(
  '["pupper","kittycat","snek","fishy","bear","racoon","moose","croc","monkey","giraffe","penguin","hippo","birb","squirrel","fox","dragon"]',
)

const userName = `${choose(colours)} ${choose(animals)}`

// pubsub ---------------------------------------------------------------------

const pubsubHost = "http://localhost:5000/"

const subscribe = hook => {
  new EventSource(pubsubHost).onmessage = e => hook(JSON.parse(e.data))
}

const publish = m =>
  fetch(pubsubHost, { method: "POST", body: JSON.stringify(m) })

// state

const state = {
  messages: [],
}

// actions --------------------------------------------------------------------

const actions = {
  receive: m => state => ({ messages: [m, ...state.messages] }),
}

// view -----------------------------------------------------------------------

const message = ({ from, content }) =>
  h("li", {}, [h("div", { class: "from" }, from), h("div", {}, content)])

const messages = ms => h("ul", { class: "messages" }, ms.map(m => message(m)))

const messageInputForm = () =>
  h(
    "form",
    {
      onsubmit: e => {
        e.preventDefault()
        const messageInput = document.getElementById("message-input")
        const content = messageInput.value
        messageInput.value = ""
        publish({ from: userName, content })
      },
    },
    h(
      "input",
      {
        id: "message-input",
        placeholder: "type a message...",
        autofocus: true,
      },
      "",
    ),
  )

const view = (state, actions) =>
  h(
    "div",
    {
      class: "main",
      oncreate: () => subscribe(actions.receive),
    },
    messages(state.messages),
    messageInputForm(),
  )

// hyperapp -------------------------------------------------------------------

app(state, actions, view, document.body)

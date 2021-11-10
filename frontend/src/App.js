import { ChatFeed, ChatBubble, BubbleGroup, Message } from "react-chat-ui";
import { useState } from "react";
import React from "react";
import ReactDOM from "react-dom";
import "./App.css";

// var SCOPES = ["https://mail.google.com/", "https://www.googleapis.com/auth/gmail.modify", "https://www.googleapis.com/auth/gmail.compose", "https://www.googleapis.com/auth/gmail.send"];

// const CLIENT_ID = "1062907572284-cnd6a7u8emkq1orlhedq85hj1sa999j1.apps.googleusercontent.com";
// const CLIENT_SECRET = "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";

// function makeBody(to, from, subject, message) {
//   var str = ['Content-Type: text/plain; charset="UTF-8"\n', "MIME-Version: 1.0\n", "Content-Transfer-Encoding: 7bit\n", "to: ", to, "\n", "from: ", from, "\n", "subject: ", subject, "\n\n", message].join("");

//   var encodedMail = new Buffer(str).toString("base64").replace(/\+/g, "-").replace(/\//g, "_");
//   return encodedMail;
// }

// function sendMessage(auth) {
//   var raw = makeBody("ariqathallah38@gmail.com", "kindboard.digithon@gmail.com", "test subject", "test message");
//   gmail.users.messages.send(
//     {
//       auth: auth,
//       userId: "me",
//       resource: {
//         raw: raw,
//       },
//     },
//     function (err, response) {
//       res.send(err || response);
//     }
//   );
// }

const styles = {
  button: {
    backgroundColor: "#fff",
    borderColor: "#1D2129",
    borderStyle: "solid",
    borderRadius: 20,
    borderWidth: 2,
    color: "#1D2129",
    fontSize: 18,
    fontWeight: "300",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  selected: {
    color: "#fff",
    backgroundColor: "#0084FF",
    borderColor: "#0084FF",
  },
};

const users = {
  0: "You",
  Mark: "Mark",
  2: "Evan",
};

const customBubble = (props) => (
  <div>
    <p>{`${props.message.senderName} ${props.message.id ? "says" : "said"}: ${props.message.message}`}</p>
  </div>
);

function App() {
  const [messages, setMessages] = useState([
    new Message({ id: "Mark", message: "Hey guys!", senderName: "Mark" }),
    new Message({
      id: 2,
      message: "Hey! Evan here. react-chat-ui is pretty dooope.",
      senderName: "Evan",
    }),
  ]);

  const [useCustomBubble, setUseCustomBubble] = useState(false);
  const [curr_user, setCurr_user] = useState(0);
  const [message, setMessage] = useState("");

  function onPress(user) {
    setCurr_user(user);
  }

  function onMessageSubmit(e) {
    const input = message;
    e.preventDefault();
    if (!input.value) {
      return false;
    }
    pushMessage(curr_user, input.value);
    input.value = "";
    return true;
  }

  async function pushMessage(recipient, message) {
    console.log(message);
    let obj = { sentence: message };
    console.log(obj);
    let response = await fetch("http://localhost:8080/query", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });

    response = await response.json();
    console.log(response);

    const newMessage = new Message({
      id: recipient,
      message,
      senderName: users[recipient],
    });

    if (response === true) {
      newMessage.message = "Pesan anda tidak terkirim karena terdeteksi sistem sebagai kalimat buruk";
    }

    let listMessages = [...messages, newMessage];
    setMessages(listMessages);
  }
  return (
    <div className="container">
      <h1 className="text-center">SRG</h1>
      <div className="chatfeed-wrapper">
        <ChatFeed
          chatBubble={useCustomBubble && customBubble}
          maxHeight={250}
          messages={messages} // Boolean: list of message objects
          showSenderName
        />

        <form onSubmit={(e) => onMessageSubmit(e)}>
          <input
            ref={(m) => {
              setMessage(m);
            }}
            placeholder="Type a message..."
            className="message-input"
          />
        </form>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}></div>
      </div>
    </div>
  );
}

export default App;

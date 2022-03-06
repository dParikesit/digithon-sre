import {
  ChatFeed,
  ChatBubble,
  BubbleGroup,
  Message
} from "react-chat-ui";
import {
  useState
} from "react";
import React from "react";
import "./App.css";

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

const customBubble = (props) => ( <
  div >
  <
  p > {
    `${props.message.senderName} ${props.message.id ? "says" : "said"}: ${props.message.message}`
  } < /p> <
  /div>
);

function App() {
  const [messages, setMessages] = useState([
    new Message({
      id: 1,
      message: "Halo guys, PR Mat nomor 5 jawabannya apa ya?",
      senderName: "Dimas"
    }),
    new Message({
      id: 2,
      message: "Wah, aku juga belum tuh",
      senderName: "Kristo",
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
    let obj = {
      sentence: message
    };
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
      let isApproved = window.confirm(`Kalimat yang kamu tulis mengandung unsur toksik. Apakah kamu yakin akan mengirim kalimat "${message}"?`);
      if (isApproved) {
        let listMessages = [...messages, newMessage];
        setMessages(listMessages);
      }
      // newMessage.message = "Pesan anda tidak terkirim karena terdeteksi sistem sebagai kalimat buruk";
    } else {
      let listMessages = [...messages, newMessage];
      setMessages(listMessages);
    }
  }
  return ( <
    div className = "container" >
    <
    h1 className = "text-center" > kindboard < /h1> <
    div className = "chatfeed-wrapper" >
    <
    ChatFeed chatBubble = {
      useCustomBubble && customBubble
    }
    maxHeight = {
      250
    }
    messages = {
      messages
    } // Boolean: list of message objects
    showSenderName /
    >

    <
    form onSubmit = {
      (e) => onMessageSubmit(e)
    } >
    <
    input ref = {
      (m) => {
        setMessage(m);
      }
    }
    placeholder = "Type a message..."
    className = "message-input" /
    >
    <
    /form> <
    div style = {
      {
        display: "flex",
        justifyContent: "center",
        marginTop: 10
      }
    } > < /div> <
    /div> <
    /div>
  );
}

export default App;
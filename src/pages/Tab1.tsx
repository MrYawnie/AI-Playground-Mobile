import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Tab1.css";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { server } from "../constant";
import { auth } from "../firebase";
import { logOutOutline, refreshOutline } from "ionicons/icons";
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("user is signed in with email: " + user.email + " and username: " + user.displayName);
  } else {
    console.log("user is not signed in");
  }
});

const logout = () => {
  auth.signOut();
};

const refreshPage = () => {
  window.location.reload();
};

type MessageProps = {
  role: string;
  content: string;
};

/* const Message = ({ role, content }: MessageProps) => {
  const isBot = role === "assistant";
  return (
    <IonItem color={isBot ? "dark" : "light"}>
      <IonLabel style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </IonLabel>
    </IonItem>
  );
}; */

const Message = ({ role, content }: MessageProps) => {
  const isBot = role === "assistant";
  const cardClass = isBot ? "bot-message" : "user-message";
  return (
    <IonCard className={cardClass} color={isBot ? "success" : "primary"}>
      <IonCardContent style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </IonCardContent>
    </IonCard>
  );
};

const Tab1: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello!" },
    { role: "assistant", content: "How can I help you today?" },
  ]);
  const inputRef = useRef(null);
  const [currentModel, setCurrentModel] = useState("gpt-3.5-turbo");
  const [personality, setPersonality] = useState("You are a helpful bot.");
  const [temperature, setTemperature] = useState(0.5);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleSubmit(e?: { preventDefault?: () => void; }) {
    e?.preventDefault?.();
    if (!input) return;
    let chatLogNew = [...messages, { role: "user", content: `${input}` }];
    setMessages(chatLogNew);
    setInput("");

    const response = await fetch(
      `${server}/api/v1/gptChat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: chatLogNew,
          personality,
          currentModel,
          temperature,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    setMessages([...chatLogNew, { role: "assistant", content: `${data.message}` }]);
    console.log(data.message);
  }

  function handleKeyUp(e: React.KeyboardEvent) {
    if (e.keyCode === 13) {
      handleSubmit({});
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton slot="start" size="small" onClick={logout}>
            <IonIcon icon={logOutOutline} />
          </IonButton>
          <IonTitle>ChatGPT</IonTitle>
          <IonButton slot="end" size="small" onClick={refreshPage}>
            <IonIcon icon={refreshOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">ChatGPT</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {messages.map((m, i) => (
            <Message key={i} role={m.role} content={m.content} />
          ))}
          <div ref={messagesEndRef} />
        </IonList>
      </IonContent>
      <IonFooter>
        <IonItem>
          <IonInput
            ref={inputRef}
            value={input}
            placeholder="Type a message..."
            onIonChange={(e) => setInput(e.detail.value!)}
            onKeyUp={(e) => handleKeyUp(e)}
          />
          <IonButton onClick={handleSubmit}>Send</IonButton>
        </IonItem>
      </IonFooter>
    </IonPage>
  );
};

export default Tab1;

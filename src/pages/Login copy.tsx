import React, { useState, useEffect } from "react";
import { IonContent, IonPage, IonInput, IonButton } from "@ionic/react";
import "./Login.css";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "@firebase/auth";
import { auth } from "../firebase";
import { useHistory } from "react-router-dom";

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [error2, setError2] = useState("");
    const history = useHistory();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                history.push("/tab1");
            }
        });

        return () => {
            unsubscribe();
        };
    }, [history]);

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            history.push("/tab1");
        } catch (error) {
            console.error("Error signing in:", error);
            setError("Error signing in, please try again. " + error.message);
        }
    };

    const handleRegister = async () => {
        if (!username) {
            setError2("Please enter a username.");
            return;
        }

        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(user, { displayName: username });
            history.push("/tab1");
        } catch (error) {
            console.error("Error creating account:", error);
            setError2("Error creating account, please try again. " + error.message);
        }
    };

    return (
        <IonPage>
            <IonContent fullscreen>
                <div className="login-container">
                    <br></br>
                    <h2>Login</h2>
                    <IonInput
                        type="email"
                        aria-label="Email"
                        label="Email"
                        value={email}
                        onIonChange={(e) => setEmail(e.detail.value!)}
                    />
                    <IonInput
                        type="password"
                        aria-label="Password"
                        label="Password"
                        value={password}
                        onIonChange={(e) => setPassword(e.detail.value!)}
                    />
                    {error && <p className="error">{error}</p>}
                    <IonButton expand="block" color="success" onClick={handleLogin}>
                        Login
                    </IonButton>
                    <br></br>
                    <h2>Register</h2>
                    <IonInput
                        type="email"
                        aria-label="Email"
                        label="Email"
                        value={email}
                        onIonChange={(e) => setEmail(e.detail.value!)}
                    />
                    <IonInput
                        type="password"
                        aria-label="Password"
                        label="Password"
                        value={password}
                        onIonChange={(e) => setPassword(e.detail.value!)}
                    />
                    <IonInput
                        type="text"
                        aria-label="Username"
                        label="Username"
                        value={username}
                        onIonChange={(e) => setUsername(e.detail.value!)}
                    />
                    {error2 && <p className="error">{error2}</p>}

                    <IonButton expand="block" onClick={handleRegister}>
                        Register
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default LoginPage;

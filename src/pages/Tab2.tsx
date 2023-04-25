import React, { useState } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonLabel, IonItem, IonInput, IonImg } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { server } from '../constant';
import { auth } from '../firebase';

const logout = () => {
  auth.signOut();
};

const CreatePost = () => {
  const history = useHistory();
  const [form, setForm] = useState({
    name: auth.currentUser?.displayName || 'Anonymous',
    prompt: '',
    photo: '',
  });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch(`${server}/api/v1/dalle`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: form.prompt }),
        })

        const data = await response.json();

        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (error) {
        alert(error);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert('Please enter a prompt')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);

      try {
        const response = await fetch(`${server}/api/v1/post`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form)
        })

        await response.json();
        history.push('/tab3');
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please enter a prompt and generate an image');
    }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });


  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Art with Dall-E</IonTitle>
          <IonButton slot="end" size='small' onClick={logout}>
            Logout
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className="ion-padding">
          <p>Create imaginative and visually stunning images through Dall-E AI and share them with the community.</p>
          <form onSubmit={handleSubmit}>
            <IonItem>
              <IonLabel position="stacked">Your name</IonLabel>
              <IonInput type="text" name="name" placeholder="John Doe" value={form.name} readonly={true} onIonChange={handleChange} />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Prompt</IonLabel>
              <IonInput type="text" name="prompt" placeholder="A BBQ that is alive, in the style of a Pixar animated movie" value={form.prompt} onIonChange={handleChange} />
            </IonItem>
            <IonButton onClick={handleSurpriseMe} expand="block" fill="outline">Surprise Me</IonButton>
            <IonButton type="button" onClick={generateImage} expand="block" color="success">
              {generatingImg ? 'Generating...' : 'Generate'}
            </IonButton>
            <div className="ion-padding ion-text-center">
              {form.photo ? (
                <IonImg src={form.photo} alt={form.prompt} />
              ) : (
                <IonImg src={preview} alt="preview" />
              )}

              {generatingImg && (
                <div className="absolute inset-0 z-0 flex justify-center items-center bg-opacity-50 bg-black rounded-lg">
                  {/* Add Loader component here */}
                </div>
              )}
            </div>
            <div className="ion-padding">
              <p>Once you have created the image you want, you can share it with others in the community.</p>
              <IonButton type="submit" expand="block">
                {loading ? 'Sharing...' : 'Share with the community'}
              </IonButton>
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CreatePost;

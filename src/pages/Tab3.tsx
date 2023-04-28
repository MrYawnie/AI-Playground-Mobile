import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, IonButton, IonIcon } from '@ionic/react';
import { server } from '../constant';
import { auth } from '../firebase';
import { logOutOutline, refreshOutline } from 'ionicons/icons';

interface ImageData {
  _id: string;
  name: string;
  prompt: string;
  photo: string;
}

const logout = () => {
  auth.signOut();
};

const refreshPage = () => {
  window.location.reload();
};

const Gallery: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);

  useEffect(() => {
    fetch(`${server}/api/v1/post`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setImages(data.data.reverse());
          console.log(data.data);
        }
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton slot="start" size='small' onClick={logout}>
            <IonIcon icon={logOutOutline} />
          </IonButton>
          <IonTitle>Dall-E Gallery</IonTitle>
          <IonButton slot="end" size="small" onClick={refreshPage}>
            <IonIcon icon={refreshOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {images.map((image: ImageData) => (
          <IonCard key={image._id}>
            <IonImg src={image.photo} alt={image.prompt} />
            <IonCardHeader>
              <IonCardTitle>{image.name}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>{image.prompt}</IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Gallery;

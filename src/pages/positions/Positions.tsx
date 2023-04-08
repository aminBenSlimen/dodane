import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonButtons,
  IonIcon,
} from '@ionic/react';
import { trash } from 'ionicons/icons';

const Positons: React.FC = () => {
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = () => {
    const savedLocations = JSON.parse(localStorage.getItem('locations') || '[]');
    setLocations(savedLocations);
  };

  const deleteLocation = (index: number) => {
    const newLocations = [...locations];
    newLocations.splice(index, 1);
    localStorage.setItem('locations', JSON.stringify(newLocations));
    setLocations(newLocations);
  };

  const clearAllLocations = () => {
    localStorage.removeItem('locations');
    setLocations([]);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Positions</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={clearAllLocations}>Clear All</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {locations.map((location, index) => (
            <IonItem key={index} >
              <IonLabel>
                Latitude: {location.latitude}, Longitude: {location.longitude}
              </IonLabel>
              <IonButton fill="clear" slot="end" onClick={() => deleteLocation(index)}>
                <IonIcon icon={trash} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Positons;

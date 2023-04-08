import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonBackButton,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
} from "@ionic/react";
import { Geolocation, Position } from "@capacitor/geolocation";
import "./AddLocation.css";
import { trash } from "ionicons/icons";

const AddLocation: React.FC = () => {
  const saveCurrentLocation = async () => {
    try {
      const position: Position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      const locations = JSON.parse(localStorage.getItem("locations") || "[]");
      locations.push({ latitude, longitude });
      localStorage.setItem("locations", JSON.stringify(locations));
    } catch (err) {
      console.error("Error getting current position:", err);
    }
    loadLocations();
  };

  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = () => {
    const savedLocations = JSON.parse(
      localStorage.getItem("locations") || "[]"
    );
    setLocations(savedLocations);
  };

  const deleteLocation = (index: number) => {
    const newLocations = [...locations];
    newLocations.splice(index, 1);
    localStorage.setItem("locations", JSON.stringify(newLocations));
    setLocations(newLocations);
  };

  const clearAllLocations = () => {
    localStorage.removeItem("locations");
    setLocations([]);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Location</IonTitle>
          <IonButtons slot="start">
            <IonBackButton text="Track" defaultHref="/"></IonBackButton>
          </IonButtons>
          <IonButton onClick={clearAllLocations} slot="end">
            Clear All
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton expand="full" onClick={saveCurrentLocation}>
          Save Current Location
        </IonButton>

        <IonList>
          {locations.map((location, index) => (
            <IonItem key={index}>
              <div>
              {index} - &nbsp;
              </div>

              <IonLabel>
                Latitude: {location.latitude}, Longitude: {location.longitude}
              </IonLabel>
              <IonButton
                fill="clear"
                slot="end"
                onClick={() => deleteLocation(index)}
              >
                <IonIcon icon={trash} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};
export default AddLocation;

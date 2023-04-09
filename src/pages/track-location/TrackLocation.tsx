import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { NativeAudio } from "@capacitor-community/native-audio";
import { Geolocation, Position } from "@capacitor/geolocation";
import "./TrackLocation.css";
import { Capacitor } from "@capacitor/core";
const TrackLocation: React.FC = () => {
  const [closestLocation, setClosestLocation] = useState<{
    latitude: number;
    longitude: number;
  }>();
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  }>();
  const [closestDistance, setClosestDistance] = useState<number>();
  const [watchId, setWatchId] = useState<string>();

  useEffect(() => {
    return () => {
      if (watchId) {
        Geolocation.clearWatch({ id: watchId });
      }
    };
  }, [watchId]);

  const playAlarm = async (assetId: string) => {
    if (Capacitor.isPluginAvailable("NativeAudio")) {
      await NativeAudio.play({ assetId, time: 1 });
    }
  };
  const startTracking = async () => {
    const newWatchId = await Geolocation.watchPosition(
      { enableHighAccuracy: true, maximumAge: 2 },
      (position: Position | null, err: any) => {
        console.log(position);

        if (!err && position) {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });

          calculateClosestLocation(
            position.coords.latitude,
            position.coords.longitude
          );
        }
      }
    );

    setWatchId(newWatchId);
  };

  const stopTracking = () => {
    if (watchId) {
      Geolocation.clearWatch({ id: watchId });
      setWatchId(undefined);
    }
  };

  const calculateClosestLocation = (latitude: number, longitude: number) => {
    const locations = JSON.parse(localStorage.getItem("locations") || "[]");
    let minDistance = Infinity;

    locations.forEach((location: { latitude: number; longitude: number }) => {
      const distance = getDistance(
        latitude,
        longitude,
        location.latitude,
        location.longitude
      );
      if (distance < minDistance) {
        minDistance = distance;
        setClosestLocation(location);
        setClosestDistance(distance);
      }
    });
    if (!closestDistance) return;
    if (closestDistance <= 30) {
      console.log("it's 30");
      playAlarm("30metersAlarm");
    } else if (closestDistance <= 100) {
      console.log("it's 100");
      playAlarm("100metersAlarm");
    }
  };

  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3; // Earth radius in meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value: number): number => {
    return (value * Math.PI) / 180;
  };
  const toggleTracking = () => {
    if (watchId) {
      stopTracking();
    } else {
      startTracking();
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Track Location</IonTitle>
          <IonButton slot="end" routerLink="/add">
            Add New Position
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {closestLocation && (
          <div>
            <p>Closest saved location:</p>
            <p>
              Latitude: {closestLocation.latitude} Longitude:{" "}
              {closestLocation.longitude}
            </p>
          </div>
        )}
        <br />

        {currentLocation && (
          <div>
            <p>current location:</p>
            <p>
              Latitude: {currentLocation.latitude} Longitude:{" "}
              {currentLocation.longitude}
            </p>
          </div>
        )}
        <br />

        {currentLocation && closestLocation && (
          <p>Distance: {closestDistance} meters</p>
        )}
        <button
          className={`toggle-button ${watchId ? "tracking" : ""}`}
          onClick={toggleTracking}
        >
          {watchId ? "Stop Tracking" : "Start Tracking"}
        </button>
      </IonContent>
    </IonPage>
  );
};

export default TrackLocation;

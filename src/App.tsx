import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";
import ViewMessage from "./pages/ViewMessage";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import TrackLocation from "./pages/track-location/TrackLocation";
import AddLocation from "./pages/add-location/AddLocation";

import { registerPlugin } from "@capacitor/core";
import { Capacitor } from "@capacitor/core";
import { useEffect } from "react";
import Positons from "./pages/positions/Positions";
const NativeAudio: any = registerPlugin("NativeAudio");

setupIonicReact();

const App: React.FC = () => {
  useEffect(() => {
    if (Capacitor.isPluginAvailable("NativeAudio")) {
      NativeAudio.preload({
        assetId: "100metersAlarm",
        path: "assets/100Alarm.mp3",
      });
      NativeAudio.preload({
        assetId: "30metersAlarm",
        path: "assets/30Alarm.mp3",
      });
    }
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" exact={true}>
            <Redirect to="/TrackingLocation" />
          </Route>
          <Route path="/add" exact={true}>
            <AddLocation />
          </Route>
          <Route path="/positons" exact={true}>
            <Positons />
          </Route>
          <Route path="/TrackingLocation" exact={true}>
            <TrackLocation />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;

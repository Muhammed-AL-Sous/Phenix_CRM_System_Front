import { useLayoutEffect } from "react";
import { useNavigation } from "react-router";
import { useDispatch } from "react-redux";

import { setLoadingOverlayRouteNav } from "../store/Slices/uiSlice";

/** يزامن React Router navigation.state مع طبقة اللودر الموحّدة */
export default function RouteNavPendingEmitter() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(setLoadingOverlayRouteNav(navigation.state === "loading"));
  }, [navigation.state, dispatch]);

  return null;
}

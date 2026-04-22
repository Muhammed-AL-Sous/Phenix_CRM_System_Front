import { useLayoutEffect } from "react";
import { useDispatch } from "react-redux";

import { setLoadingOverlayRouteSuspense } from "../store/Slices/uiSlice";

/** يُعلّق Redux أثناء fallback لـ Suspense (تحميل كسول) — بدون إعادة mount للّوتي */
export default function RouteSuspenseGate() {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(setLoadingOverlayRouteSuspense(true));
    return () => {
      dispatch(setLoadingOverlayRouteSuspense(false));
    };
  }, [dispatch]);

  return null;
}

import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { TextlessBroadcastOverlay, OVERLAY_STYLES } from "./TextlessBroadcastOverlay";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {OVERLAY_STYLES.map((style) => {
        const id = style
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join("");
        return (
          <Composition
            key={style}
            id={id}
            component={TextlessBroadcastOverlay}
            durationInFrames={180}
            fps={30}
            width={3840}
            height={2160}
            defaultProps={{
              style: style,
            }}
          />
        );
      })}
    </>
  );
};

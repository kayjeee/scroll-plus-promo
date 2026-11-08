import { Video } from "@remotion/media";
import { ThreeCanvas } from "@remotion/three";
import { zColor } from "@remotion/zod-types";
import React, { useCallback, useMemo, useState } from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { CanvasTexture, Texture } from "three";
import { z } from "zod";
import { MediabunnyMetadata } from "./helpers/get-media-metadata";
import { getPhoneLayout } from "./helpers/layout";
import { Phone } from "./Phone";

const container: React.CSSProperties = {
  backgroundColor: "white",
};

export const myCompSchema = z.object({
  phoneColor: zColor(),
  deviceType: z.enum(["phone", "tablet"]),
});

type MyCompSchemaType = z.infer<typeof myCompSchema>;

export const Scene: React.FC<
  {
    readonly baseScale: number;
    mediaMetadata: MediabunnyMetadata | null;
    videoSrc: string | null;
  } & MyCompSchemaType
> = ({ baseScale, phoneColor, mediaMetadata, videoSrc }) => {
  const { width, height } = useVideoConfig();

  if (!mediaMetadata) {
    throw new Error("Media metadata is not available");
  }
  if (!videoSrc) {
    throw new Error("Video source is not available");
  }

  const aspectRatio = useMemo(
    () => mediaMetadata.dimensions.width / mediaMetadata.dimensions.height,
    [mediaMetadata.dimensions.width, mediaMetadata.dimensions.height],
  );

  const layout = useMemo(
    () => getPhoneLayout(aspectRatio, baseScale),
    [aspectRatio, baseScale],
  );

  const [canvasTexture] = useState(() => {
    return new OffscreenCanvas(
      mediaMetadata.dimensions.width,
      mediaMetadata.dimensions.height,
    );
  });

  const [context] = useState(() => {
    const ctx = canvasTexture.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get context");
    }
    return ctx;
  });

  const [texture] = useState<Texture>(() => {
    const tex = new CanvasTexture(canvasTexture);
    tex.repeat.y = 1 / layout.screen.height;
    tex.repeat.x = 1 / layout.screen.width;
    return tex;
  });

  const onVideoFrame = useCallback(
    (frame: CanvasImageSource) => {
      context.drawImage(frame, 0, 0);
      texture.needsUpdate = true;
    },
    [context, texture],
  );

  return (
    <AbsoluteFill style={container}>
      <Video src={videoSrc} onVideoFrame={onVideoFrame} headless muted />
      <ThreeCanvas linear width={width} height={height}>
        <ambientLight intensity={1.5} color={0xffffff} />
        <pointLight position={[10, 10, 0]} />
        <Phone
          phoneColor={phoneColor}
          phoneLayout={layout}
          texture={texture}
        />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

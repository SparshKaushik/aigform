"use client";

import Lottie, { type LottieComponentProps } from "lottie-react";

import * as emptyAnimation from "./lottie/empty.json";

export function LottiePlayer(props: LottieComponentProps) {
  return <Lottie {...props} />;
}

export function EmptyLottie(props: Partial<LottieComponentProps>) {
  return (
    <LottiePlayer
      animationData={emptyAnimation}
      loop={true}
      autoplay={true}
      {...props}
    />
  );
}

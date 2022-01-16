import { useState, useEffect, useRef, MutableRefObject } from "react";
import ReactPlayer from "react-player";
import { VideoInterface } from "../../interfaces";
import { baseurl } from "../../lib/fetcher";
import dynamic from "next/dynamic";

const Controls = dynamic(() => import("./Controls"), { ssr: false });

interface onProgressInterface {
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
}

export interface Played {
  seconds: number;
  ratio: number;
}

export default function VideoPlayer({
  video,
  playerRef,
}: {
  video: VideoInterface;
  playerRef: MutableRefObject<ReactPlayer | undefined>;
}) {
  const [muted, setMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0);
  const [playing, setPlaying] = useState(false);

  const [played, setPlayed] = useState<Played>({ seconds: 0, ratio: 0 });
  const [loaded, setLoaded] = useState<number>(0);

  // useEffect(() => {
  //   const handleTogglePlay = (e: KeyboardEvent) => {
  //     if (e.code === "Space") setPlaying(!playing);
  //   };

  //   window.addEventListener("keypress", handleTogglePlay);

  //   return () => {
  //     window.removeEventListener("keypress", handleTogglePlay);
  //   };
  // }, [playing]);

  const handleProgress = (state: onProgressInterface) => {
    setPlayed({ ratio: state.played, seconds: state.playedSeconds });
    setLoaded(state.loaded);
  };

  const wrapperRef = useRef(null);

  return (
    <div
      className="relative max-h-full md:max-h-[45%] bg-black parentwrap"
      ref={wrapperRef}
      id="player"
    >
      <div className="absolute hidden top-0 left-0 text-white text-xl font-thin p-2 childhover fade-in mix-blend-difference">
        {video.name}
      </div>
      <div
        className="h-full"
        onClick={() => {
          setPlaying(!playing);
        }}
      >
        <ReactPlayer
          ref={playerRef as any}
          width="100%"
          height="100%"
          volume={volume}
          muted={muted}
          playing={playing}
          onProgress={handleProgress}
          url={`${baseurl}/video/stream/${video.path}`}
        />
      </div>
      <Controls
        muted={muted}
        setMuted={setMuted}
        playing={playing}
        setPlaying={setPlaying}
        played={played}
        setPlayed={setPlayed}
        loaded={loaded}
        volume={volume}
        setVolume={setVolume}
        playerRef={playerRef}
        wrapperRef={wrapperRef}
      />
    </div>
  );
}

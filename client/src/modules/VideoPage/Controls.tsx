import { useEffect, useState } from "react";
import { BiPause, BiPlay, BiFullscreen } from "react-icons/bi";
import {
  ImVolumeMute2,
  ImVolumeMedium,
  ImVolumeMute,
  ImVolumeLow,
} from "react-icons/im";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import secondsFormater from "../../lib/secondsFormater";
import { Played } from "./VideoPlayer";

export default function Controls({
  muted,
  setMuted,
  playing,
  setPlaying,
  played,
  setPlayed,
  loaded,
  volume,
  setVolume,

  playerRef,
  wrapperRef,
}: {
  muted: boolean;
  setMuted: React.Dispatch<React.SetStateAction<boolean>>;
  playing: boolean;
  setPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  played: Played;
  setPlayed: React.Dispatch<React.SetStateAction<Played>>;
  loaded: number;
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  playerRef: React.MutableRefObject<ReactPlayer | undefined>;
  wrapperRef: React.MutableRefObject<null>;
}) {
  const [volumeMenu, setVolumeMenu] = useState(false);
  const [duration, setDuration] = useState(
    new Date(playerRef.current?.getDuration()! * 1000)
  );

  useEffect(() => {
    setDuration(new Date(playerRef.current?.getDuration()! * 1000));
  }, [playerRef.current?.getDuration()]);

  const handlePlaying = () => setPlaying(!playing);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(parseFloat(e.target.value));
    setPlayed({ ...played, ratio: parseFloat(e.target.value) });
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!playerRef.current) return;
    setVolume(parseFloat(e.target.value));
  };

  const handleFullscreen = () => {
    if (!wrapperRef.current) return;
    screenfull.toggle(wrapperRef.current);
  };

  const VolumeIcon = () => {
    const ChoseIcon = () => {
      if (muted) return <ImVolumeMute2 size={20} cursor={"pointer"} />;
      if (volume > 0.66) return <ImVolumeMedium size={20} cursor={"pointer"} />;
      if (volume == 0) return <ImVolumeMute size={20} cursor={"pointer"} />;
      return <ImVolumeLow size={20} cursor={"pointer"} />;
    };

    return (
      <div onClick={() => setMuted(!muted)}>
        <ChoseIcon />
      </div>
    );
  };

  return (
    <div className="absolute hidden flex-col p-1 pb-0 items-center justify-center w-full h-12 bottom-0 left-0 childhover fade-in">
      <div className="relative w-full h-[3px] wrap">
        <input
          type="range"
          min={0}
          max={0.999999}
          step="any"
          value={played.ratio}
          onChange={handleSeekChange}
          className="absolute rounded-none top-0 h-full w-full range z-40"
          style={{
            background: `linear-gradient(to right,     
                #cc181e 0%,
                #cc181e ${played.ratio * 100}%,
                #777 ${played.ratio * 100}%,
                #777 ${loaded * 100}%,
                #444 ${loaded * 100}%,
                #444 100%)`,
          }}
        />
        <div className="absolutetop-0 w-full h-full bg-gray-300 opacity-45"></div>
      </div>
      <div className="flex flex-row text-white justify-between w-full pr-1 items-center">
        <div className="flex flex-row items-center">
          {playing ? (
            <BiPause size={38} cursor={"pointer"} onClick={handlePlaying} />
          ) : (
            <BiPlay size={38} cursor={"pointer"} onClick={handlePlaying} />
          )}
          <div
            className="flex items-center"
            onMouseEnter={() => setVolumeMenu(true)}
            onMouseLeave={() => setVolumeMenu(false)}
          >
            <VolumeIcon />
            {volumeMenu && !muted && (
              <input
                type="range"
                step="any"
                className="volume mx-2 w-[100px] h-[3px]"
                min={0}
                max={1}
                value={volume}
                onChange={handleVolume}
                style={{
                  background: `linear-gradient(to right, 
                      #fff 0%, 
                      #fff ${volume * 100}%, 
                      #444 ${volume * 100}%)`,
                }}
              />
            )}

            <div className="flex text-[13px]">
              {secondsFormater(playerRef.current?.getCurrentTime())}/
              {secondsFormater(playerRef.current?.getDuration())}
            </div>
          </div>
        </div>
        <div className="flex">
          <BiFullscreen
            size={25}
            cursor={"pointer"}
            onClick={handleFullscreen}
          />
        </div>
      </div>
    </div>
  );
}

import { memo, useRef, useState } from "react";

type Props = {
  src: string;
};

function Icon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path
        d="M9 18V6l12-2v12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="7"
        cy="18"
        r="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="19"
        cy="16"
        r="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export default memo(function MusicPlayer({ src }: Props) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = async () => {
    if (!audio.current) return;

    if (playing) {
      audio.current.pause();
      setPlaying(false);
    } else {
      audio.current.loop = true;
      await audio.current.play();
      setPlaying(true);
    }
  };

  return (
    <div className="music">
      <button
        type="button"
        className={`music__btn ${playing ? "music__btn--on" : ""}`}
        onClick={toggle}
        aria-label="Toggle music"
      >
        <span className="music__icon">
          <Icon />
        </span>
        <span className="music__dot" />
      </button>

      <audio ref={audio} src={src} />
    </div>
  );
});

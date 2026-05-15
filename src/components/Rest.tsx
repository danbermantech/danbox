import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { endMinigame } from '$store/slices/gameProgressSlice';
import triggerNextQueuedAction from '$store/actions/triggerNextQueuedAction';

type RandomDogResponse = {
  fileSizeBytes: number;
  url: string;
};

const RANDOM_DOG_URL = 'https://random.dog/woof.json';
const REST_DURATION_MS = 30_000;
const MAX_FETCH_ATTEMPTS = 6;

function isRandomDogResponse(value: unknown): value is RandomDogResponse {
  if (!value || typeof value !== 'object') return false;
  const payload = value as Partial<RandomDogResponse>;
  return typeof payload.fileSizeBytes === 'number' && typeof payload.url === 'string';
}

function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|bmp|avif)(\?.*)?$/i.test(url);
}

const Rest = () => {
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(Math.ceil(REST_DURATION_MS / 1000));
  const hasAdvancedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const fetchDogImage = async () => {
      setError(null);

      for (let attempt = 0; attempt < MAX_FETCH_ATTEMPTS; attempt += 1) {
        try {
          const response = await fetch(RANDOM_DOG_URL, { cache: 'no-store' });
          if (!response.ok) continue;

          const json = (await response.json()) as unknown;
          if (!isRandomDogResponse(json)) continue;
          if (!isImageUrl(json.url)) continue;

          if (!cancelled) {
            setImageUrl(json.url);
          }
          return;
        } catch {
          // Try again a few times before showing fallback.
        }
      }

      if (!cancelled) {
        setError('Could not load a dog image right now, but your rest timer is still running.');
      }
    };

    fetchDogImage();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((previous) => Math.max(0, previous - 1));
    }, 1000);

    const timeout = setTimeout(() => {
      if (hasAdvancedRef.current) return;
      hasAdvancedRef.current = true;
      dispatch(endMinigame());
      dispatch(triggerNextQueuedAction());
    }, REST_DURATION_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [dispatch]);

  const timerLabel = useMemo(() => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }, [timeRemaining]);

  return (
    <div className='w-full flex flex-col items-center gap-6 text-black'>
      <h1 className='text-7xl font-titan font-bold text-center'>REST</h1>
      <p className='text-2xl text-center'>Take a breather. Next action starts in {timerLabel}.</p>

      <div className='w-full max-w-3xl min-h-96 rounded-2xl border-4 border-black bg-gradient-to-br from-sky-100 to-cyan-200 p-3 flex items-center justify-center'>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt='Random dog to rest with'
            className='max-h-[60vh] w-full object-contain rounded-xl'
          />
        ) : (
          <div className='text-xl text-center px-6'>
            {error ?? 'Fetching a random dog image...'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rest;
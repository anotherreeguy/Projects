import React, { useEffect, useRef, useState } from 'react';

const soundsPath = '/projects/mcskinstealer/src/sound/';
const soundFiles = {
  click: 'se_ui_common_scroll_click.wav',
  hover: 'se_ui_common_select_showdetail.wav',
  error: 'se_ui_common_select_pagemove.wav',
  success: 'se_ui_common_goodbtn04.wav',
  completeSearchOptions: [
    'se_ui_common_goodbtn04.wav',
    'se_ui_common_decide07.wav',
  ]
};

const soundObj = {};
Object.entries(soundFiles).forEach(([key, val]) => {
  if (Array.isArray(val)) {
    soundObj[key] = val.map(f => new Audio(soundsPath + f));
  } else {
    soundObj[key] = new Audio(soundsPath + val);
  }
});

const getAverageColor = (img) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let r = 0, g = 0, b = 0, count = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 128) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
  }
  if (count === 0) return { r: 17, g: 17, b: 17 };
  return {
    r: Math.floor(r / count),
    g: Math.floor(g / count),
    b: Math.floor(b / count),
  };
};

const darkenColor = ({ r, g, b }, pct = 0.3) => {
  return `rgb(${Math.floor(r * pct)}, ${Math.floor(g * pct)}, ${Math.floor(b * pct)})`;
};

export default function SkinFinderApp() {
  const [edition, setEdition] = useState('mcpe');
  const [previousSkins, setPreviousSkins] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [skinData, setSkinData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const usernameRef = useRef();
  const skinPreviewRef = useRef();
  const technoAudio = useRef(new Audio('/projects/mcskinstealer/src/sound/techno.mp3'));
  const envixityAudio = useRef(new Audio('/projects/mcskinstealer/src/sound/creditstonintendo.mp3'));

  const playSound = (sound) => {
    if (!soundEnabled) return;
    if (Array.isArray(sound)) {
      const chosen = sound[Math.floor(Math.random() * sound.length)];
      chosen.currentTime = 0;
      chosen.play().catch(() => {});
    } else {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  };

  const updateFavicon = (textureId) => {
    let link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.href = `https://mc-heads.net/avatar/${textureId}`;
    document.head.appendChild(link);
  };

  const handleSkinColorBackground = (url) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = () => {
      const avgColor = getAverageColor(img);
      document.body.style.backgroundColor = darkenColor(avgColor);
    };
    img.onerror = () => {
      document.body.style.backgroundColor = '#111';
    };
  };

  const fetchSkin = async (username) => {
    if (!username) return;
    setLoading(true);
    setError('');

    const isEnvixity = username.toLowerCase() === 'envixitybo2';
    const isTechno = username.toLowerCase() === 'technoblade';

    if (isEnvixity) {
      envixityAudio.current.play().catch(() => {});
    } else {
      envixityAudio.current.pause();
      envixityAudio.current.currentTime = 0;
    }

    if (isTechno) {
      technoAudio.current.play().catch(() => {});
    } else {
      technoAudio.current.pause();
      technoAudio.current.currentTime = 0;
    }

    try {
      const response = await fetch(`https://tolerant-destined-mosquito.ngrok-free.app/${encodeURIComponent(username)}?edition=${edition}`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });

      if (!response.ok) throw new Error('Network response not OK');
      const data = await response.json();

      const { texture_id: textureId, username: realName, previous_skins = [], isSlim } = data;
      let skinUrl = `https://vzge.me/full/310/${textureId}.png?no=shadow`;
      if (isSlim) skinUrl += '&slim=true';

      updateFavicon(textureId);
      handleSkinColorBackground(skinUrl);

      setSkinData({ username: realName, textureId, skinUrl });

      setPreviousSkins((prev) => {
        const newEntry = {
          textureId,
          username: realName,
          skinUrl
        };
        const unique = [newEntry, ...prev.filter(p => p.textureId !== textureId)];
        return unique.slice(0, 20);
      });

      playSound(soundObj.success);
      playSound(soundObj.completeSearchOptions);
    } catch (err) {
      setError('Failed to load skin or user does not exist.');
      playSound(soundObj.error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditionToggle = () => {
    setEdition((prev) => prev === 'mcpe' ? 'java' : 'mcpe');
    playSound(soundObj.click);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const editionParam = params.get('edition');
    const usernameParam = params.get('username');

    if (editionParam === 'java' || editionParam === 'mcpe') setEdition(editionParam);
    if (usernameParam) {
      usernameRef.current.value = usernameParam;
      fetchSkin(usernameParam);
    }
  }, []);

  return (
    <div>
      <input ref={usernameRef} placeholder="Enter Minecraft username" />
      <button onClick={() => fetchSkin(usernameRef.current.value)}>Search</button>
      <button onClick={handleEditionToggle}>Edition: {edition === 'java' ? 'Java' : 'Bedrock'} Edition</button>
      <button onClick={() => {
        setSoundEnabled(!soundEnabled);
        playSound(soundObj.click);
      }}>
        {soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}

      {skinData && (
        <div>
          <h2>{skinData.username}</h2>
          <img ref={skinPreviewRef} src={skinData.skinUrl} alt="Skin Preview" style={{ width: 200 }} />
          <a href={`https://mc-heads.net/download/${skinData.textureId}`} download={`${skinData.textureId}.png`}>
            Download Skin
          </a>
        </div>
      )}

      <div>
        <h3>Previous Skins:</h3>
        <div style={{ display: 'flex', gap: 10 }}>
          {previousSkins.map((skin, idx) => (
            <img
              key={idx}
              src={`https://mc-heads.net/avatar/${skin.textureId}/40`}
              alt={skin.username}
              title={skin.username}
              onClick={() => {
                setSkinData(skin);
                playSound(soundObj.click);
              }}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
import './Avatar.css';

export default function Avatar({ photo, name, size = 'sm', className = '' }) {
  const initial = (name || '?')[0].toUpperCase();
  if (photo) {
    return (
      <img src={photo} alt={name || 'avatar'}
           className={`av av--${size} ${className}`} />
    );
  }
  return (
    <div className={`av av--${size} av--init ${className}`} aria-label={name}>
      {initial}
    </div>
  );
}

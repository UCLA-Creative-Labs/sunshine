// Helper to generate consistent colors from names
  export const getColor = (name) => {
    const colors = ['#FFB6C1', '#ADD8E6', '#DDA0DD', '#F0E68C', '#98FB98', '#FFE4B5', '#E0BBE4', '#B4E7CE'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  export const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
export default function Icon({
  name, 
  size=26, 
  color="white", 
  className,
  onClick = () => {}
}) {
  return (
    <svg
      className={className}
      style={{ width: size, height: size, fill: color }}
      onClick={onClick}
    >
      <use xlinkHref={`#${name}`} />
    </svg>
  ); 
};
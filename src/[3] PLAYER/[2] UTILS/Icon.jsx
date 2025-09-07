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
      style={{ width: size, height: size, fill: color, cursor: "pointer" }}
      onClick={onClick}
    >
      <use href={`#${name}`} />
    </svg>
  ); 
};
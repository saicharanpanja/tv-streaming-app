function Logo({channel,className,style}) {
  return(
    <svg className={className} style={style}>
      <use href={`#${channel}`} />
    </svg>
  );
}

export default Logo;